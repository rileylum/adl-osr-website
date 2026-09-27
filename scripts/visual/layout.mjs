// Layout checks over every route, in both colour schemes.
// usage: node scripts/visual/layout.mjs <baseUrl>
// - No sideways scroll: scrollWidth is 320 at a 320px viewport, on every route
//   and on `/` with the MailerLite form in its error and success states.
// - On `/` at 390×844: the hero's Sign Up, a Discord link and a Facebook link
//   sit fully inside the first screen and are not visibility: hidden.
// Exits 1 on any failure. Contrast is pixc.mjs's job.
import { chromium } from '/home/riley/.npm/_npx/86170c4cd1c5da32/node_modules/playwright/index.mjs';
import { setFormState } from './mlform.mjs';

// Playwright's bundled browser is the wrong version on this machine.
const CHROMIUM = '/usr/bin/chromium';

const ROUTES = [
  '/',
  '/code-of-conduct',
  '/gallery',
  '/gm-info',
  '/gm-submission',
  '/location',
  '/schedule',
  '/what-is-osr',
];

const base = process.argv[2];
if (!base) {
  console.error('usage: node scripts/visual/layout.mjs <baseUrl>');
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: CHROMIUM });
let failed = 0;

async function open(route, width, height, colorScheme) {
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme,
  });
  const page = await context.newPage();
  await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  return { page, context };
}

for (const scheme of ['light', 'dark']) {
  for (const route of ROUTES) {
    const { page, context } = await open(route, 320, 844, scheme);
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const ok = scrollWidth === 320;
    if (!ok) failed++;
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${scheme} ${route} scrollWidth@320=${scrollWidth}`
    );
    await context.close();
  }

  for (const state of ['error', 'success']) {
    const { page, context } = await open('/', 320, 844, scheme);
    await setFormState(page, state);
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const ok = scrollWidth === 320;
    if (!ok) failed++;
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${scheme} / [${state}] scrollWidth@320=${scrollWidth}`
    );
    await context.close();
  }

  const { page, context } = await open('/', 390, 844, scheme);
  const funnel = await page.evaluate(() => {
    const onFirstScreen = (e) => {
      const r = e.getBoundingClientRect();
      return (
        r.height > 0 &&
        r.top >= 0 &&
        r.left >= 0 &&
        r.bottom <= innerHeight &&
        r.right <= innerWidth &&
        getComputedStyle(e).visibility !== 'hidden'
      );
    };
    const anyLink = (part) =>
      [...document.querySelectorAll(`a[href*="${part}"]`)].some(onFirstScreen);
    const signup = document.getElementById('hero-signup');
    // The label as read aloud: decorative arrows are aria-hidden.
    const label = signup?.cloneNode(true);
    label?.querySelectorAll('[aria-hidden="true"]').forEach((e) => e.remove());
    return {
      signupText: label?.textContent.replace(/\s+/g, ' ').trim() ?? null,
      signup: !!signup && onFirstScreen(signup),
      discord: anyLink('discord'),
      facebook: anyLink('facebook'),
    };
  });
  const ok = funnel.signup && funnel.discord && funnel.facebook;
  if (!ok) failed++;
  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${scheme} / funnel@390x844 #hero-signup="${funnel.signupText}" signup=${funnel.signup} discord=${funnel.discord} facebook=${funnel.facebook}`
  );
  await context.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
