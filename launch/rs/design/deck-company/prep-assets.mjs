// 에셋 준비: 라임 로고(소스 PNG 재색), 기술 배지 SVG→PNG, 제품 누끼/QR 복사
// 실행: node prep-assets.mjs  (입력 경로는 아래 상수 참고)
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const here = path.dirname(new URL(import.meta.url).pathname);
const brand = path.join(here, '../brand');
const ORIG = process.argv[2]; // 기존 상품소개서 unzip 폴더 (ppt/media 사용)
const out = (f) => path.join(here, 'img', f);

// 1) 로고: rs-logo-source.png (검정) → 네온 라임 #C6F432 (알파 유지)
const { data, info } = await sharp(path.join(brand, 'rs-logo-source.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const lum = data[i]; const a = data[i + 3];
  // 어두운 픽셀(로고)만 라임, 밝은 픽셀(배경)은 투명
  const keep = lum < 128 ? a : 0;
  data[i] = 0xC6; data[i + 1] = 0xF4; data[i + 2] = 0x32; data[i + 3] = keep;
}
await sharp(data, { raw: info }).png().toFile(out('logo-lime.png'));

// 2) 배지
for (const n of ['tire', 'wallpaper', 'esp', 'quadgrip', 'onepiece', 'collar', 'arch']) {
  await sharp(path.join(brand, `icons/svg/rs-badge-${n}.svg`), { density: 400 }).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(out(`badge-${n}.png`));
}
// 3) 제품 누끼·QR
fs.copyFileSync(path.join(ORIG, 'ppt/media/image2.png'), out('walking-cut.png'));
fs.copyFileSync(path.join(ORIG, 'ppt/media/image3.png'), out('insole-cut.png'));
fs.copyFileSync(path.join(here, '../onepager/qr-b2b.png'), out('qr-b2b.png'));
console.log('assets ok');
