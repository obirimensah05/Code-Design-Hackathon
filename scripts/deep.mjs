import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.addInitScript(() => {
  localStorage.clear();
  localStorage.setItem('pv_profile', JSON.stringify({ name: 'Jordan Reed', email: 'j@x.com', newToAi: false, usedTools: ['chatgpt'], field: 'marketing', role: 'Marketing Manager', goals: [], initials: 'JR' }));
  localStorage.setItem('pv_route', 'profile');
  localStorage.setItem('pv_tweaks_collapsed', '1');
});
await page.goto('http://localhost:3333/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const data = await page.evaluate(() => {
  const h = document.querySelector('.profile-hero h1');
  const cs = getComputedStyle(h);
  const interesting = ['height','maxHeight','minHeight','fontSize','lineHeight','overflow','overflowY','display','contain','gridRow','alignSelf','position','inset','top','bottom','left','right','boxSizing','padding','paddingBottom','border','borderWidth','transform','transformOrigin','margin','marginBottom','opacity','visibility','isolation','zIndex','willChange','writingMode','textOrientation','fontKerning','fontVariantLigatures'];
  const out = {};
  interesting.forEach(k => { out[k] = cs[k]; });
  out.rect = h.getBoundingClientRect();
  out.innerText = h.innerText;
  out.scrollHeight = h.scrollHeight;
  out.offsetHeight = h.offsetHeight;
  out.clientHeight = h.clientHeight;
  return out;
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
