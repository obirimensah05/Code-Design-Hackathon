import { chromium } from 'playwright';
const URL = 'http://localhost:3333/';
const PROFILE = { name: 'Jordan Reed', email: 'j@x.com', newToAi: false, usedTools: ['chatgpt'], field: 'marketing', role: 'Marketing Manager', goals: [], initials: 'JR' };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.addInitScript((p) => { localStorage.clear(); localStorage.setItem('pv_profile', JSON.stringify(p)); localStorage.setItem('pv_route', 'profile'); localStorage.setItem('pv_tweaks_collapsed', '1'); }, PROFILE);
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const data = await page.evaluate(() => {
  const h = document.querySelector('.profile-hero h1');
  const p = document.querySelector('.profile-hero p');
  const parent = document.querySelector('.profile-hero > div');
  const gp = document.querySelector('.profile-hero');
  if (!h || !p) return { err: 'not found' };
  const hcs = getComputedStyle(h); const pcs = getComputedStyle(p);
  const pcsx = getComputedStyle(parent); const gpcs = getComputedStyle(gp);
  const hrect = h.getBoundingClientRect(); const prect = p.getBoundingClientRect();
  return {
    h: { fontSize: hcs.fontSize, lineHeight: hcs.lineHeight, marginTop: hcs.marginTop, marginBottom: hcs.marginBottom, display: hcs.display, top: hrect.top, bottom: hrect.bottom, height: hrect.height },
    p: { fontSize: pcs.fontSize, lineHeight: pcs.lineHeight, marginTop: pcs.marginTop, display: pcs.display, top: prect.top, bottom: prect.bottom },
    parent: { display: pcsx.display, flexDirection: pcsx.flexDirection, gap: pcsx.gap },
    grandparent: { display: gpcs.display, gridTemplateColumns: gpcs.gridTemplateColumns, alignItems: gpcs.alignItems, padding: gpcs.padding },
    gap: prect.top - hrect.bottom,
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
