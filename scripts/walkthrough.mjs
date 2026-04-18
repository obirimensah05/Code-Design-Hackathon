// Playwright walkthrough — visits every route + home variant + interactive
// state across multiple devices, takes screenshots, writes report.
//
// Usage: node scripts/walkthrough.mjs
// Requires: dev server running on http://localhost:3333

import { chromium } from 'playwright';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const URL = 'http://localhost:3333/';
const OUT = path.resolve('docs/walk');

const DEVICES = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false, scale: 1 },
  { name: 'tablet',  width: 820,  height: 1180, isMobile: true,  scale: 2 },
  { name: 'phone-l', width: 430,  height: 932,  isMobile: true,  scale: 3 },
  { name: 'phone-s', width: 375,  height: 667,  isMobile: true,  scale: 2 },
];

const DEFAULT_PROFILE = {
  name: 'Jordan Reed',
  email: 'jordan@example.com',
  newToAi: false,
  usedTools: ['chatgpt', 'midjourney'],
  field: 'marketing',
  role: 'Marketing Manager',
  goals: ['Save time on daily tasks', 'Build skills for my career'],
  initials: 'JR',
};

const WATCHED = { 1: Date.now() - 7200000, 5: Date.now() - 60000, 9: Date.now() - 3600000 };
const RATINGS = { 1: 5, 5: 4 };

async function newContext(browser, device) {
  return browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: device.scale,
    isMobile: device.isMobile,
    hasTouch: device.isMobile,
  });
}

async function seedThenGo(page, { route = 'home', params = {} } = {}) {
  // Use a single addInitScript to seed the exact state we want before each navigation.
  await page.addInitScript(
    ({ profile, watched, ratings, route, params }) => {
      try {
        localStorage.clear();
        localStorage.setItem('pv_profile', JSON.stringify(profile));
        localStorage.setItem('pv_points', '180');
        localStorage.setItem('pv_watched', JSON.stringify(watched));
        localStorage.setItem('pv_ratings', JSON.stringify(ratings));
        localStorage.setItem('pv_ld_done', JSON.stringify({ 1: Date.now() - 1800000 }));
        localStorage.setItem('pv_route', route);
        localStorage.setItem('pv_route_params', JSON.stringify(params));
      } catch (e) {}
    },
    { profile: DEFAULT_PROFILE, watched: WATCHED, ratings: RATINGS, route, params },
  );
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
}
async function shotFull(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
}

async function setVariant(page, variant) {
  // Make sure the panel is expanded
  const bubble = page.locator('.tweaks-bubble');
  if (await bubble.isVisible().catch(() => false)) {
    await bubble.click().catch(() => {});
    await page.waitForTimeout(250);
  }
  const label = variant[0].toUpperCase() + variant.slice(1);
  await page
    .locator('.tweaks-panel .seg-grid button', { hasText: new RegExp(`^${label}$`, 'i') })
    .first()
    .click()
    .catch(() => {});
  await page.waitForTimeout(400);
}

async function walkDesktop(browser, errors) {
  const device = DEVICES[0];
  const ctx = await newContext(browser, device);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`[desktop] PAGE: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[desktop] CONSOLE: ${m.text()}`); });

  // Onboarding from scratch
  await page.addInitScript(() => { try { localStorage.clear(); } catch {} });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await shot(page, 'desktop-01-onboarding-step1');
  for (let i = 2; i <= 5; i++) {
    await page.getByRole('button', { name: /continue/i }).click().catch(() => {});
    await page.waitForTimeout(400);
    await shot(page, `desktop-01-onboarding-step${i}`);
  }
  await page.getByRole('button', { name: /start exploring/i }).click().catch(() => {});
  await page.waitForTimeout(700);

  // Home variants — use seed + route=home, then click variant buttons
  for (const v of ['editorial', 'feed', 'library', 'path']) {
    await seedThenGo(page, { route: 'home' });
    await setVariant(page, v);
    await shot(page, `desktop-02-home-${v}`);
    await shotFull(page, `desktop-02-home-${v}-full`);
  }

  // Routes
  const routes = [
    ['browse', 'desktop-03-browse'],
    ['tool', 'desktop-04-tool', { toolId: 'chatgpt' }],
    ['video', 'desktop-05-video', { videoId: 1 }],
    ['leaderboard', 'desktop-06-leaderboard'],
    ['learning', 'desktop-07-learning'],
    ['share', 'desktop-08-share'],
    ['profile', 'desktop-09-profile-identity'],
  ];
  for (const [route, name, params = {}] of routes) {
    await seedThenGo(page, { route, params });
    await shot(page, name);
    await shotFull(page, `${name}-full`);
  }

  // Profile tabs
  await seedThenGo(page, { route: 'profile' });
  await page.getByRole('tab', { name: /activity/i }).click().catch(() => {});
  await page.waitForTimeout(300);
  await shotFull(page, 'desktop-09-profile-activity-full');
  await page.getByRole('tab', { name: /appearance/i }).click().catch(() => {});
  await page.waitForTimeout(300);
  await shotFull(page, 'desktop-09-profile-appearance-full');

  // Video page + langdock
  await seedThenGo(page, { route: 'video', params: { videoId: 3 } });
  await shot(page, 'desktop-05-video-fresh');
  await page.getByText(/Try on Langdock/i).first().click().catch(() => {});
  await page.waitForTimeout(600);
  await shotFull(page, 'desktop-05-video-langdock');

  // Tweaks: open, drag-indicator, close
  await seedThenGo(page, { route: 'home' });
  await shot(page, 'desktop-10-tweaks-open');
  await page.locator('.tweaks-head button').click().catch(() => {}); // collapse
  await page.waitForTimeout(200);
  await shot(page, 'desktop-10-tweaks-bubble');

  await ctx.close();
}

async function walkMobile(browser, device, errors) {
  const ctx = await newContext(browser, device);
  const page = await ctx.newPage();
  const tag = `[${device.name}]`;
  page.on('pageerror', (e) => errors.push(`${tag} PAGE: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${tag} CONSOLE: ${m.text()}`); });

  // Onboarding
  await page.addInitScript(() => { try { localStorage.clear(); } catch {} });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await shotFull(page, `${device.name}-01-onboarding`);

  // Routes
  const routes = [
    ['home', `${device.name}-02-home`],
    ['browse', `${device.name}-03-browse`],
    ['video', `${device.name}-04-video`, { videoId: 1 }],
    ['leaderboard', `${device.name}-05-leaderboard`],
    ['learning', `${device.name}-06-learning`],
    ['share', `${device.name}-07-share`],
    ['profile', `${device.name}-08-profile`],
  ];
  for (const [route, name, params = {}] of routes) {
    await seedThenGo(page, { route, params });
    await shotFull(page, name);
  }

  // Home feed variant (the one called out)
  await seedThenGo(page, { route: 'home' });
  // Switch to feed — must expand bubble first on mobile
  const bubble = page.locator('.tweaks-bubble');
  if (await bubble.isVisible().catch(() => false)) {
    await bubble.click();
    await page.waitForTimeout(250);
  }
  await page
    .locator('.tweaks-panel .seg-grid button', { hasText: /^Feed$/i })
    .first()
    .click()
    .catch(() => {});
  await page.waitForTimeout(400);
  // Collapse tweaks again to remove obstruction
  await page.locator('.tweaks-head button').click().catch(() => {});
  await page.waitForTimeout(200);
  await shotFull(page, `${device.name}-02b-home-feed`);

  await ctx.close();
}

async function main() {
  try { await rm(OUT, { recursive: true, force: true }); } catch {}
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const errors = [];

  await walkDesktop(browser, errors);
  for (const d of DEVICES.slice(1)) {
    await walkMobile(browser, d, errors);
  }

  await browser.close();

  await writeFile(
    path.join(OUT, '_report.json'),
    JSON.stringify({ errors, devices: DEVICES }, null, 2),
  );
  console.log(JSON.stringify({ errorsFound: errors.length, dir: OUT }, null, 2));
  if (errors.length) {
    console.log('--- ERRORS ---');
    errors.forEach((e) => console.log('- ' + e));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
