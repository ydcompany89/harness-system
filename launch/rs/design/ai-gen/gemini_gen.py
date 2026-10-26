"""제미나이 이미지 생성 (참조 이미지 필수 규칙): python3 gemini_gen.py <출력.jpg> "<지시문>" <참조1> [참조2 ...] [--model gemini-3-pro-image]
키는 환경 시크릿이 x-goog-api-key 헤더로 자동 첨부 — 코드에 키를 쓰지 않는다."""
import sys, json, base64, mimetypes, urllib.request
args = sys.argv[1:]; model = 'gemini-3.1-flash-image'
if '--model' in args: i = args.index('--model'); model = args[i + 1]; del args[i:i + 2]
out, prompt, refs = args[0], args[1], args[2:]
assert refs, '참조 이미지(실물 사진) 없이 생성 금지'
parts = [{'inlineData': {'mimeType': mimetypes.guess_type(r)[0] or 'image/jpeg', 'data': base64.b64encode(open(r, 'rb').read()).decode()}} for r in refs]
parts.append({'text': prompt})
body = json.dumps({'contents': [{'parts': parts}], 'generationConfig': {'responseModalities': ['IMAGE']}}).encode()
req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', body, {'Content-Type': 'application/json'})
try: d = json.load(urllib.request.urlopen(req, timeout=180))
except urllib.error.HTTPError as e: print('ERR', e.code, e.read()[:300]); sys.exit(1)
for c in d.get('candidates', []):
    for p in c['content']['parts']:
        if 'inlineData' in p: open(out, 'wb').write(base64.b64decode(p['inlineData']['data'])); print('saved', out, model, d.get('usageMetadata', {}).get('totalTokenCount'))
