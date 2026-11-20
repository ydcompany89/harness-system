// drawing.html → PDF(A3 가로) [+ 확인용 PNG]  사용: node render_pdf.mjs <out.pdf> [preview.png]
import { createRequire } from 'module'; const require = createRequire('/opt/node22/lib/node_modules/'); const { chromium } = require('playwright');
import { fileURLToPath } from 'url'; import path from 'path';
const here = path.dirname(fileURLToPath(import.meta.url)); const [,, pdf, png] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const p = await (await b.newContext({ viewport: { width: 1588, height: 1123 } })).newPage();
await p.goto('file://' + here + '/drawing.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
if (pdf) await p.pdf({ path: pdf, width: '420mm', height: '297mm', printBackground: true });
if (png) await p.screenshot({ path: png });
await b.close();
