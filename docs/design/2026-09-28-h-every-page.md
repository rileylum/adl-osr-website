Branch: feat/h-every-page

# Option H on every page

## Problem

Option H ("The Gold Box, Refined", the Konami-code easter egg) covers the homepage
only. The owner wants the Konami code to work on every page and to switch the whole
site to H. H ships in the same single deploy as the rest of the site, and the owner
will wait for it.

These decisions from the first slice still hold
(`docs/design/2026-09-27-oz-orc-look-spike.md`, section "Easter egg: option H"):
an Exit button back to F, a desktop-only trigger with a responsive H layout, a quiet
Web Audio tune under a second, no trigger while focus is in an input, and H lasting
for the browser session (`sessionStorage` key `oz-look`).

The first slice ruled out inner pages (`plans/2026-09-27-oz-orc-konami-egg.md`,
"Inner pages"). This decision reopens that ruling.

What stands in the way on `main` (a49f29e):

- The Konami listener lives in `GoldBox.astro`'s script, and it does nothing on a page
  without `.home-h`.
- H's tokens are scoped to `html[data-look='h']:has(.home-h)`, and every other H rule
  is scoped to `.home-h`. Nothing styles an inner page in H.
- H's menubar, with its Exit button, and its status-bar footer are written into
  `GoldBox.astro`. The inner pages get F's `Navbar` and `Footer` from `Layout.astro`.
- No H design exists for the inner pages: code-of-conduct, gallery, gm-info,
  gm-submission, location, schedule and what-is-osr.

## Approaches considered

**A. A separate H page for each inner page.** Each inner page gets an H sibling, as the
homepage has `GoldBox`. This honours "H's own markup, not F restyled" everywhere, but
it needs seven new H designs, and each page's copy then lives in two places. Rejected
as the default. It stays available page by page, as approach C.

**B. Shared H chrome, with the inner pages reskinned.** H's menubar and footer move
into a shared component on every page. H's tokens go page-wide. H CSS turns F's shared
primitives (`Section`, `SectionHeading`, `Card`, `FaqItem`, `IconList`, `ComingSoon`,
daisyUI buttons) into the H windows, title bars, text log and buttons that
`goldbox.css` already defines for the homepage. Copy stays in one place. The inner
pages keep F's layout and wear H's look.

**C. B first, then custom H markup where the skin falls short.** After B is on screen,
any inner page that reads poorly as a reskin gets its own H markup, as the homepage
has.

## Chosen approach

C is the goal, reached in slices:

1. **Slice 1, approach B, across all seven inner pages.** This is one reviewable,
   testable outcome.
2. **Follow-up slices, one per page.** Each follow-up replaces one page's skin with
   custom H markup. The owner picks the pages after seeing slice 1. The schedule and
   the gallery are the likely candidates. Each follow-up gets its own brainstorm or
   plan.

The homepage keeps its current `GoldBox` markup. The owner is happy with it, and its
components are more complex than the inner pages' components.

### Slice 1 in outline

- **The trigger goes site-wide.** The Konami listener, the tune, the storage calls and
  Exit move out of `GoldBox.astro` into a script that `Layout.astro` loads on every
  page. The homepage-only parts stay in `GoldBox`: moving the MailerLite form, focusing
  `#h-hero-signup`, and the arrow keys in the MAIN MENU. After Exit, focus goes to the
  page's first heading or link, not to `#hero-signup`, which exists only on the
  homepage.
- **H's chrome is shared.** The menubar, with its Exit button, and the status-bar
  footer move out of `GoldBox.astro` into one component. `Layout` renders it on every
  page, the homepage included. H hides F's `Navbar` and `Footer` on every page, not
  only where `.home-h` exists.
- **H's tokens go page-wide.** Drop `:has(.home-h)` from the token selector, so F's
  Tailwind utilities read H's colours on every page.
- **The skin reuses the homepage's H pieces.** F's shared primitives get stable hooks,
  such as a class or data attribute, so that H CSS never matches on Tailwind utility
  strings. The window, title bar, sunken panel, text-log and button rules in
  `goldbox.css` are widened from `.home-h` to `html[data-look='h']` where the inner
  pages need them. They are not copied.
- **Third-party embeds stay as they are.** The Google Form on gm-submission and the map
  on location sit inside an H window, and their contents are untouched.
- **Checks.** Run the owner's rules on all seven inner pages in H, in both light and
  dark modes: no sideways scroll at 320px, and contrast of at least 4.5:1 for body text
  and buttons, measured on rendered pixels with `scripts/visual/`. Recheck the
  homepage in F and H, including the phone funnel at 390×844, because the chrome and
  tokens move. F must render unchanged on every page. Never send a real MailerLite
  subscribe request.

### Order against the Astro upgrade

The owner has deferred the Astro 5→7 and sharp 0.34→0.35 upgrade. It lands after
this work, not in slice 1 or before it. Slice 1 builds on Astro 5 as it stands on
`main`.

Slice 1 rewrites the view-transition code in `Layout.astro` (`<ViewTransitions />`,
`astro:after-swap`, `astro:page-load`), and the upgrade will change that same code
later. If the upgrade lands before the single deploy, it reruns the H checks from
slice 1 on every page.

## Risks

- **A specificity tie.** Without `:has(.home-h)`, H's token selector drops from (0,2,1)
  to (0,1,1). That ties with CommandBar's `html:has(#cmdbar)` scroll padding, so source
  order would decide the winner. Keep H's selector above (0,1,1) on the homepage, for
  example by adding `:root` to it.
- **Colours that don't come from tokens.** Any F utility or component style with a
  literal colour will ignore H's tokens and may fail contrast in H. The pixel checks
  catch these, and each one is fixed at its source.
- **daisyUI names.** daisyUI ships `.btn`, `.menu` and others. The first slice renamed
  H's classes (`.gb-btn`, `.gb-menu`) to avoid them. Skinning daisyUI's `.btn` on
  inner pages must beat daisyUI's own rules without leaking into F.
- **Some pages may look poor as a skin.** Slice 1 may show that a page reads badly in
  H. That is the planned trigger for a follow-up slice, not a failure of slice 1.
- **The deploy waits on follow-ups.** Each follow-up delays the single deploy. The
  owner decides how many follow-ups to wait for once slice 1 is on screen.
- **View transitions.** The shared chrome and the look attribute have to survive the
  swap. `Layout.astro` already reapplies `data-look` on `astro:after-swap`.
- **The upgrade reopens this code.** The deferred Astro upgrade will touch the same
  view-transition code that slice 1 writes. It could break H's restore and chrome in
  ways that F's checks miss. The upgrade slice has to check both looks.
