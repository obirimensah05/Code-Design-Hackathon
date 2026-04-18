// Capture mobile screenshots of every critical surface + home variants.
// Runs against the local dev server. Images go to /tmp/pu-mobile/.
import { chromium } from 'playwright';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const URL = 'http://localhost:3333/';
const OUT = '/tmp/pu-mobile';

const DEVICES = [
  { name: 'iphone-se', w: 375, h: 667 },
  { name: 'iphone-14', w: 390, h: 844 },
  { name: 'pixel-pro', w: 430, h: 932 },
];

const PROFILE = {
  name: 'Jordan Reed', email: 'jordan@example.com',
  newToAi: false, usedTools: ['chatgpt', 'midjourney'],
  field: 'marketing', role: 'Marketing Manager',
  goals: ['Save time on daily tasks'], initials: 'JR',
};

async function seed(page, route = 'home', params = {}) {
  await page.addInitScript(({ p, r, par }) => {
    try {
      localStorage.clear();
      localStorage.setItem('pv_profile', JSON.stringify(p));
      localStorage.setItem('pv_points', '180');
      localStorage.setItem('pv_watched', JSON.stringify({ 1: Date.now(), 5: Date.now() }));
      localStorage.setItem('pv_ratings', JSON.stringify({ 1: 5 }));
      localStorage.setItem('pv_route', r);
      localStorage.setItem('pv_route_params', JSON.stringify(par));
      localStorage.setItem('pv_tweaks_collapsed', '1');
    } catch {}
  }, { p: PROFILE, r: route, par: params });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
}

async function setVariant(page, variant) {
  // expand tweaks
  await page.locator('.tweaks-bubble').click().catch(() => {});
  await page.waitForTimeout(200);
  const label = variant[0].toUpperCase() + variant.slice(1);
  await page.locator('.tweaks-panel .seg-grid button', { hasText: new RegExp(`^${label}$`, 'i') }).first().click().catch(() => {});
  await page.waitForTimeout(350);
  // collapse
  await page.locator('.tweaks-head button').click().catch(() => {});
  await page.waitForTimeout(200);
}

async function run() {
  try { await rm(OUT, { recursive: true, force: true }); } catch {}
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const errors = [];

  for (const d of DEVICES) {
    const ctx = await browser.newContext({
      viewport: { width: d.w, height: d.h },
      deviceScaleFactor: 2,
      isMobile: true, hasTouch: true,
    });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`[${d.name}] ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`[${d.name}] CON: ${m.text()}`); });

    // Home variants
    for (const v of ['editorial', 'feed', 'library', 'path']) {
      await seed(page);
      await setVariant(page, v);
      await page.screenshot({ path: path.join(OUT, `${d.name}-home-${v}.png`), fullPage: true });
    }

    // Other routes
    const routes = [
      ['browse', {}],
      ['tool', { toolId: 'chatgpt' }],
      ['video', { videoId: 1 }],
      ['leaderboard', {}],
      ['learning', {}],
      ['share', {}],
      ['profile', {}],
    ];
    for (const [r, p] of routes) {
      await seed(page, r, p);
      await page.screenshot({ path: path.join(OUT, `${d.name}-${r}.png`), fullPage: true });
    }

    await ctx.close();
  }

  await browser.close();
  await writeFile(path.join(OUT, '_report.json'), JSON.stringify({ errors }, null, 2));
  console.log(JSON.stringify({ errorsFound: errors.length, dir: OUT }, null, 2));
  if (errors.length) errors.forEach(e => console.log('  ' + e));
}

run().catch(e => { console.error(e); process.exit(1); });
