// Worst real contrast of text over whatever is painted behind it, art included.
// usage: node scripts/visual/pixc.mjs <url> [widths] [light|dark] [error|success]
// LOOK=h node scripts/visual/pixc.mjs … checks the easter-egg look.
// widths is a comma list, 320,390,1280 by default: 320 is the narrowest phone
// the site supports, and the cover's small print is tightest there.
// The fourth argument puts the MailerLite form into that state first (mlform.mjs).
// Prints, per width, the worst text element and up to four failures; exits 1
// on any failure.
//
// Computed-style checks can't see CSS-mask art, rotated text or line clamps, so
// this measures rendered pixels: note every visible text box, hide the text,
// screenshot, and compare each box's background to its text colour.
import { chromium } from '/home/riley/.npm/_npx/86170c4cd1c5da32/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import { setFormState } from './mlform.mjs';

// Playwright's bundled browser is the wrong version on this machine.
const CHROMIUM = '/usr/bin/chromium';

const [url, widthList = '320,390,1280', mode = 'light', state] =
  process.argv.slice(2);
const widths = widthList.split(',').map(Number);
if (
  !url ||
  !widths.every((w) => w > 0) ||
  !['light', 'dark'].includes(mode) ||
  (state && !['error', 'success'].includes(state))
) {
  console.error(
    'usage: node scripts/visual/pixc.mjs <url> [widths] [light|dark] [error|success]'
  );
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: CHROMIUM });

async function check(width) {
  const context = await browser.newContext({
    viewport: { width: +width, height: 900 },
    colorScheme: mode,
    reducedMotion: 'reduce',
  });
  if (process.env.LOOK === 'h')
    await context.addInitScript(() => sessionStorage.setItem('oz-look', 'h'));
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  if (state) await setFormState(page, state);

  // Measure and shoot in one tall viewport: a full-page screenshot re-lays-out vh
  // units, which would shift everything away from the boxes measured at normal
  // height.
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight
  );
  await page.setViewportSize({ width: +width, height });
  await page.waitForTimeout(400);

  const items = await page.evaluate(() => {
    const toRGB = (s) => {
      const c = document.createElement('canvas').getContext('2d');
      c.fillStyle = s;
      c.fillRect(0, 0, 1, 1);
      return [...c.getImageData(0, 0, 1, 1).data];
    };
    const out = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );
    while (walker.nextNode()) {
      const t = walker.currentNode;
      if (t.textContent.trim().length < 3) continue;
      const e = t.parentElement;
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const range = document.createRange();
      range.selectNodeContents(t);
      for (const q of range.getClientRects()) {
        if (q.width <= 4 || q.height <= 4) continue;
        // Only text a visitor can see: whatever is on top at the box centre must
        // be this element.
        const top = document.elementFromPoint(
          q.x + q.width / 2,
          q.y + q.height / 2
        );
        if (!top || !(top === e || e.contains(top))) continue;
        // Skip lines a line-clamp or overflow clip cuts off: they spill past the
        // clipping box.
        let clip = e;
        while (clip && getComputedStyle(clip).overflow === 'visible')
          clip = clip.parentElement;
        if (clip && clip !== document.body) {
          const cb = clip.getBoundingClientRect();
          if (q.bottom > cb.bottom + 1 || q.top < cb.top - 1) continue;
        }
        const size = parseFloat(cs.fontSize);
        // The owner's rule is 4.5:1 for anything you press, whatever its size;
        // WCAG's 3:1 large-text floor applies to headings and other large text.
        const control = !!e.closest('a, button, summary');
        const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
        // Glyphs sit in the middle of the line box; trim the edges so rules and
        // underlines don't count.
        out.push({
          x: q.x + q.width * 0.05,
          y: q.y + scrollY + q.height * 0.2,
          w: q.width * 0.9,
          h: q.height * 0.6,
          rgb: toRGB(cs.color),
          need: !control && large ? 3 : 4.5,
          text: t.textContent.trim().slice(0, 40),
        });
      }
    }
    window.scrollTo(0, 0);
    return out;
  });

  // Hide text, keep everything else, and shoot the page. The rule goes in a
  // cascade layer prepended to <head>: among !important declarations the
  // earliest-declared layer wins, and the MailerLite overrides are layered
  // !important, so an unlayered rule here would leave the form's text painted
  // and its glyphs would pollute the background samples. The fill colour is
  // cleared too, for embeds that set it.
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent =
      '@layer pixc-hide { *, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; -webkit-text-stroke: 0 !important; caret-color: transparent !important; text-decoration-color: transparent !important; } svg { visibility: hidden !important; } }';
    document.head.prepend(style);
  });
  await page.waitForTimeout(200);
  const { data, info } = await sharp(await page.screenshot())
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const results = [];
  for (const it of items) {
    const Lt = lum(it.rgb);
    const ratios = [];
    for (
      let y = Math.max(0, Math.floor(it.y));
      y < Math.min(info.height, it.y + it.h);
      y += 2
    )
      for (
        let x = Math.max(0, Math.floor(it.x));
        x < Math.min(info.width, it.x + it.w);
        x += 2
      ) {
        const i = (y * info.width + x) * info.channels;
        const Lb = lum([data[i], data[i + 1], data[i + 2]]);
        ratios.push((Math.max(Lt, Lb) + 0.05) / (Math.min(Lt, Lb) + 0.05));
      }
    if (!ratios.length) continue;
    ratios.sort((a, b) => a - b);
    // 10th percentile: the ink the text actually crosses, ignoring single stray
    // pixels.
    results.push({
      worst: ratios[Math.floor(ratios.length * 0.1)],
      need: it.need,
      text: it.text,
    });
  }

  const fails = results
    .filter((r) => r.worst < r.need)
    .sort((a, b) => a.worst - b.worst);
  const min = results.sort((a, b) => a.worst / a.need - b.worst / b.need)[0];
  const path = new URL(url).pathname + (state ? ` [${state}]` : '');
  console.log(
    `${path} @${width} ${mode}: fails=${fails.length} worst=${min.worst.toFixed(2)} (need ${min.need}) "${min.text}"`
  );
  for (const f of fails.slice(0, 4))
    console.log(`   FAIL ${f.worst.toFixed(2)} < ${f.need}  "${f.text}"`);
  await page.context().close();
  return fails.length;
}

let failed = 0;
for (const width of widths) failed += await check(width);
await browser.close();
process.exit(failed ? 1 : 0);
