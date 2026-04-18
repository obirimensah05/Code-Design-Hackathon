import { chromium } from 'playwright';
const URL = 'http://localhost:3333/';
const PROFILE = { name: 'Jordan Reed', email: 'j@x.com', newToAi: false, usedTools: ['chatgpt'], field: 'marketing', role: 'Marketing Manager', goals: [], initials: 'JR' };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.addInitScript((p) => { localStorage.clear(); localStorage.setItem('pv_profile', JSON.stringify(p)); localStorage.setItem('pv_route', 'profile'); localStorage.setItem('pv_tweaks_collapsed', '1'); }, PROFILE);
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const data = await page.evaluate(() => {
  const h = document.querySelector('.profile-hero h1');
  const rules = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const r of Array.from(sheet.cssRules || [])) {
        if (r.selectorText && r.cssText && /h1|\.h-1/.test(r.selectorText) && h.matches(r.selectorText)) {
          rules.push({ sel: r.selectorText, css: r.cssText });
        }
      }
    } catch {}
  }
  return { outerHTML: h.outerHTML, parent: h.parentElement.outerHTML.slice(0, 400), matches: rules };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
