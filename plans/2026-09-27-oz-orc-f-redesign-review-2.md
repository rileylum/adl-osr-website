# Review — 2026-09-27-oz-orc-f-redesign.md

Branch: feat/oz-orc-f-redesign
Reviewed: 1ddc4160709a72f22987c2c6874331437c574f36
Verdict: ship

This review covers the whole branch, `git diff e041610...1ddc416`, against the plan. The
plan has no `Base:` line. `main` is at `e041610`, which is also the merge base. Since round
1 (`c793936`), three commits acted on round 1's "For the author" notes:

- `dc113fa` moved the logo preload out of `Layout.astro` into a `head` slot filled only by
  `index.astro`, with `imagesrcset` and `imagesizes` copied from the cover `<img>`.
- `6cd4782` amended the plan's `/schedule` row to record the plain agenda table, and added
  a comment on `Game.tags` saying why the field stays.
- `1ddc416` made the cover frame and the module code the `cover-frame` and `module-code`
  utilities in `app.css`. It also put the stat pieces' `aria-hidden` once on a
  `display: contents` wrapper.

## Done when

- [x] `npm test`: 4 files, 68 tests pass. That includes all 15 `homeFunnel` tests.
- [x] `npm run lint`: clean.
- [x] `git ls-files | xargs npx prettier --check --ignore-unknown`: "All matched files use
      Prettier code style!" (tracked files only, as the plan's note says).
- [x] `npx astro check`: 0 errors, 0 warnings, 9 hints. The hints are the deprecations
      round 1 noted, which predate this work.
- [x] `npm run build`: 8 pages built.
- [x] Real data, `node scripts/visual/layout.mjs http://localhost:4321`: `scrollWidth@320=320`
      on all eight routes in both schemes. The funnel check passes in both schemes and
      prints `#hero-signup="Join the Mailing List"`.
- [x] Real data, `pixc.mjs`: every one of the 32 runs (8 routes × {390, 1280} ×
      {light, dark}) exits 0 with `fails=0`. The worst ratios are 5.45 in light and 5.72
      in dark, the same as round 1.
- [x] Registration-open flip: I built it in a throwaway `git worktree` with hardlinked
      `node_modules`, so the branch's `src/data/events.ts` was never edited. The build
      passed. `layout.mjs` passes and prints `#hero-signup="Sign Up for Event"` in both
      schemes. `pixc` reports `fails=0` on all 32 runs. The worktrees are removed, and
      `git diff src/data/events.ts` on the branch is empty.
- [x] `grep -rn "swiper\|link-primary\|logo-ink\|alternating-sections" src` returns
      nothing (exit 1).

These checks target the three new commits:

- **The preload fix works.** `dist/index.html` has one image preload, and it matches the
  `<img>`'s `srcset` and `sizes`. `/gm-info`, `/schedule` and `/code-of-conduct` have
  none. On the flip build, each viewport requests exactly one logo file, and that file
  is the `<img>`'s `currentSrc`:
  - 1280@1x fetches 800w.
  - 390@3x fetches 800w.
  - 390@1x fetches 500w.
  - 1280@2x fetches 1200w.

  Round 1 measured two downloads here.

- **The refactor changed no pixels.** I built `6cd4782` (before the refactor) and
  compared it with `1ddc416`:
  - Full-page screenshots of `/`, `/gm-info` and `/schedule`, at 390 and 1280 in both
    schemes, on real data: 0 differing pixels. `/` at 1280 first showed a difference,
    but that came from the lazy About photo painting at different times. With lazy
    images forced to load, the difference is 0.
  - The flipped `.cover-wrap`, at 320, 390 and 1280 in both schemes: 0 differing bytes.
    This includes the Date stat inside its new `display: contents` wrapper.
- **Chromium names the Date stat.** In Chromium's accessibility tree on the flip build,
  the `time` node is named "Saturday, September 12th, 2026". None of the "Sat" or "12"
  pieces are exposed.
- **The MailerLite loader is untouched.** The only changes to `Layout.astro` are the
  `head` slot and the font preloads.

## Remediation

None.

## For the author

- **The `module-code` comment gives a false reason.** `src/assets/app.css:290-293` says
  the homepage needs custom properties to enlarge the tag because "a scoped class rule
  can't, as these child selectors outrank it". This is wrong. `@utility` rules land in
  `@layer utilities`, and Astro's scoped styles are unlayered. An unlayered rule beats a
  layered one whatever its specificity. I tested this on the preview: an unlayered
  `.code-tag[data-astro-cid-…] > :last-child { font-size: 10px }` overrode the utility's
  48px. The custom-property design still works and reads well. Only the stated
  constraint is false, and it would steer the next reader away from a plain override that
  works. The fix is a one-line comment edit: drop the reason, or say the properties keep
  both sizes in one place.
- **The plan doesn't record where the preload lives now.** The plan's Cover bullet still
  says "keeping today's … preload", and its Code Map puts preloads in `Layout.astro`'s
  `<head>`. The preload now sits in `index.astro`, through a new `head` slot in
  `Layout.astro`. This is what the owner decided after round 1, and the plan was amended
  for the agenda table but not for this. Amending the plan costs one sentence in the
  Cover bullet.
- **The working tree has uncommitted changes outside the review.** This is unchanged
  since round 1. `.prettierignore`, `eslint.config.js` and `package-lock.json` are
  modified. `prototypes/`, `docs/agent/`, `announcements/`, `what_is_osr_project/`,
  `.playwright-mcp/` and the root CSVs are untracked. The plan says to leave them alone.
  This review covers the commits only.
- **Complexity** (from `lazy-review`; neither blocks):
  - `src/components/CommandBar.astro:L76`: delete: `observer = undefined;` right after
    `observer?.disconnect()`. The next lines either reassign it or return. A second
    `disconnect()` on the stale observer does nothing. Nothing replaces the line.
  - net: -1 line possible.

## Unverified

- **Screen readers read the Date stat.** Plan: `spoken` is the Date's aria-label, "when
  the pieces don't read aloud". This is carried from round 1, with a narrower gap:
  - Chromium's accessibility tree now names the `time` "Saturday, September 12th, 2026"
    and hides the pieces.
  - What remains is how real screen readers read that tree. Support for `aria-label` on
    `time` varies. `1ddc416` also moved `aria-hidden` onto a `display: contents` span,
    and WebKit has had bugs with the accessibility of `display: contents` elements.
  - If either fails, the Date cell reads as empty or as "Sat 12 Sep 2026".

  Settled by: VoiceOver on iOS Safari and on macOS Safari, and NVDA on Windows with
  Chrome or Firefox, reading `/` in the registration-open flip build.

## Manual verification

- [ ] The homepage at 1280 in each mode matches
      `docs/design/assets/2026-09-27-oz-orc-look/final-{light,dark}-1280.webp` in
      structure: corner banner, OZ3 tag, framed logo, stat block, dragon head beside the
      title and not cropped.
- [ ] At 390 in each mode, the page matches `final-{light,dark}-390.webp`, and the dragon
      head sits beside the title.
- [ ] Desktop: the command bar is hidden on load. It slides in once the hero Sign Up
      scrolls away, and hides again on the way back up. With `prefers-reduced-motion`,
      there is no slide.
- [ ] Phone: the bar is always visible and never covers the last FAQ item or the
      copyright line. Tabbing to links near the bottom keeps them clear of the bar.
- [ ] Navigate homepage → `/gm-info` → back through view transitions. The bar still
      hides and shows on desktop, and the MailerLite form still renders.
- [ ] FAQ: opening one item closes the others, on the homepage and on `/gm-info`.
- [ ] Keyboard: the navbar menus open on focus, the focus ring is visible on every band
      (orange cover, dark navbar, footer, bar) and the page.
- [ ] The inner pages look like the same module as the homepage: cover strip, keyed
      numbered headings, ruled boxes, no rounded corners or soft shadows anywhere.
