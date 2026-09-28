# Review — 2026-09-28-h-every-page.md

Branch: feat/h-every-page
Reviewed: 45ba3db137ff8f7fb2835c6efe59b68931ca09b1
Verdict: remediate

Reviewed range: `b79bfd0..45ba3db` (the build commits after the plan). The plan has
no `Base:` line. The only uncommitted files in the tree are the untracked ones the
plan's implementer notes list as never-stage; none of them is part of this slice.

## Done when

### Phase 1

- [x] Each Tests line was observed as stated. An ad-hoc Chromium script ran
      against the off-season build on :4401, and all 7 lines passed. On
      `/schedule`, the code set `data-look="h"` and `oz-look="h"`, showed the
      menubar, hid the navbar, created 1 AudioContext and focused `main h1`. The
      code typed in the MailerLite email field left no `data-look`. On `/`, the
      form moved into `[data-ml-slot]` and focus went to `#h-hero-signup`. Exit
      on `/gm-info` cleared both, showed the navbar and footer, and focused
      `main h1`. Exit on `/` put `.ml-embedded` last in `#register .record` and
      focused `#hero-signup`. Attend → Event Schedule loaded `/schedule` in H,
      and Back showed H on `/` with the form in the slot. Opening Attend, then
      GM's, left only GM's open. The script aborted subscribe requests.
- [x] `npm test` — 5 files, 72 tests passed. `npm run lint` — exit 0.
      `npx astro check` — 0 errors, 0 warnings, 5 hints. `npm run build` —
      8 pages built in each of the 4 state copies.
- [x] `git ls-files | xargs npx prettier --check --ignore-unknown` — "All
      matched files use Prettier code style!"

### Phase 2

- [x] Each state's `dist/` grep matched: off-season ("Join the Mailing List",
      "will be posted here"), open ("Sign Up for Event", "Session 1"), announced
      ("Register Your Interest", "Games To Be Announced") and GMs closed
      ("Submissions for"). Each copy's `diff` against `events.ts` showed only
      the intended lines. The copies used a copied `node_modules`, because the
      plan's symlink recipe fails (see For the author).
- [x] The phone funnel on :4402. `layout.mjs` and `LOOK=h layout.mjs` both
      exit 0. The H lines read
      `ok light / funnel@390x844 #h-hero-signup="Sign Up for Event" signup=true discord=true facebook=true`,
      and the same for `dark`. The F lines match with `#hero-signup`.
- [x] No sideways scroll at 320px. Both `layout.mjs` commands exit 0 on :4401,
      :4403 and :4404 too. Run 8 at once, they timed out on `/gm-submission`
      in F and H alike. Run one at a time, all 8 passed.
- [x] Contrast. `LOOK=h pixc.mjs` exits 0 for every route × port 4401–4404 ×
      mode (64 runs), and F's homepage exits 0 for each port and mode (8 runs).
      Every run reported `fails=0`; the lowest worst-case was 5.00. The plan's
      worked example holds: `/code-of-conduct` in light H reads worst 8.80 at
      320, 390 and 1280, so no text sits on the teal desktop.
- [x] The MailerLite form's states on :4401. `pixc.mjs … <mode> error|success`
      exits 0 with and without `LOOK=h`, in both modes (8 runs).
- [x] `overflow.mjs` on :4401 and :4402 — exit 0, "no breaks from 320 to
      1440px" in light and dark.
- [ ] F is unchanged. **Implementer-reported, not rerun:** 64/64 pairs
      identical at 0px. The owner told this review not to rerun it.
- [x] `npm test`, `npm run lint`, `npx astro check`, `npm run build` — as in
      Phase 1.
- [x] Prettier — as in Phase 1.
- [x] No real MailerLite subscribe request was sent by this review. Only
      `mlform.mjs` and the ad-hoc script touched the form; both abort
      subscribe requests, and neither submitted it.
- [x] This review's `/tmp` copies are deleted, and its servers on :4401–4404
      are stopped. No `/tmp/ozh-*` from the implementer was left over. The
      owner's server on :4321 was left alone.

## Remediation

- The command bar's CSS comment still says the bar "parks below the status bar
  at the end", and that is now false. The status bar sits after `<main>`,
  outside `.home-h`, so the bar parks above it. `GoldBox.astro:424-427` was
  rewritten to say so; its twin in the CSS was not. — plan: Approach, "Chrome":
  "the sticky bar parks at the end of `.home-h` and can't reach the status bar.
  Rewrite the comment … to say this." — `src/assets/goldbox.css:900-903`

## For the author

- **The plan's state recipe doesn't build.** `ozstate` symlinks
  `node_modules`, and `npm run build` then fails with "No cached compile
  metadata found for …/ClientRouter.astro". I reproduced this on HEAD. A copy
  (`cp -a`) builds. Cost: one line in the recipe, in this plan and any plan
  that reuses it.
- **The homepage's H menubar changed below 375px.** The inner pages needed a
  smaller menubar, and the 374px rule applies on `/` too. Before, the font was
  1.55rem up to 360px and full size from 361–374px. Now it is 1.45rem, with
  tighter padding and gap, everywhere up to 374px. The plan allows this ("shrink
  the menubar font below 375px"), but the manual check "On `/`, H looks as it
  did before" should include a phone at 320–374px. Cost: nothing, unless the
  owner wants the old size back on `/`. That would take one `:not(.is-home)`
  scope, and a way to reach it from `.menubar`.
- **`layout.mjs` times out when run in parallel.** Eight runs at once time out
  on `/gm-submission`, waiting for `networkidle` behind the Google Form, in F
  as well as H. This is a hazard for whoever runs the checks, not a defect in
  the slice. Cost: a note in the next plan's recipe, or a longer timeout in
  `layout.mjs`. Editing that script is out of scope here.

## Unverified

- F is pixel-identical to `main` — plan: "F must not change": "Every pair must
  differ by 0 pixels." The implementer reported 64/64 pairs at 0px. The owner
  told this review not to rerun it. — settled by: the plan's `/tmp` comparison
  script run against `ozstate base-offseason 4411` and `ozstate base-open 4412`
  (with a copied `node_modules`) and the branch's two matching states.

## Manual verification

- [ ] On desktop Chrome, on `/gallery`, type ↑ ↑ ↓ ↓ ← → ← → B A. The tune
      plays, the page turns H, and focus is on the page title.
- [ ] Walk all seven inner pages in H, in both colour schemes. Each reads as
      one H window with its own title bar. Note which pages read poorly as a
      skin; they are the candidates for follow-up slices.
- [ ] Press Exit on an inner page. F returns with its navbar and footer. A new
      tab opens in F.
- [ ] On `/`, H looks as it did before this slice, with the menubar and status
      bar in the same places.
- [ ] A human submits the MailerLite form once in H's dialog and once in F
      after Exit.
