// html 폴더의 각 장 → png 1080×1350
import { createRequire } from 'module'; const require = createRequire('/opt/node22/lib/node_modules/'); const { chromium } = require('playwright');
import fs from 'fs'; import path from 'path';
const [,, src, dst] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const p = await (await b.newContext({ viewport: { width: 1080, height: 1350 } })).newPage();
for (const f of fs.readdirSync(src).filter(f => f.endsWith('.html')).sort()) {
  await p.goto('file://' + path.join(src, f)); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
  await p.screenshot({ path: path.join(dst, f.replace('.html', '.png')) });
}
await b.close();
