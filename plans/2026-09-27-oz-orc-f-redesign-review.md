# Review — 2026-09-27-oz-orc-f-redesign.md

Branch: feat/oz-orc-f-redesign
Reviewed: c793936e61d38ea4494ab13946758a7680d7d619
Verdict: ship

Diff reviewed: `git diff e041610...c793936`. The plan has no `Base:` line; `main` is at
`e041610`, the merge base.

## Done when

- [x] `npm test`: 4 files, 68 tests pass. That includes all 15 `homeFunnel` tests.
- [x] `npm run lint`: clean.
- [x] `git ls-files | xargs npx prettier --check --ignore-unknown`: "All matched files use
      Prettier code style!" (tracked files only, as the plan's note says).
- [x] `npx astro check`: 0 errors, 0 warnings, 9 hints. The hints are deprecations that
      predate this work (`ViewTransitions`, iframe `frameborder` and `margin*`).
- [x] `npm run build`: 8 pages built.
- [x] Real data, `node scripts/visual/layout.mjs http://localhost:4321`: `scrollWidth@320=320`
      on all eight routes in both schemes. The funnel check passes in both schemes and
      prints `#hero-signup="Join the Mailing List"`.
- [x] Real data, `pixc.mjs`: `fails=0` on all 8 routes × {390, 1280} × {light, dark} (32
      runs). Worst 5.45 light and 5.72 dark ("Convention Module" / "Date"), which match
      the spike doc's measurements.
- [x] Registration-open flip: built in a throwaway `git worktree` at `/tmp/rv/flip`, so
      the branch's `src/data/events.ts` was never edited. The build passed. `layout.mjs`
      passes and prints `#hero-signup="Sign Up for Event"` in both schemes. `pixc`
      reports `fails=0` on all 32 runs. The worktree has been removed, and
      `git diff src/data/events.ts` on the branch is empty.
- [x] `grep -rn "swiper\|link-primary\|logo-ink\|alternating-sections" src` returns
      nothing (exit 1).

Spot checks on the flip build: the bar shows SIGN UP · GAMES · DISCORD · FACEBOOK · RUN
A GAME, with `is-away` on load. The homepage keys run 1–6 (Featured Games … FAQ), with 17
encounters keyed 1a–1q and FAQ items 6a–6f. `/gm-info` shows 2a–2h, and `/schedule`
shows Agenda 1 with Sessions 2–4 and their compact cards keyed 2a…4f. All FAQ `<details>`
share `name="faq-accordion"`. A probe test confirmed that setting `process.env.TZ` at
runtime changes `Date` under this Vitest setup. So the weekday tests would catch a
local-time implementation.

## Remediation

None.

## For the author

- **The logo preload no longer matches the image the cover loads.** Measured on the flip
  build, both 1280@1x and 390@3x download `OZORC_Dungeon-500w.webp` (the preload) and
  then `OZORC_Dungeon-800w.webp` (the `currentSrc`). So the LCP image is fetched twice,
  and the preload is wasted. The cover's new `sizes="(max-width: 859px) 230px, 560px"`
  (`src/components/Cover.astro:44`) makes the browser pick 800w. The old `448px` picked
  500w on a 1x desktop. On 3x phones the old markup already missed. The fix costs one
  edit: give the preload in `src/layouts/Layout.astro:32` an `imagesrcset` and
  `imagesizes` that match the `<img>`. That preload also runs on every inner page, where
  the navbar uses the SVG. Decide whether it should be homepage-only.
- **The agenda on `/schedule` is not a `.roll` table.** The plan says "The agenda becomes
  a roll table" (`src/components/Schedule.astro:35`). The build uses a plain `.table`
  and sets the Time column in Anton. `.roll`'s narrow, centred first column would crush
  the Event column, so this deviation looks right. Either amend the plan's table row or
  ask for a different treatment.
- **Featured game cards no longer show `tags`.** The plan's `.encounter` list leaves
  them out, and the build follows it (`src/components/GameCard.astro:11`). No other code
  renders `Game.tags` now. Decide whether the field stays in `games.ts` for future use or
  goes.
- **An unplanned fix in About.** The fallback link changed from
  `currentEvent?.warhornUrl ?? site.socials.discord` to `||`
  (`src/components/About.astro:65`). With `??`, the announced state (`warhornUrl: ''`)
  rendered an empty href. The change is correct, and keeping it costs nothing.
- **The working tree has uncommitted changes outside the review.** `.prettierignore`,
  `eslint.config.js` and `package-lock.json` are modified, and `prototypes/`,
  `docs/agent/`, `announcements/`, `what_is_osr_project/`, `.playwright-mcp/` and the
  root CSVs are untracked. The plan says to leave them alone. This review covers the
  commits only.
- **Complexity** (from `lazy-review`; none of it blocks):
  - `src/components/ui/SectionHeading.astro:L76-99`: shrink: `.strip-tag`,
    `.strip-kicker` and `.strip-code` copy `Cover.astro:L227-248` rule for rule. Put one
    `module-code` utility in `app.css` beside `read-aloud` and call it from both.
  - `src/components/ui/SectionHeading.astro:L46-74`: shrink: the cover strip's
    double-ruled frame (the border, the inset `box-shadow` and its ≥860px step) repeats
    `Cover.astro:L149-165` and `L441-444`. Make it a `cover-frame` utility, like
    `read-aloud`.
  - `src/components/Cover.astro:L62-77`: shrink: three sibling spans each carry
    `aria-hidden={stat.spoken ? 'true' : undefined}`. Put it once on a wrapper span with
    `display: contents`.
  - net: about -36 lines possible.

## Unverified

- **Screen readers read the Date stat.** Plan: `spoken` is the Date's aria-label, "when
  the pieces don't read aloud". Every visible piece is `aria-hidden`, and the name sits
  on `<time aria-label>` (`src/components/Cover.astro:91`). Support for `aria-label` on
  `time` varies between screen readers. If one ignores it, the Date cell reads as empty.
  Settled by: VoiceOver (iOS/macOS) and NVDA on `/` in the registration-open flip
  build.

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
