import { createRequire } from 'module'; const require = createRequire('/opt/node22/lib/node_modules/'); const { chromium } = require('playwright');
import path from 'path'; const here = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const p = await b.newPage({ viewport: { width: 941, height: 1672 }, deviceScaleFactor: 2 });
await p.goto('file://' + path.join(here, 'rs-insole-hero.html')); await p.waitForTimeout(500);
await p.screenshot({ path: path.join(here, '라라슈_인솔_키비주얼.png') }); await b.close(); console.log('done');
