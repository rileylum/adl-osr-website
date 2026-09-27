# Review — 2026-09-27-oz-orc-konami-egg.md

Branch: feat/oz-orc-konami-egg
Reviewed: 5f2d1c37f6b4f5ab030930234aafaab0a15c73e3
Verdict: ship

Scope: `main...HEAD` (efb8c9b, the plan, and 5f2d1c3, the build). The plan has no
**Base:** line, so the base is `main` (a650b98).

## Done when

<!-- One row per check: what was run, and what it printed. Ticked only where seen to pass. -->

- [x] `npm test` — 5 files, 72 tests passed, including the 4 in
      `src/lib/konami.test.ts`.
- [x] `npm run lint` — ESLint printed no problems.
- [x] `npm run format:check` — "All matched files use Prettier code style!" The same
      result for tracked files only
      (`git ls-files | xargs npx prettier --check --ignore-unknown`).
- [x] `npm run build` — "8 page(s) built", "Complete!". `npx astro check` also ran:
      0 errors, 0 warnings.
- [x] `node scripts/visual/layout.mjs <url>` (F) — every line `ok` in all three funnel
      states.
- [x] `LOOK=h node scripts/visual/layout.mjs <url>` — every line `ok` in all three
      states: every route at 320px, `/` in the MailerLite error and success states, and
      the funnel at 390×844 in both schemes. For example, off-season printed
      `ok dark / funnel@390x844 #h-hero-signup="Join the Mailing List" signup=true discord=true facebook=true`.
- [x] `LOOK=h node scripts/visual/pixc.mjs <url>/ 320,390,1280 light|dark` —
      `fails=0` at every width and in both modes, in all three states. The worst light
      contrast was 5.70 ("GMs wanted: apply by November 30th", the MAIN MENU GM
      link). The worst dark contrast was 7.33 (menubar text).
- [x] All three funnel states. Each state was built from `git archive HEAD` into a
      throwaway copy beside the repo and served with `astro preview` on ports
      4401–4403. The worktree's `src/data/events.ts` was never edited, and the copies
      are deleted.
  - Open: `adelaideSep2026.status` set to `'current'`. H's Sign Up went to Warhorn,
    and the roster and dialog rendered.
  - Announced: the same, plus `warhornUrl: undefined` on the current event. Sign Up
    went to `#h-register`, and the roster and dialog rendered.
  - Off-season: today's data, unchanged. The dialog rendered, then GMs Wanted.
- [ ] Delete the `node_modules` symlink — not done. It is still in the tree,
      untracked. The owner's dev server on :4321 runs from it, so this review left it
      in place (see For the author).

The review also drove the running site in headless Chromium (open state, 1280×900,
MailerLite subscribe requests route-aborted). Every step behaved as the plan says:

- Typing the code with focus in the MailerLite email field did nothing.
- Typing the code on the page:
  - set `data-look="h"` and `sessionStorage['oz-look']`;
  - moved the one `.ml-embedded` into `[data-ml-slot]`, where it rendered;
  - scrolled to the top and focused `#h-hero-signup`;
  - created one AudioContext and one square-wave oscillator.
- Typing the code again while in H made no second tune.
- In the MAIN MENU, ArrowDown moved focus to "Join Discord".
- After a reload, `data-look` was already `h` at DOMContentLoaded, and no tune
  played.
- `/schedule` had no `.home-h` and showed F's navbar. Going back to `/` restored H
  with the form in H.
- A new tab opened in F.
- Exit returned F: navbar and footer shown, the form back at the end of
  `#register .record`, focus on `#hero-signup`, and no tune.
- Typing the code after Exit brought H back and played the tune once.
- Only one menubar dropdown stayed open at a time, and a click elsewhere closed it.

## Remediation

<!-- For the implementer. Each item names the plan clause it violates. -->

None.

## For the author

<!-- For the user and the plan's author. Not for an implementer. -->

- **The plan's recipe for the three funnel states is out of date.** "Registration open
  (today's data)" is wrong: the September 2026 event has `status: 'past'`, so today's
  data is the off-season. "Set `warhornUrl` to `undefined` on the current event" then
  changes nothing, because there is no current event. As written, the recipe runs the
  off-season state three times. The implementer ticked this box, and the build doesn't
  show which states they ran. This review covered all three by also making the
  September event current (see Done when). Cost: rewrite the recipe in the plan
  template or in future plans. No code change.
- **The `node_modules` symlink is still in the tree, and git lists it as untracked.**
  The plan's last Done-when step says to delete it, but the owner's dev server needs
  it. Deleting it after the dev server stops takes one command. To keep it, add a bare
  `node_modules` line to `.gitignore`: the existing `node_modules/` pattern matches
  only a directory, so a symlink slips past it. Either way, never stage the symlink.
- **lazy-review note: the `socials` array is a verbatim copy of `Footer.astro`'s**
  (`src/components/GoldBox.astro:57-74`). The `lazy:` comment on line 7 names only the
  prose, so a new social link could reach F and miss H. Cost: add `Footer` to that
  comment now. A shared list in `src/data/site.ts` would mean editing an F component,
  which is out of scope for this slice. lazy-review found nothing else. Every class in
  `goldbox.css` is used in the markup. Its closing line: `Lean already. Ship.`

## Unverified

<!-- Requirements this review could not settle, and what would settle each. -->

- **The tune is audible, quiet and under a second.** Plan: "Play square-wave notes C5,
  E5, G5 … then C6". Headless Chromium has no audio output. The review confirmed only
  that one square oscillator starts on the trigger, and that none starts on reload,
  Exit or a repeat in H. The durations and gain were checked by reading
  `GoldBox.astro:540-570`. Settled by: listening on desktop Chrome. The owner reports
  this check as good.
- **A real MailerLite submit works from H's dialog, and from F after Exit.** Plan,
  Manual verification: "still renders and submits". This review must not send a real
  subscribe request. It confirmed only that the form renders in both places and that
  the page never holds two copies. Settled by: a human submit in each place. The owner
  reports the submit through H's dialog as good. The submit after Exit is not reported.

## Manual verification

<!-- Carried forward from the plan, unticked. Only a human closes these. -->

- [ ] On desktop Chrome, type ↑ ↑ ↓ ↓ ← → ← → B A on the homepage. The tune plays
      (quiet, under a second), H appears at the top, and focus sits on the MAIN MENU
      Sign Up.
- [ ] With focus in the MailerLite email field, typing the sequence does nothing.
- [ ] Reload: H paints straight away with no flash of F, and no tune plays. Visit
      `/schedule`: it's F. Go back to `/`: it's H.
- [ ] Open the site in a new tab: it's F.
- [ ] Press Exit: F returns, with its navbar, footer and command bar. The MailerLite
      form is back in F's "Stay in the loop" section and still renders and submits.
- [ ] In H, the MailerLite form renders inside the "Stay in the loop" dialog window.
- [ ] Tab through H in both colour schemes. Focus shows as the dashed outline
      everywhere, and the MAIN MENU arrow keys move the cursor.
