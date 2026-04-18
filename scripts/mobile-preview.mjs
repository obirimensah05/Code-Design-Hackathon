// Capture the "mobile preview" on desktop — clicks the toggle button
// and screenshots leaderboard, share, home-feed at the 380px frame.
import { chromium } from 'playwright';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const URL = 'http://localhost:3333/';
const OUT = '/tmp/pu-preview';
const PROFILE = { name: 'Jordan Reed', email: 'j@x.com', newToAi: false, usedTools: ['chatgpt'], field: 'marketing', role: 'Marketing Manager', goals: [], initials: 'JR' };

async function seed(page, route = 'home', params = {}) {
  await page.addInitScript(({ p, r, par }) => {
    try {
      localStorage.clear();
      localStorage.setItem('pv_profile', JSON.stringify(p));
      localStorage.setItem('pv_points', '180');
      localStorage.setItem('pv_watched', JSON.stringify({ 1: Date.now(), 5: Date.now() }));
      localStorage.setItem('pv_route', r);
      localStorage.setItem('pv_route_params', JSON.stringify(par));
      localStorage.setItem('pv_tweaks_collapsed', '1');
    } catch {}
  }, { p: PROFILE, r: route, par: params });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
}

async function togglePreview(page) {
  const btn = page.locator('.mobile-toggle');
  await btn.click();
  await page.waitForTimeout(500);
}

async function setVariant(page, variant) {
  await page.locator('.tweaks-bubble').click().catch(() => {});
  await page.waitForTimeout(200);
  const label = variant[0].toUpperCase() + variant.slice(1);
  await page.locator('.tweaks-panel .seg-grid button', { hasText: new RegExp(`^${label}$`, 'i') }).first().click().catch(() => {});
  await page.waitForTimeout(350);
  await page.locator('.tweaks-head button').click().catch(() => {});
  await page.waitForTimeout(200);
}

async function run() {
  try { await rm(OUT, { recursive: true, force: true }); } catch {}
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CON: ' + m.text()); });

  // Leaderboard
  await seed(page, 'leaderboard');
  await togglePreview(page);
  await page.screenshot({ path: path.join(OUT, 'preview-leaderboard.png'), fullPage: false });

  // Share Knowledge
  await seed(page, 'share');
  await togglePreview(page);
  await page.screenshot({ path: path.join(OUT, 'preview-share.png'), fullPage: false });

  // Home Feed (desktop mobile preview)
  await seed(page, 'home');
  await setVariant(page, 'feed');
  await togglePreview(page);
  await page.screenshot({ path: path.join(OUT, 'preview-home-feed.png'), fullPage: false });

  // Home Feed on REAL mobile viewport
  await ctx.close();
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  mp.on('pageerror', e => errors.push('[mobile] ' + e.message));
  mp.on('console', m => { if (m.type() === 'error') errors.push('[mobile] CON: ' + m.text()); });
  await mp.addInitScript(p => {
    localStorage.clear();
    localStorage.setItem('pv_profile', JSON.stringify(p));
    localStorage.setItem('pv_route', 'home');
    localStorage.setItem('pv_tweaks_collapsed', '1');
    localStorage.setItem('pv_tweaks', JSON.stringify({ theme: 'light', accentHue: 280, homeVariant: 'feed', gamification: 'medium', roleLens: 'marketing' }));
  }, PROFILE);
  await mp.goto(URL, { waitUntil: 'networkidle' });
  await mp.waitForTimeout(1200);
  await setVariant(mp, 'feed');
  await mp.screenshot({ path: path.join(OUT, 'real-mobile-home-feed.png'), fullPage: true });
  await mp.addInitScript(() => { localStorage.setItem('pv_route', 'leaderboard'); });
  await mp.goto(URL, { waitUntil: 'networkidle' });
  await mp.waitForTimeout(800);
  await mp.screenshot({ path: path.join(OUT, 'real-mobile-leaderboard.png'), fullPage: true });

  await browser.close();
  await writeFile(path.join(OUT, '_report.json'), JSON.stringify({ errors }, null, 2));
  console.log(JSON.stringify({ errors: errors.length, dir: OUT }, null, 2));
  if (errors.length) errors.forEach(e => console.log('  ' + e));
}

run().catch(e => { console.error(e); process.exit(1); });
