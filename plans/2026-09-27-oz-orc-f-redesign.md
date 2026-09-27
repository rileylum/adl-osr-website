# Rebuild the whole site in option F, "The Module, Loud"

The site looks like stock daisyUI. Once this lands, every page reads as an early-80s TSR
module in hazard-print type. The homepage becomes the module cover (dragon woodcut, stat
block, Sign Up first), followed by a keyed interior. On phones, a bottom command bar keeps
Sign Up, Discord and Facebook one tap away.

Branch: `feat/oz-orc-f-redesign`

## Code Map

Source of truth for the look: `docs/design/2026-09-27-oz-orc-look-spike.md`, with its
**Tokens**, **Page structure**, **Command bar behaviour**, **Dragon art** and **Traps**
sections. The working prototype is `prototypes/oz-orc-look-f/index.html` and `styles.css`.
It is untracked and local only. Lift its CSS, but not its palette switcher, the `?art=`
sets, or the `../_shared/` URLs. Screenshots of the target are in
`docs/design/assets/2026-09-27-oz-orc-look/final-{light,dark}-{1280,390}.webp`.

Tokens and global styles:

- `src/assets/app.css`: the `ozorc` / `ozorc-dark` daisyUI theme blocks, `@theme`, the
  `title-*` type scale and `logo-ink`. All colour and shape decisions land here.
- `src/layouts/Layout.astro`: the `<head>` (font preloads go here) and the body shell.
  The MailerLite loader script must stay untouched.

The seam (new):

- `src/data/home.ts` (new): `homeFunnel()`. It copies the pattern of
  `src/data/faq.ts:homeFaqs` (a state object in, plain data out).
- `src/data/home.test.ts` (new): copies the fixture style of `src/data/faq.test.ts`.

Homepage (Phase 2):

- `src/pages/index.astro`: the section order and the `alternating-sections` rule, which F
  drops.
- `src/components/Hero.astro`: replaced by a new `src/components/Cover.astro`. Its
  three-state tuple moves into `homeFunnel()`.
- `src/components/CommandBar.astro` (new).
- `src/components/FeaturedGames.astro` and `src/components/GameCard.astro`: the Swiper
  carousel becomes F's encounter cards.
- `src/components/RegisterInterest.astro`: the MailerLite embed, framed as F's record sheet.
- `src/components/CallForGames.astro`, `About.astro`, `WhatToBring.astro`,
  `Testimonials.astro`, `FAQ.astro`.

Shared chrome and primitives (Phase 1, sitewide):

- `src/components/Navbar.astro`, `NavDropdown.astro`, `NavLink.astro`, `Footer.astro`
- `src/components/ui/Section.astro`, `SectionHeading.astro`, `Card.astro`,
  `FaqItem.astro`, `IconList.astro`, `ExternalLink.astro`, `RichText.astro`
- `src/components/ComingSoon.astro`: the off-season body of `/schedule` and `/location`.

Inner pages (Phase 1):

- `src/pages/gm-info.astro`, `gm-submission.astro`
- `src/components/Schedule.astro`, `Location.astro`, `CodeOfConduct.astro`,
  `Gallery.astro`, `WhatIsOSR.astro`

Data read by the seam:

- `src/data/events.ts`: `currentEvent`, `latestEvent`, `gmApplications`,
  `nextEventWindow`, and the `Event` and `GmApplications` types.
- `src/data/site.ts`: `site.socials.{discord,facebook}`.
- `src/lib/format.ts:longDate`

Checkers (copied from the spike's `/tmp/ds/` at planning time; untracked):

- `scripts/visual/pixc.mjs`: rendered-pixel contrast checker.
- `scripts/visual/proto-check.mjs`: first-screen funnel and sideways-scroll checker,
  written against the prototype server. Rewrite it as described in Phase 1.

## Approach

### Tokens

Put the doc's **Tokens** block into the existing theme blocks in `app.css`:
`[data-theme='light']` becomes `ozorc` and `[data-theme='dark']` becomes `ozorc-dark`.

- **Theme blocks.** Keep `prefersdark: true`. The mode follows the OS, as it does today,
  and no theme toggle gets added. Put the doc's non-daisyUI tokens in the same blocks
  (`--color-muted`, `--color-rule`, `--color-link`, `--hero-*`, `--color-spot*`,
  `--band-*`, `--surface-raised`, `--color-focus`). The blocks already carry a custom
  property (`--logo-filter`), so this works.
- **Other daisyUI colours.** daisyUI still needs the colours the doc leaves out. Set:
  - `neutral` = `--band-bg` and `neutral-content` = `--band-content`
  - `accent` = `--hero-bg` and `accent-content` = `--hero-content`
  - `base-300` one step darker than `base-200`: `#dccaa0` in light, `#2b2016` in dark
  - the status colours (`info`, `success`, `warning`, `error`) keep their stock values
- **Shape.** Set `--radius-selector`, `--radius-field` and `--radius-box` to `0`, and
  `--border` to `3px`. Set `--depth` and `--noise` to `0`: no shadows, no gradients.
- **`@theme`.** Set `--font-sans` and `--font-display` to the doc's stacks, and
  `--spacing-section` to the doc's `clamp(3rem, 7vw, 5rem)`. Add `--rule-heavy: 8px` and
  `--bar-h: 56px` as plain `:root` properties.
- **`--surface-raised`.** Keep the existing `@theme inline` mechanism, but its default
  becomes the doc's `--surface-raised` value. The homepage stops alternating section
  backgrounds (see Phase 2), so no section flips it any more.
- **Delete stale code.** Delete `--logo-filter` and the `logo-ink` utility. The cover
  logo sits on the cream panel in both modes, so it is never inverted, and the navbar
  logo is always on the dark band (see Chrome). Delete the "currently match daisyUI's
  stock" comment.

### Fonts

Self-host the fonts as files in `public/fonts/`. Don't add an npm package: that would
rewrite `package-lock.json`, which carries unrelated uncommitted changes. Download the
latin-subset `woff2` files that
`https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wdth,wght@62..125,400..900&display=swap`
points to. Request that URL with a modern browser `User-Agent`, or it serves TTF.

- Save them as `public/fonts/anton-latin.woff2` and `public/fonts/archivo-latin.woff2`.
  Archivo is one variable file covering `wdth` 62–125 and `wght` 400–900.
- Add both fonts' OFL text as `public/fonts/OFL.txt`.
- Write the `@font-face` rules in `app.css` with `font-display: swap`. Give Archivo
  `font-stretch: 62% 125%` and `font-weight: 400 900`.
- Preload both files in `Layout.astro` (`<link rel="preload" as="font" type="font/woff2"
crossorigin>`). Both appear in the first screen.

### Global element styles

Add these to `app.css` under `@layer base`.

- **Body.** Background `--color-base-100`, colour `--color-base-content`, `--font-sans`
  at `1.0625rem`, line height `1.6`.
- **Links.** Colour `--color-link`, underline thickness 2px, underline offset 3px.
- **Focus.** `:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px }`.
- **Headings.** `h1, h2, h3` use `--font-display` at weight 400.
- **The label style.** This is Archivo, `font-variation-settings: 'wdth' 70`, weight 800,
  uppercase, letter spacing `.06em`. Make it a `label-caps` utility. Use it only for short
  labels, never paragraphs: buttons, stat labels, table heads, captions, the bar's words.
  Apply it to daisyUI's `.btn` as well.
- **Retune the `title-*` utilities** so they keep their roles in F's voice:
  - `title-page` and `title-section`: Anton, uppercase.
  - `title-card`: Anton.
  - `title-group`: `label-caps`.

  These must still step down on phones. The existing comment about "INFORMATION" at
  320px still applies.

### Links on coloured grounds

Link colour works by flipping a token. Every `link link-primary` becomes plain `link`. A
coloured band sets `--color-link` on itself, the same way sections once flipped
`--surface-raised`:

- the footer and command bar set `--color-link: var(--band-content)`
- the cover sets `--color-link: var(--hero-content)`

Yellow `--color-primary` never colours text on cream, where it measures about 1.6:1.
Grep for `link-primary` and `text-primary` to find every case (`ExternalLink`'s default
class, `RichText`, `About`, `gm-info`, `Footer`).

### Primitives: F's voice for every page

These restyles carry most of the inner-page redesign.

- **`SectionHeading` with `as="h2"` is the keyed heading.** It is left-aligned Anton
  caps, with `--rule-heavy` in `--color-rule` underneath. The number comes from a CSS
  counter, drawn in a `--color-spot` box: "1.", "2.", and so on.
  - Section numbers depend on which sections render, and that changes with the event
    state. CSS counters number them by position, so no JS and no prop is needed.
  - Set it up like this: `main { counter-reset: key }`. The heading's root element does
    `counter-increment: key; counter-reset: sub`, and its number is a `::before` with
    `content: counter(key) "."`.
  - Sub-keys ("1a", "6c") are a `.sub-key` element with
    `::before { counter-increment: sub; content: counter(key) counter(sub, lower-alpha) }`.
    The featured-game cards and every `FaqItem` show one.
  - The subtitle becomes a muted paragraph under the rule.
- **`SectionHeading` with `as="h1"` is the page's cover strip.** It is a full-width
  `--hero-bg` band with the cover's double-ruled frame: the border plus the inset
  box-shadow from the prototype's `.cover-panel`.
  - It holds the "CONVENTION MODULE / OZ3" tag at top right, the title in Anton caps, and
    the subtitle and slot content in `--hero-content`.
  - It has no dragon and no corner banner. The doc limits the art to the homepage cover.
  - Layout's `<main>` gives every inner page one of these as its opening block.
- **`Card`** is a `bg-raised` box with a `--border` rule in `--color-rule`, square, with
  no shadow.
- **`FaqItem`** becomes a native exclusive accordion: `<details name={group}>`, with the
  `.sub-key` in the summary and "+" / "−" drawn by CSS. Lift the prototype's `.dm-notes`
  rules. The props stay the same (`question`, `group`, `open`), so no caller changes.
  This deletes daisyUI's radio-input hack.
- **`IconList`** keeps its markup. The marker colour becomes `--color-rule`, not
  `--color-primary`.
- **`Section`**: the `page` variant keeps `flex-1` but drops `bg-base-200`. F pages sit
  on `base-100`, and the cover strip gives them their colour.
- **daisyUI `.table`** gets restyled once in `app.css` to the prototype's dice-table look
  (`.roll`):
  - a `--color-base-content` header band with `label-caps` text
  - `--color-rule` rules and a heavy outer border
  - no zebra striping; drop `table-zebra` from its two callers
  - an Anton first column where the table is a roll table

### Chrome (sitewide)

- **Navbar.** A `--band-bg` / `--band-content` band. Keep daisyUI's `dropdown-hover`
  menus, which need no JS, restyled to the prototype's `.menu` look: square, a
  band-coloured list, 1px rules between items, and caps summaries with a "↓" after them.
  Don't port the prototype's `<details>` menus and their click-outside script.
  - The site name reads "ADL OSR // OZ ORC", with the `//` `aria-hidden`.
  - Inner pages keep the logo as the home link, with the class `invert` because the band
    is dark in both modes.
  - The name shows at ≥ `sm` when the logo is present. On the homepage, which passes
    `showLogo={false}`, the name shows at ≥ 375px.
  - The existing comments about fitting 320px stay true. Update them if the widths change.
- **Footer.** Build it fresh, not on daisyUI's `footer` classes (see the spike doc's
  Traps). It has:
  - a `--band-bg` background, with `--rule-heavy` in `--color-rule` along the top
  - 48px square social links with a `--border` rule, and hover inverting them
  - the contact line and the copyright
  - the "OZ3" code mark
- **Module code.** "OZ3" appears on the cover, the cover strips and the footer. Add it
  once as `site.edition = 'OZ3'` in `src/data/site.ts`, with a comment saying it is the
  number of the next convention: Sep 2026 was OZ ORC 2.

### The seam: `homeFunnel()`

`src/data/home.ts` owns all the event-state branching for the homepage's cover and
command bar. The components only display what it returns.

```ts
import type { Event, GmApplications } from './events';

export interface FunnelState {
  currentEvent: Event | undefined;
  latestEvent: Event;
  gmApplications: GmApplications | undefined;
  /** events.ts nextEventWindow, e.g. "February 2027". */
  nextEventWindow: string;
  socials: { discord: string; facebook: string };
}

export interface Cta {
  label: string; // hero button, and the bar's desktop label
  short: string; // the bar's phone label; must fit 320px
  href: string;
  external: boolean;
}

export interface Stat {
  label: 'Date' | 'Tickets' | 'Games';
  lead?: string; // small text before the numeral ("Sat")
  big: string; // the Anton numeral ("12", "$15", "TBC")
  small: string[]; // small lines after it, one per line
  datetime?: string; // Date only, when a real date exists
  spoken?: string; // aria-label for Date, when the pieces don't read aloud
}

export interface HomeFunnel {
  title: string; // h1 text after the "OZ ORC:" kicker
  lead: [strong: string, plain: string];
  primary: Cta;
  discord: string;
  facebook: string;
  stats: [Stat, Stat, Stat]; // Date, Tickets, Games, in that order
  venue: string;
  gmLink?: { label: string; href: string };
  hasGames: boolean; // the bar's GAMES slot and #games exist only when true
}

export function homeFunnel(state: FunnelState): HomeFunnel;
```

Invariants and error modes:

- **The three states** are the ones `Hero.astro` branches on today, and their copy is
  lifted verbatim:
  1. **Registration open**: a current event with a truthy `warhornUrl`.
  2. **Announced**: a current event with no `warhornUrl`.
  3. **Off-season**: no current event.
- **`primary`**:
  - Registration open: `{ label: 'Sign Up for Event', short: 'Sign Up', href:
warhornUrl, external: true }`.
  - Announced: `'Register Your Interest'` / `'Register'` → `'#register'`.
  - Off-season: `'Join the Mailing List'` / `'Join List'` → `'#register'`.
- **`facebook`** is `currentEvent?.facebookEventUrl ?? socials.facebook`, so the Facebook
  button always shows (the owner's funnel rule).
- **Date stat**:
  - With a current event, it shows the weekday, the day and `[month, year]` from the ISO
    date. Compute the weekday with `Date.UTC`, never local time. `datetime` is the ISO
    date, and `spoken` is `"Saturday, " + longDate(date)`.
  - Off-season, it shows `big: 'TBC'` and `small: [first three letters of the month
word, year]`, parsed from `nextEventWindow`.
  - If `nextEventWindow` doesn't match `/^[A-Z][a-z]+ \d{4}$/`, throw. The build fails
    loudly rather than printing a garbled date (the spike doc's allow-list trap).
- **Tickets stat** uses `currentEvent ?? latestEvent` for the price. The label shows
  `$amount` big and the currency small.
- **Games stat**:
  - With games: the count big, and `['on the', 'table']` small.
  - Otherwise, while `gmApplications` is set: `'GMs'` / `['wanted']`.
  - Otherwise: `'TBA'` / `['games']`.
- **`venue`** is the current event's `venue.name`, or `'Adelaide — venue TBC'`
  off-season.
- **`title`** is `"Adelaide's Old-School D&D & OSR Convention"`, plus `" " + year` when
  there is a current event. That matches today's h1.
- **`gmLink`** is set only while `gmApplications` is:
  `{ label: 'GMs wanted: apply by ' + longDate(closes).split(',')[0], href:
'/gm-submission' }`.
- **Purity.** `homeFunnel` reads only its argument, no module state. `Cover.astro` and
  `CommandBar.astro` each call it with the real `events.ts` and `site.ts` values. One
  call in `index.astro`, passed down as a prop, is equally fine.

### The easter egg's seam (slice 2)

Build no look switcher, no `data-look` attribute and no Konami code in this slice. Leave
the seam slice 2 needs:

- In `index.astro`, F's homepage body sits under one root element (`<div
class="home-f">`): the cover, the keyed interior and the command bar. Slice 2 can then
  hide it and mount H's markup in its place.
- Everything H will need comes from pure modules: `homeFunnel`, `homeFaqs` and the games
  data. No state branching lives in F's markup.
- `CommandBar`'s script no-ops when `#cmdbar` or `#hero-signup` is missing. Slice 2 may
  remove either element.
- Don't touch `prototypes/`. `prototypes/oz-orc-look-h/` is slice 2's only source.

### Homepage structure

Follow the doc's **Page structure**, in order.

- **Cover (`Cover.astro`).** Lift the prototype's `.cover` markup and CSS as scoped
  styles.
  - **The logo** stays an `<img>` of `/images/OZORC_Dungeon-*.webp`, keeping today's
    `srcset`, `fetchpriority` and preload. It sits in the `--hero-panel` frame with no
    filter. The logo is black line art and the panel is cream in both modes. Don't port
    the prototype's mask-painted logo: it would load the 226 KB SVG for the page's LCP
    image.
  - **Icons** come from the existing `src/assets/*.svg?raw` imports, as `Hero.astro` does
    today. Don't port the prototype's mask icons.
  - **The dragon.** Copy `docs/design/assets/2026-09-27-oz-orc-look/dragon-mask.webp` to
    `public/art/dragon-mask.webp`. Use the doc's `.cover::before` CSS verbatim: 20%
    opacity, the phone and ≥860px anchors, and a root-relative `url()` (trap 1). The
    stat block keeps a solid `--hero-bg` background. Credit the woodcut with a CSS
    comment on that rule, citing the doc's Credit section.
  - **The hero Sign Up** is the element `id="hero-signup"`. It renders
    `funnel.primary.label` whatever the state. It gets `target="_blank"` and `rel` only
    when `primary.external` is true.
- **The interior.** The existing sections, in today's state-dependent order, each opened
  by a keyed `SectionHeading`.
  - Drop the `alternating-sections` wrapper and its `<style is:global>` block. F's
    interior is one continuous page.
  - **Featured games** is `id="games"`. Delete Swiper, its CSS imports and its script.
    Use the prototype's `.encounters` grid instead: a scroll-snap row on phones inside
    its own `overflow-x: auto`, and a 3-column grid at ≥860px. `GameCard` with
    `variant="featured"` becomes the prototype's `.encounter`: image, `.sub-key` and
    title, a statline for system, level and GM, a 4-line clamped description, and a
    "Sign Up on Warhorn →" button. Show every game the event has, as the carousel does.
  - **Stay in the loop** is `RegisterInterest`. It gets a keyed heading plus the subtitle
    "Hear first when dates and games are announced.", inside the prototype's `.record`
    frame. The MailerLite embed stays as it is. Its form, fields and styling belong to
    MailerLite. Keep the `.checkbox` fix.
  - **About** gets the drop cap and two columns at ≥760px. It uses the Sep 2026 photo
    `/images/gallery/sep-2026/wrap-up-01.webp` as "Fig. 1", with the caption "The hall
    at a past OZ ORC.".
  - **What to Expect** has two daisyUI `.table` roll tables, captioned "What to Bring
    (d4)" and "What We Provide (d3)". It keeps the "First Time at an OSR Event?"
    `aside`, drawn as the prototype's `.read-aloud` box.
  - **What Attendees Say** is one `.read-aloud` `figure` with a `blockquote`.
  - **FAQ** is `FaqItem`s, which now show sub-keys. The JSON-LD stays as it is.
  - **CallForGames** gets a keyed heading "GMs Wanted", and its buttons are restyled.
- **Command bar (`CommandBar.astro`).** Use the doc's JS and CSS, and the prototype's
  `.cmdbar` rules. The slots are:
  - SIGN UP, using `primary`'s label, or its short label on phones
  - GAMES (`#games`), only when `hasGames`
  - DISCORD
  - FACEBOOK
  - RUN A GAME (`/gm-submission`)

  Implementation notes:
  - Use `grid-template-columns: 1.35fr; grid-auto-flow: column; grid-auto-columns: 1fr`,
    so four or five slots both fill the bar.
  - Put it in `index.astro` only. Inner pages have no bar.
  - The footer padding and the `html` `scroll-padding-bottom` apply only where the bar
    exists. Use `body:has(#cmdbar)` in the component's global style, not a Layout prop.
  - The script runs on `astro:page-load`, because of view transitions. It disconnects
    the previous `IntersectionObserver` first, then observes `#hero-signup`.

### Inner pages

Each page gets the cover strip from its `h1` `SectionHeading`, with sections below it as
keyed headings. Where a page lacks section headings, add them.

| Page                                  | Treatment                                                                                                                                                                                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/gm-info`                            | "1. Support & Resources": the `Card`, with `title-group` sub-labels. "2. GM FAQ": replace the bare `<h2 class="title-card">` with a keyed `SectionHeading`; the `FaqItem`s become 2a–2h. The CTA becomes `btn-primary btn-lg` with a trailing "→". |
| `/gm-submission`                      | Its bare `<h1>` becomes `SectionHeading as="h1"`. The iframe frame becomes a `Card`-style ruled box. Drop `rounded-box shadow-sm`.                                                                                                                 |
| `/schedule` (event)                   | The agenda becomes a roll table. Each session becomes a keyed heading ("2. Session 1 — 9:00AM–12:00PM"). The compact `GameCard`s become small encounters with no description, the whole card linking to Warhorn.                                   |
| `/location` (event)                   | The map becomes a ruled frame; drop `rounded-lg`. "Getting Here" stays a `Card`.                                                                                                                                                                   |
| `/schedule`, `/location` (off-season) | `ComingSoon` becomes a cover strip, a `.read-aloud` box holding the slot message, and its two buttons.                                                                                                                                             |
| `/code-of-conduct`                    | The `Card` becomes a `.read-aloud` box.                                                                                                                                                                                                            |
| `/gallery`                            | Each event's `h2` becomes a keyed heading. The tiles become ruled, square, shadowless figures with no rounding. Keep the hover zoom, but only under `prefers-reduced-motion: no-preference`.                                                       |
| `/what-is-osr`                        | Primitives only. Drop `table-zebra`. It's out of the nav but still built, so it must pass the checks.                                                                                                                                              |

### Checkers

Adapt both scripts in `scripts/visual/`. Keep each self-contained, with the Playwright
import as the local npx copy (see Implementer notes).

- **`pixc.mjs`** becomes `node scripts/visual/pixc.mjs <url> [width] [light|dark]`:
  - Replace `pngjs` with `sharp`, which is already a devDependency:
    `sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })`.
  - Pass the mode as the context's `colorScheme`.
  - Require 4.5 for any text inside `a`, `button` or `summary`, whatever its size. The
    owner's rule is 4.5:1 for buttons, and the spike's large-text 3:1 would let big
    buttons through. Keep the 3:1 large-text floor for headings.
  - Exit 1 when anything fails.
- **`proto-check.mjs`** becomes `scripts/visual/layout.mjs <baseUrl>`. It loops over all
  eight routes (`/`, `/code-of-conduct`, `/gallery`, `/gm-info`, `/gm-submission`,
  `/location`, `/schedule`, `/what-is-osr`), in both colour schemes:
  - `document.documentElement.scrollWidth` must equal 320 at a 320px viewport.
  - On `/` only, at 390×844 in both schemes, three things must sit fully inside the
    first screen and not have `visibility: hidden`: `#hero-signup`, a Discord link and a
    Facebook link. The script prints `#hero-signup`'s text.
  - It exits 1 on any failure.
  - Drop the screenshots and the computed-style contrast pass. `pixc` measures contrast.

## Assumptions

- The mode follows the OS (`prefersdark`), as it does today. No theme toggle gets added.
- Command bar on the homepage only. Inner pages get the band navbar and footer.
- The inner-page cover strips and keyed headings are this plan's extension of F. The doc
  covers only the homepage. The owner asked for a full redesign of every page, not only
  colour and contrast fixes.
- Featured games shows every game an event has, as the carousel does (17 for Sep 2026).
  The prototype's six were a sample.
- Two Sign Up buttons on the phone's first screen (the hero's and the bar's) is accepted,
  per the doc's Traps.
- The dragon's credit goes in a code comment, not visible site text. The woodcut is
  public domain, and the doc keeps the full credit.
- The "Sign Up for Event" state is checked visually by temporarily flipping the Sep 2026
  event to `current` (see Implementer notes). The announced state is covered by Vitest
  only.

## Out of scope

- The Konami-code easter egg (option H), its sound, and any look switcher. That is
  slice 2.
- Deleting or editing anything under `prototypes/`, and the doc's **Retirement** step.
- Removing the `swiper` package. It becomes unused, but `npm uninstall` rewrites
  `package-lock.json`, which carries unrelated uncommitted changes. Leave it for a
  follow-up.
- Restyling the inside of the MailerLite form (it belongs to the MailerLite dashboard),
  the Google Form iframe and the map iframe.
- Hiding the bar while the on-screen keyboard is open, and shrinking the bar's Sign Up
  until the hero's scrolls away. Both are ideas from the prototype's author.
- The unused `logo` view-transition CSS in `Layout.astro`.

## Phase 1: tokens, chrome, primitives, inner pages

1. Replace the theme blocks, `@theme` and global styles in `app.css` as in Approach, and
   add the fonts.
2. Restyle the primitives, then `Navbar` and `Footer`, then `ComingSoon`.
3. Apply the inner-page table.
4. Adapt the two checkers.

The homepage still shows the old `Hero` at the end of this phase. That is why this phase
does not merge alone.

**Tests**

No new unit tests. Everything this phase changes is presentation, and the rendered
checks below gate it.

**Done when**

- [x] `npm test`, `npm run lint`, `npm run format:check` and `npx astro check` pass.
      format:check ran against tracked files only
      (`git ls-files | xargs npx prettier --check --ignore-unknown`): the working tree
      holds untracked files outside this plan that Prettier flags.
- [x] `npm run build` succeeds.
- [x] With `npx astro preview` running,
      `node scripts/visual/layout.mjs http://localhost:4321` passes the 320px check on all
      eight routes. The funnel check on `/` may still fail here.
- [x] `pixc.mjs` reports `fails=0` for every route except `/`, at widths 390 and 1280, in
      `light` and `dark`.

## Phase 2: the homepage

1. Write `homeFunnel()` test-first.
2. Build `Cover.astro` on it and delete `Hero.astro`.
3. Rebuild the interior sections and `index.astro` under `.home-f`.
4. Add `CommandBar.astro`.

**Tests**

All at `src/data/home.ts:homeFunnel`, with fixtures in the style of `faq.test.ts`. Each
worked example below was derived by hand from `events.ts` data and today's `Hero.astro`
copy. Don't recompute them from the implementation.

- Registration open, with a fixture of the Sep 2026 event (`date: '2026-09-12'`, price
  `15 AUD`, Warhorn `https://warhorn.net/events/ozorc-adelaide-september-2026`, Facebook
  `https://www.facebook.com/share/1HQ8CNDTai/`, 17 games), `gmApplications.closes =
'2026-11-30'`, `nextEventWindow = 'February 2027'`:
  - `primary` → `{ label: 'Sign Up for Event', short: 'Sign Up', href: 'https://warhorn.net/events/ozorc-adelaide-september-2026', external: true }`
  - `stats[0]` → `{ label: 'Date', lead: 'Sat', big: '12', small: ['Sep', '2026'], datetime: '2026-09-12', spoken: 'Saturday, September 12th, 2026' }`
  - `stats[1]` → `{ label: 'Tickets', big: '$15', small: ['AUD'] }`
  - `stats[2]` → `{ label: 'Games', big: '17', small: ['on the', 'table'] }`
  - `facebook` → `'https://www.facebook.com/share/1HQ8CNDTai/'`
  - `title` → `"Adelaide's Old-School D&D & OSR Convention 2026"`
  - `lead` → `["Ready to join Adelaide's premier old-school gaming convention?", 'Sign up now or join our Discord community!']`
  - `gmLink` → `{ label: 'GMs wanted: apply by November 30th', href: '/gm-submission' }`
  - `hasGames` → `true`
- Off-season (today's real state): `currentEvent: undefined`, `latestEvent` = the same
  Sep 2026 fixture, the same `gmApplications`, `socials.facebook =
'https://www.facebook.com/profile.php?id=61582507863401'`:
  - `primary` → `{ label: 'Join the Mailing List', short: 'Join List', href: '#register', external: false }`
  - `stats[0]` → `{ label: 'Date', big: 'TBC', small: ['Feb', '2027'] }`, with no
    `datetime`
  - `stats[1]` → `{ label: 'Tickets', big: '$15', small: ['AUD'] }`
  - `stats[2]` → `{ label: 'Games', big: 'GMs', small: ['wanted'] }`
  - `facebook` → the profile URL above
  - `venue` → `'Adelaide — venue TBC'`
  - `title` → `"Adelaide's Old-School D&D & OSR Convention"`
  - `hasGames` → `false`
- Announced: a current event with `warhornUrl: ''` and `games: []`:
  - `primary.label` → `'Register Your Interest'` and `primary.href` → `'#register'`
  - `stats[2]` → `{ big: 'GMs', small: ['wanted'] }`
  - `facebook` falls back to `socials.facebook` when the event has no
    `facebookEventUrl`
- Off-season with `gmApplications: undefined`:
  - `gmLink` → `undefined` and `stats[2]` → `{ big: 'TBA', small: ['games'] }`
- `nextEventWindow: 'Autumn-ish'` off-season → throws.
- Weekday is timezone-proof: `'2026-02-07'` → `lead: 'Sat'` with `TZ=Pacific/Kiritimati`
  and with `TZ=Pacific/Pago_Pago`. Run Vitest under both, or assert with a fixed TZ and
  say which.

**Done when**

- [x] Everything in Phase 1's Done when, now on all eight routes. That includes `/` in
      pixc, and the funnel check in `layout.mjs`.
- [x] Off-season (the real data), `layout.mjs` prints `#hero-signup` = "Join the Mailing
      List" and passes.
- [x] With the temporary registration-open flip (Implementer notes), `npm run build`
      passes. Then `layout.mjs` prints `#hero-signup` = "Sign Up for Event" and passes,
      and pixc reports `fails=0` on all eight routes, in both modes, at 390 and 1280.
      Revert the flip afterwards and confirm `git diff src/data/events.ts` is empty.
- [x] `grep -rn "swiper\|link-primary\|logo-ink\|alternating-sections" src` returns
      nothing.

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

## Implementer notes

- **Playwright.** Playwright's bundled browser is the wrong version on this machine. The
  scripts import
  `/home/riley/.npm/_npx/86170c4cd1c5da32/node_modules/playwright/index.mjs` and launch
  with `executablePath: '/usr/bin/chromium'`. Keep that path as a constant at the top of
  each script.
- **The registration-open flip, for checking only.** In `src/data/events.ts`, change
  `adelaideSep2026`'s `status: 'past'` to `'current'`. Build, preview and run the checks,
  then set it back to `'past'`. Never commit it. It is the only way to render "Sign Up
  for Event", 17 encounters, the GAMES bar slot, and the event versions of `/schedule`
  and `/location`.
- **Files to leave alone.** Leave `.prettierignore`, `eslint.config.js` and
  `package-lock.json` unstaged: their changes predate this work. Leave the root-level
  CSVs, `announcements/`, `docs/agent/`, `what_is_osr_project/`, `.playwright-mcp/` and
  `prototypes/` untracked. `prototypes/_shared/` is 69 MB and must never be committed.
- **Files to commit.** Commit `scripts/visual/` with this slice.
- **Lifting from the prototype.** When you lift CSS from `prototypes/oz-orc-look-f/`,
  rewrite every `../_shared/...` URL to a root-relative site path. The prototype's
  `data-palette` and `data-art` selectors have no meaning here: drop the prefix and keep
  only the dragon rules.
