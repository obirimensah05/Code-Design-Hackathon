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

// Use DevTools protocol for matched CSS rules
const client = await page.context().newCDPSession(page);
await client.send('DOM.enable');
await client.send('CSS.enable');
const { root } = await client.send('DOM.getDocument', { depth: -1, pierce: true });
const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.profile-hero h1' });
const matches = await client.send('CSS.getMatchedStylesForNode', { nodeId });
const out = { matchedCSSRules: [], inheritedStyle: [] };
for (const m of (matches.matchedCSSRules || [])) {
  out.matchedCSSRules.push({
    selector: m.rule.selectorList.text,
    style: m.rule.style.cssText,
    origin: m.rule.origin,
    source: m.rule.styleSheetId,
  });
}
if (matches.inlineStyle && matches.inlineStyle.cssText) {
  out.inline = matches.inlineStyle.cssText;
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
