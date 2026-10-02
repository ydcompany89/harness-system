import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const here = new URL('.', import.meta.url).pathname;
const b = await chromium.launch(); const p = await (await b.newContext({deviceScaleFactor:1.5})).newPage();
await p.setViewportSize({width:1600,height:900});
await p.goto(`file://${here}lime-options.html`); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(400);
await p.screenshot({path:`${here}lime-options.png`, fullPage:true}); await b.close();
