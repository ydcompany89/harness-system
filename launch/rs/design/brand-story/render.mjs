// 브랜드 스토리 세로 이미지 1080×1920 렌더: node render.mjs → 라라슈_브랜드스토리_1080x1920.png
import { createRequire } from 'module'; const require = createRequire('/opt/node22/lib/node_modules/'); const { chromium } = require('playwright');
import { fileURLToPath } from 'url'; import path from 'path';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 })).newPage();
await p.goto('file://' + dir + '/story.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
await p.screenshot({ path: dir + '/라라슈_브랜드스토리_1080x1920.png' }); await b.close();
