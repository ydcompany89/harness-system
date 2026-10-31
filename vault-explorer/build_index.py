#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
동규 2번째뇌 — 볼트 인덱서 (읽기 전용)

볼트 전체 .md 를 스캔해서 explorer.html 이 읽는 인덱스를 만든다.
원본 .md 파일은 절대 수정하지 않는다 (읽기 모드로만 연다).

생성 파일 (이 스크립트가 있는 폴더 또는 --out 폴더에 생성):
  vault-index.json   노트 메타데이터 (경로/제목/폴더/태그/위키링크/본문 앞 300자/수정일)
  vault-index.js     위 JSON 을 window.VAULT_INDEX 로 감싼 것 → explorer.html 더블클릭(file://)용
  vault-content.js   미리보기·본문 검색용 전체 본문 (--no-content 로 생략 가능)

사용법:
  python build_index.py                       # 볼트 자동 탐지 (아래 VAULT_PATH → 상위 폴더 → 현재 폴더)
  python build_index.py "D:/Obsidian/동규2번째뇌"
  python build_index.py <볼트> --out <출력폴더> --no-content

표준 라이브러리만 사용 (pip 설치 불필요). Python 3.8+.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

# ── 설정 ─────────────────────────────────────────────────────────────
# 볼트 경로를 고정하고 싶으면 여기에 적는다. 비워두면 자동 탐지.
VAULT_PATH = ""

# 제외 폴더 (이름 기준, 어느 깊이에서든). 점(.)으로 시작하는 폴더(.git, .trash 등)도 자동 제외.
EXCLUDE_DIRS = {".obsidian", "_resources"}

EXCERPT_LEN = 300
# ────────────────────────────────────────────────────────────────────

FM_RE = re.compile(r"\A\ufeff?---[ \t]*\r?\n(.*?)(?:\r?\n)?^(?:---|\.\.\.)[ \t]*(?:\r?\n|\Z)", re.S | re.M)
FENCE_RE = re.compile(r"^(```|~~~)[^\n]*\n.*?^\1[ \t]*$", re.S | re.M)
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
COMMENT_RE = re.compile(r"%%.*?%%", re.S)
WIKILINK_RE = re.compile(r"(!?)\[\[([^\[\]\n]+?)\]\]")
INLINE_TAG_RE = re.compile(r"(?:(?<=\s)|^)#([^\s#!@$%^&*()=+\[\]{}|\\;:'\",.<>?`~]+)", re.M)
NON_MD_EXT_RE = re.compile(r"\.(png|jpe?g|gif|webp|svg|bmp|pdf|mp3|mp4|mov|webm|wav|m4a|ogg|zip|xlsx?|docx?|pptx?|hwp|csv|canvas|excalidraw)$", re.I)


def nfc(s: str) -> str:
    # macOS 는 한글 파일명을 NFD 로 저장 → 링크 텍스트(NFC)와 맞추기 위해 정규화
    return unicodedata.normalize("NFC", s)


# ── 아주 단순한 YAML 프론트매터 파서 (PyYAML 없이) ─────────────────────
def _unquote(v: str) -> str:
    v = v.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        return v[1:-1]
    return v


def parse_simple_yaml(block: str) -> dict:
    data: dict = {}
    key = None
    for raw in block.splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        m_item = re.match(r"^\s*-\s*(.*)$", raw)
        if m_item and key is not None:
            if not isinstance(data.get(key), list):
                data[key] = [] if data.get(key) in (None, "") else [data[key]]
            data[key].append(_unquote(m_item.group(1)))
            continue
        m_kv = re.match(r"^([^\s:][^:]*):\s*(.*)$", raw)
        if m_kv and not raw.startswith((" ", "\t")):
            key = m_kv.group(1).strip()
            val = m_kv.group(2).strip()
            if val.startswith("[") and val.endswith("]"):
                data[key] = [_unquote(x) for x in val[1:-1].split(",") if x.strip()]
            else:
                data[key] = _unquote(val)
    return data


def split_frontmatter(text: str):
    m = FM_RE.match(text)
    if not m:
        return {}, text.lstrip("\ufeff")
    try:
        fm = parse_simple_yaml(m.group(1))
    except Exception:
        fm = {}
    return fm, text[m.end():]


def norm_tags(value) -> list[str]:
    if value is None or value == "":
        return []
    items = value if isinstance(value, list) else [value]
    out = []
    for it in items:
        for t in re.split(r"[,\s]+", str(it)):
            t = nfc(t.strip().lstrip("#"))
            if t and t not in out:
                out.append(t)
    return out


def strip_code(body: str) -> str:
    body = FENCE_RE.sub(" ", body)
    body = INLINE_CODE_RE.sub(" ", body)
    return COMMENT_RE.sub(" ", body)


def make_excerpt(body: str) -> str:
    t = strip_code(body)
    t = re.sub(r"!\[\[[^\]]*\]\]", " ", t)                                          # 임베드
    t = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", t)                             # [[a|b]] → b
    t = re.sub(r"\[\[([^\]]+)\]\]", r"\1", t)                                        # [[a]] → a
    t = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", t)                                      # 이미지
    t = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", t)                                   # [a](url) → a
    t = re.sub(r"<[^>]+>", " ", t)                                                    # html
    t = re.sub(r"^\s{0,3}(#{1,6}\s+|>\s?|[-*+]\s+\[.\]\s+|[-*+]\s+|\d+\.\s+)", "", t, flags=re.M)
    t = re.sub(r"[*_~=]{1,3}", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t[:EXCERPT_LEN]


def extract_links(body: str) -> list[str]:
    links = []
    for m in WIKILINK_RE.finditer(strip_code(body)):
        inner = m.group(2).replace("\\|", "|")
        target = re.split(r"[|#^]", inner, maxsplit=1)[0].strip()
        if not target:
            continue  # [[#제목]] 같은 자기 참조
        if NON_MD_EXT_RE.search(target):
            continue  # 이미지/첨부 임베드는 노트 링크 아님
        target = nfc(target)
        if target not in links:
            links.append(target)
    return links


def extract_inline_tags(body: str) -> list[str]:
    tags = []
    for m in INLINE_TAG_RE.finditer(strip_code(body)):
        t = nfc(m.group(1).rstrip("/"))
        if t and not t.isdigit() and t not in tags:
            tags.append(t)
    return tags


# ── 볼트 탐색 ────────────────────────────────────────────────────────
def find_vault(arg: str | None, script_dir: Path) -> Path:
    for cand in (arg, VAULT_PATH):
        if cand:
            p = Path(cand).expanduser().resolve()
            if not p.is_dir():
                sys.exit(f"[오류] 볼트 폴더를 찾을 수 없음: {p}")
            return p
    for p in (script_dir.parent, Path.cwd()):
        if (p / ".obsidian").is_dir():
            return p.resolve()
    sys.exit(
        "[오류] 볼트를 자동으로 못 찾았습니다.\n"
        "  1) python build_index.py \"볼트경로\" 로 실행하거나\n"
        "  2) build_index.py 상단 VAULT_PATH 에 경로를 적거나\n"
        "  3) 이 폴더(vault-explorer)를 볼트 루트 바로 아래에 두세요."
    )


def scan(vault: Path, skip_dir: Path | None):
    files = []
    for root, dirs, fnames in os.walk(vault):
        rootp = Path(root)
        keep = []
        for d in dirs:
            full = (rootp / d).resolve()
            if d in EXCLUDE_DIRS or d.startswith("."):
                continue
            if skip_dir is not None and full == skip_dir:
                continue  # 탐색기 폴더 자체(샘플 볼트 포함)는 인덱싱하지 않음
            keep.append(d)
        dirs[:] = sorted(keep)
        for f in sorted(fnames):
            if f.lower().endswith(".md"):
                files.append(rootp / f)
    return files


def resolve_factory(rel_paths: list[str]):
    by_name: dict[str, list[int]] = {}
    by_path: dict[str, int] = {}
    for i, rp in enumerate(rel_paths):
        no_ext = rp[:-3].lower()
        by_path[no_ext] = i
        by_name.setdefault(no_ext.rsplit("/", 1)[-1], []).append(i)

    def resolve(target: str, src_folder: str):
        t = target.strip().replace("\\", "/").lstrip("/")
        if t.lower().endswith(".md"):
            t = t[:-3]
        t = t.lower()
        if "/" in t:
            if t in by_path:
                return by_path[t]
            hits = [i for p, i in by_path.items() if p.endswith("/" + t)]
            if hits:
                return min(hits, key=lambda i: len(rel_paths[i]))
            t = t.rsplit("/", 1)[-1]
        cands = by_name.get(t)
        if not cands:
            return None
        if len(cands) == 1:
            return cands[0]
        same = [i for i in cands if rel_paths[i].rsplit("/", 1)[0] == src_folder]
        return (same or sorted(cands, key=lambda i: (len(rel_paths[i]), rel_paths[i])))[0]

    return resolve


def write_atomic(path: Path, text: str):
    if path.suffix.lower() == ".md":
        raise RuntimeError("안전장치: .md 파일에는 절대 쓰지 않습니다 → " + str(path))
    tmp = path.with_name(path.name + ".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    os.replace(tmp, path)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # 윈도우 cp949 콘솔 깨짐 방지
    except Exception:
        pass

    ap = argparse.ArgumentParser(description="옵시디언 볼트 → vault-index.json (읽기 전용)")
    ap.add_argument("vault", nargs="?", help="볼트 폴더 경로 (생략 시 자동 탐지)")
    ap.add_argument("--out", help="출력 폴더 (기본: 이 스크립트가 있는 폴더)")
    ap.add_argument("--no-content", action="store_true", help="vault-content.js(전체 본문) 생성 생략")
    args = ap.parse_args()

    script_dir = Path(__file__).resolve().parent
    vault = find_vault(args.vault, script_dir)
    out_dir = Path(args.out).expanduser().resolve() if args.out else script_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    skip = script_dir if script_dir != vault and vault in script_dir.parents else None
    files = scan(vault, skip)
    rel_paths = [nfc(p.relative_to(vault).as_posix()) for p in files]
    resolve = resolve_factory(rel_paths)

    notes, content, folders = [], {}, set()
    n_links = n_unresolved = 0
    for i, (fp, rp) in enumerate(zip(files, rel_paths)):
        try:
            with open(fp, "r", encoding="utf-8", errors="replace") as f:  # 읽기 전용
                text = f.read()
            mtime = fp.stat().st_mtime
        except OSError as e:
            print(f"  [건너뜀] {rp}: {e}")
            continue
        fm, body = split_frontmatter(text)
        folder = rp.rsplit("/", 1)[0] if "/" in rp else ""
        parts = folder.split("/") if folder else []
        for k in range(1, len(parts) + 1):
            folders.add("/".join(parts[:k]))

        title = nfc(rp.rsplit("/", 1)[-1][:-3])
        fm_title = fm.get("title")
        links = extract_links(body)
        out, unresolved = [], []
        for t in links:
            j = resolve(t, folder)
            if j is None:
                unresolved.append(t)
            elif j != i and j not in out:
                out.append(j)
        n_links += len(out)
        n_unresolved += len(unresolved)

        fm_tags = norm_tags(fm.get("tags", fm.get("tag")))
        itags = [t for t in extract_inline_tags(body) if t not in fm_tags]
        al = fm.get("aliases", fm.get("alias"))
        aliases = [nfc(str(a)) for a in (al if isinstance(al, list) else [al]) if a] if al else []

        notes.append({
            "id": i,
            "path": rp,
            "title": title,
            **({"fm_title": nfc(str(fm_title))} if isinstance(fm_title, str) and fm_title else {}),
            "folder": folder,
            "tags": fm_tags,
            "itags": itags,
            "aliases": aliases,
            "links": links,
            "out": out,
            "unresolved": unresolved,
            "excerpt": make_excerpt(body),
            "mtime": dt.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M"),
            "mtime_ts": int(mtime),
            "size": len(body),
        })
        content[rp] = body

    # 건너뛴 파일이 있으면 id 를 다시 매겨야 out 인덱스가 어긋나지 않음
    if len(notes) != len(files):
        remap = {n["id"]: k for k, n in enumerate(notes)}
        for n in notes:
            n["id"] = remap[n["id"]]
            n["out"] = [remap[j] for j in n["out"] if j in remap]

    index = {
        "version": 1,
        "vault": vault.name,
        "generated": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "count": len(notes),
        "folders": sorted(folders),
        "notes": notes,
    }
    js = json.dumps(index, ensure_ascii=False, separators=(",", ":"))
    write_atomic(out_dir / "vault-index.json", js)
    write_atomic(out_dir / "vault-index.js", "window.VAULT_INDEX=" + js + ";\n")
    if args.no_content:
        stale = out_dir / "vault-content.js"
        if stale.exists():
            stale.unlink()
    else:
        write_atomic(out_dir / "vault-content.js",
                     "window.VAULT_CONTENT=" + json.dumps(content, ensure_ascii=False, separators=(",", ":")) + ";\n")

    has_in = {j for n in notes for j in n["out"]}
    orphans = sum(1 for n in notes if not n["out"] and n["id"] not in has_in)
    print(f"✔ 볼트: {vault}")
    print(f"✔ 노트 {len(notes)}개 · 폴더 {len(folders)}개 · 링크 {n_links}개 (미해결 {n_unresolved}) · 고아 {orphans}개")
    print(f"✔ 출력: {out_dir / 'vault-index.json'}")
    print("  → explorer.html 을 더블클릭해서 열면 됩니다.")


if __name__ == "__main__":
    main()
