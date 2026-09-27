// Sweeps the homepage cover from 320 to 1440px in 10px steps, in both colour
// schemes, and reports every text box that doesn't fit.
// usage: node scripts/visual/overflow.mjs <baseUrl>
// A break is any of:
// - an element in the cover whose content is wider than its box
//   (scrollWidth > clientWidth);
// - a line of text escaping the box of an ancestor inside the cover;
// - a line of text crossing the cover's frame rule or running into the
//   module-code tag.
// The corner ribbon is skipped. Its ends are clipped on purpose, and a box
// test against its diagonal flags empty glyph corners (the "A" of the title at
// 320px), so check it by eye.
// Widths are grouped into runs per break, with the worst overshoot in px.
// Exits 1 on any break.
import { chromium } from '/home/riley/.npm/_npx/86170c4cd1c5da32/node_modules/playwright/index.mjs';

// Playwright's bundled browser is the wrong version on this machine.
const CHROMIUM = '/usr/bin/chromium';

const base = process.argv[2];
if (!base) {
  console.error('usage: node scripts/visual/overflow.mjs <baseUrl>');
  process.exit(2);
}

const WIDTHS = [];
for (let w = 320; w <= 1440; w += 10) WIDTHS.push(w);

function findBreaks() {
  const cover = document.querySelector('.cover');
  // Sub-pixel text metrics differ from layout boxes by a fraction of a pixel.
  const SLOP = 1;
  const describe = (e) => {
    const cls = [...e.classList].filter((c) => !c.startsWith('astro-'));
    const text = e.textContent.replace(/\s+/g, ' ').trim().slice(0, 30);
    return `${e.tagName.toLowerCase()}${cls.length ? '.' + cls.join('.') : ''} "${text}"`;
  };
  const out = [];
  const ribbon = cover.querySelector('.ribbon');
  const tag = cover.querySelector('.module-code');

  for (const e of cover.querySelectorAll('*')) {
    if (ribbon.contains(e) || e.closest('.sr-only')) continue;
    const cs = getComputedStyle(e);
    if (cs.display === 'inline' || cs.display === 'contents') continue;
    if (e.scrollWidth > e.clientWidth + SLOP && e.clientWidth > 0)
      out.push([
        `${describe(e)} content wider than box`,
        e.scrollWidth - e.clientWidth,
      ]);
  }

  // The frame's inner rule is an inset box-shadow, so its inside edge is the
  // border plus the shadow's spread.
  const cs = getComputedStyle(cover);
  const spread = Math.max(
    0,
    ...cs.boxShadow
      .split(/,(?![^(]*\))/)
      .filter((s) => s.includes('inset'))
      .map(
        (s) =>
          +s
            .match(/(-?[\d.]+)px/g)
            .at(-1)
            .slice(0, -2)
      )
  );
  const border = parseFloat(cs.borderLeftWidth);
  const cr = cover.getBoundingClientRect();
  const inner = {
    left: cr.left + border + spread,
    right: cr.right - border - spread,
    top: cr.top + border + spread,
    bottom: cr.bottom - border - spread,
  };

  // Per part: the kicker and the code are different widths, and the empty
  // corner between them is free space.
  const tagParts = [...tag.children].map((c) => c.getBoundingClientRect());
  const ctx = document.createElement('canvas').getContext('2d');
  const hits = (a, b) =>
    a.left < b.right - SLOP &&
    a.right > b.left + SLOP &&
    a.top < b.bottom - SLOP &&
    a.bottom > b.top + SLOP;

  const walker = document.createTreeWalker(cover, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const e = t.parentElement;
    if (ribbon.contains(e) || e.closest('.sr-only')) continue;
    const range = document.createRange();
    range.selectNodeContents(t);
    for (const q of range.getClientRects()) {
      if (q.width < 1) continue;
      const line = `${describe(e)} line "${t.textContent.trim().slice(0, 20)}"`;
      for (let a = e; a && a !== cover.parentElement; a = a.parentElement) {
        const acs = getComputedStyle(a);
        if (acs.display === 'inline' || acs.display === 'contents') continue;
        const r = a.getBoundingClientRect();
        // Sideways only: a display face's glyph box is taller than its
        // line-height, so every tight Anton line would escape vertically.
        const over = Math.max(
          r.left + parseFloat(acs.borderLeftWidth) - q.left,
          q.right - (r.right - parseFloat(acs.borderRightWidth))
        );
        if (over > SLOP) {
          out.push([`${line} escapes ${describe(a).split(' ')[0]}`, over]);
          break;
        }
      }
      // A glyph box runs well above the capitals, so an overlap test on it
      // flags ink-free corners and the space above. Canvas metrics give the ink's height; its
      // baseline sits the font's ascent below the glyph box's top.
      const ecs = getComputedStyle(e);
      ctx.font = `${ecs.fontStyle} ${ecs.fontWeight} ${ecs.fontSize} ${ecs.fontFamily}`;
      const m = ctx.measureText(t.textContent.trim());
      const scale =
        q.height / (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent);
      const baseline = q.top + m.fontBoundingBoxAscent * scale;
      const ink = {
        left: q.left,
        right: q.right,
        top: baseline - m.actualBoundingBoxAscent,
        bottom: baseline + m.actualBoundingBoxDescent,
      };
      const past = Math.max(
        inner.left - ink.left,
        ink.right - inner.right,
        inner.top - ink.top,
        ink.bottom - inner.bottom
      );
      if (past > SLOP) out.push([`${line} crosses the frame rule`, past]);
      if (!tag.contains(e) && tagParts.some((r) => hits(ink, r)))
        out.push([`${line} overlaps the module-code tag`, 0]);
    }
  }
  return out;
}

function runs(widths) {
  const out = [];
  for (const w of widths) {
    const last = out.at(-1);
    if (last && w - last[1] === 10) last[1] = w;
    else out.push([w, w]);
  }
  return out.map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)).join(', ');
}

const browser = await chromium.launch({ executablePath: CHROMIUM });
let total = 0;
for (const scheme of ['light', 'dark']) {
  const context = await browser.newContext({
    viewport: { width: WIDTHS[0], height: 900 },
    colorScheme: scheme,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(new URL('/', base).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const found = new Map();
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(50);
    for (const [b, px] of await page.evaluate(findBreaks)) {
      if (!found.has(b)) found.set(b, { widths: new Set(), px: 0 });
      found.get(b).widths.add(width);
      found.get(b).px = Math.max(found.get(b).px, px);
    }
  }
  const title = await page.evaluate(
    () => document.getElementById('hero-signup')?.textContent.trim() ?? ''
  );
  console.log(`${scheme} (#hero-signup "${title.replace(/\s+/g, ' ')}"):`);
  if (!found.size) console.log('  ok   no breaks from 320 to 1440px');
  for (const [b, { widths, px }] of found)
    console.log(
      `  FAIL ${b}${px ? ` (up to ${px.toFixed(1)}px)` : ''} @ ${runs([...widths])}`
    );
  total += found.size;
  await context.close();
}
await browser.close();
process.exit(total ? 1 : 0);
