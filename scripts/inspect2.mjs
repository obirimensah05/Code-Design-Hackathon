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
  if (!h) return { err: 'no h1' };
  const cs = getComputedStyle(h);
  return {
    innerText: h.innerText,
    innerHTML: h.innerHTML,
    height: cs.height, width: cs.width, overflow: cs.overflow, transform: cs.transform,
    position: cs.position, visibility: cs.visibility, opacity: cs.opacity,
    gridRowStart: cs.gridRowStart, alignSelf: cs.alignSelf,
    willChange: cs.willChange,
    rect: h.getBoundingClientRect(),
    parent_display: getComputedStyle(h.parentElement).display,
    parent_height: getComputedStyle(h.parentElement).height,
    parent_overflow: getComputedStyle(h.parentElement).overflow,
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
