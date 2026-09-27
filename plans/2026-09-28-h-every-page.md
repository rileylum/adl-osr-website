# The Konami code switches every page to option H: H's menubar and status bar frame every page, and the seven inner pages wear H's windows, panels and buttons over their own F markup

Branch: `feat/h-every-page`

This is slice 1 (approach B) of `docs/design/2026-09-28-h-every-page.md`. Read that doc's
"Chosen approach" first. The later slices, with custom H markup per page, are out of scope.

## Code Map

- `docs/design/2026-09-28-h-every-page.md` — the design this plan builds. Its section
  "Slice 1 in outline" is the brief.
- `src/components/GoldBox.astro` — H's homepage markup and its script. H has no other
  source: the prototype folder is gone.
  - `:77-118` — the menubar with Exit. It moves to the new chrome component.
  - `:500-519` — the status-bar footer. It moves to the chrome component too, with the
    `socials` array from `:57-74`.
  - `:521-523` — the comment on the command bar being the last child. Rewrite it (see
    Approach, "Chrome").
  - `:528-653` — the script. The storage key, the tune, the Konami listener, Exit and the
    one-open-dropdown click rule move to the chrome component. The form move, focus on
    `#h-hero-signup`, the MAIN MENU arrow keys and the `astro:page-load` restore stay.
- `src/assets/goldbox.css` — H's CSS. Every rule is under `.home-h` or
  `html[data-look='h']:has(.home-h)` today.
  - `:34-47` — show and hide. It is replaced by the `data-look-only` rules.
  - `:49-146` — the tokens and the body font. They go page-wide.
  - `:150-306` — base, windows, title bars, sunken panels and buttons. They are widened
    to the whole page, and hook selectors are added.
  - `:308-410` — the menubar; `:785-827` — the status bar. They are widened.
  - `:880-1145` — the dark, 860px, 600px, 374px, 360px and reduced-motion blocks. They
    split the same way.
- `src/layouts/Layout.astro`
  - `:31-52` — the inline look-restore script. Its comment names `GoldBox.astro` as the
    mirror of its key names. Point that comment at the chrome component.
  - `:129-136` — the body. It renders the chrome component around `<main>`.
- `src/components/Navbar.astro:13` (`<header class="band …">`) and
  `src/components/Footer.astro:30` (`<footer class="band site-footer">`) — F's chrome.
  Each gets `data-look-only="f"`.
- `src/components/CommandBar.astro:108-117` — two global rules, `html:has(#cmdbar)` and
  `body:has(#cmdbar) > footer`. Scope both to F (see Approach, "Tokens").
- F's primitives. Each gets a `data-ui` hook, listed in Approach, "The skin":
  - `src/components/ui/Section.astro:34-38` (the inner column `<div>`);
  - `src/components/ui/SectionHeading.astro:24-45` (the `.cover-strip` and `.keyed`
    wrappers);
  - `src/components/ui/Card.astro:13-21`;
  - `src/components/ui/FaqItem.astro:14`;
  - `src/components/ui/IconList.astro:12`;
  - `src/components/CodeOfConduct.astro:16` and `src/components/ComingSoon.astro:21`
    (the `.read-aloud` divs).
- The inner pages, to read, not to edit: `src/pages/{code-of-conduct,gallery,gm-info,gm-submission,location,schedule,what-is-osr}.astro`
  and the components they render (`CodeOfConduct`, `Gallery`, `WhatIsOSR`, `Schedule`,
  `Location`, `ComingSoon`, `GameCard`).
- `src/assets/app.css` — F's tokens (`:11-108`). The skin maps F's roles that H has no
  value for (`--hero-*`, `--color-spot*`, `--rule-heavy`). `.btn` (`:339`) and `.table`
  (`:344-389`) are the daisyUI component classes the skin matches.
- `src/data/events.ts` — the event state behind every page. The recipes in "Funnel and
  page states" edit a throwaway copy of it, never this file.
- `src/data/home.ts:homeFunnel` — the homepage label for each state: "Sign Up for Event"
  (open), "Register Your Interest" (announced), "Join the Mailing List" (off-season).
- `scripts/visual/layout.mjs`, `pixc.mjs`, `mlform.mjs`, `overflow.mjs` — the owner's
  checks. `layout.mjs` already covers every route at 320px, and `LOOK=h` already works in
  `layout.mjs` and `pixc.mjs`. Don't edit them.
- `plans/2026-09-27-oz-orc-konami-egg.md` and `-review.md` — the first H slice. Its
  review found that the plan's state recipe ran the off-season three times. The recipe
  below replaces it.

## Approach

### Files

| File                                                                                                                | Change                                                                           |
| ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/lib/look.ts`                                                                                                   | New: the look-change event name and type                                         |
| `src/components/GoldBoxChrome.astro`                                                                                | New: H's menubar and status bar around a slot, and the site-wide look script     |
| `src/layouts/Layout.astro`                                                                                          | Wrap `<main>` in `<GoldBoxChrome>`; fix the restore comment                      |
| `src/components/GoldBox.astro`                                                                                      | Drop the menubar, status bar and moved script parts; listen for the event        |
| `src/assets/goldbox.css`                                                                                            | Show/hide by attribute; tokens and shared pieces page-wide; skin rules for hooks |
| `src/components/Navbar.astro`, `Footer.astro`                                                                       | `data-look-only="f"` on the root element                                         |
| `src/pages/index.astro`                                                                                             | `data-look-only` on `.home-f`                                                    |
| `src/components/CommandBar.astro`                                                                                   | Scope its two global rules to F                                                  |
| `src/components/ui/{Section,SectionHeading,Card,FaqItem,IconList}.astro`, `CodeOfConduct.astro`, `ComingSoon.astro` | `data-ui` hooks only; no change to F's classes or markup shape                   |

### The seam: the look-change event

The site-wide script owns the look. The homepage adds its own steps through one event.

```ts
// src/lib/look.ts
/** Fired on `document` by GoldBoxChrome's script, right after <html data-look>
 *  changes and the page scrolls to the top. Cancelable: a listener that places
 *  focus itself calls preventDefault(), and the chrome then leaves focus alone. */
export const LOOK_CHANGE = 'oz-look-change';
export type LookChange = CustomEvent<{ look: 'h' | 'f' }>;
```

The chrome script runs these steps in this order:

- **On the Konami match** (the same key filters as today, with the `.home-h` check
  dropped, so it works on every page; it still does nothing when `data-look` is already
  `h`):
  1. play the tune;
  2. set storage and `data-look`;
  3. `scrollTo(0, 0)`;
  4. dispatch `LOOK_CHANGE` with `{ look: 'h' }` and `cancelable: true`;
  5. if the event was not cancelled, focus the page's first heading.
- **On Exit** (the delegated click on `[data-look-exit]`), the same steps without the
  tune: remove the key, delete `data-look`, scroll, dispatch `{ look: 'f' }`, then focus
  the first heading unless the event was cancelled.
- **The first heading** is `document.querySelector('main h1')`. Give it
  `tabindex="-1"` before focusing it, since a heading can't take focus otherwise. Every
  inner page has one h1, from `SectionHeading as="h1"`.

`GoldBox`'s script listens for `LOOK_CHANGE`:

- on `h`, it moves the form into H, focuses `#h-hero-signup`, and calls
  `preventDefault()`;
- on `f`, it moves the form back, focuses `#hero-signup`, and calls `preventDefault()`.

The homepage keeps today's focus targets, and the chrome script never names a homepage
id. The event is the only thing the two scripts share. The storage key and `'h'` live in
the chrome script, mirrored in `Layout.astro`'s inline script as today.

The chrome script also keeps the rule that only one menubar dropdown is open at a time.
Its query drops the `.home-h` scope: `.gb-menu[open]`. The tune and its comments move
unchanged.

### Chrome

`GoldBoxChrome.astro` renders this:

```text
<header class="menubar" data-look-only="h">…</header>
<slot />
<footer class="window statusbar" data-look-only="h">…</footer>
<script>…</script>
```

`Layout.astro` renders this:

```text
<Navbar showLogo={showLogo} />
<GoldBoxChrome>
  <main class="flex-1 flex flex-col"><slot /></main>
</GoldBoxChrome>
<Footer />
```

- The menubar and status bar markup move from `GoldBox.astro` as they are, along with
  the `socials` array and its imports. The chrome imports `goldbox.css`, so every page
  bundles it. `GoldBox.astro` keeps its import too; Astro loads the file once.
- Keep the `lazy:` comment's duplicate-copy warning. The `socials` array still copies
  `Footer.astro`'s, so name `Footer` in the comment that travels with it.
- **The home link below 375px.** Today the menubar hides its name below 375px, because
  the homepage needs no home link. Inner pages do need one. Below 375px, inner pages show
  the short name `OZ ORC`, and the homepage still hides it. Decide which page you're on
  with `Astro.url.pathname === '/'`. If the bar is wider than 320px, shrink the menubar
  font below 375px until `layout.mjs` passes. Don't drop Exit or a menu.
- **The command bar.** It stays the last child of `.home-h`. The status bar now sits
  after `<main>`, outside `.home-h`, so the sticky bar parks at the end of `.home-h` and
  can't reach the status bar. Rewrite the comment at `GoldBox.astro:521-523` to say this.

### Show and hide

One attribute replaces the class rules at `goldbox.css:34-47` and the
`body:has(.home-h) > :is(header, footer)` selector:

```css
html:not([data-look='h']) [data-look-only='h'],
html[data-look='h'] [data-look-only='f'] {
  display: none;
}
```

- Put `data-look-only="h"` on `.home-h`, the menubar and the status bar.
- Put `data-look-only="f"` on `.home-f`, Navbar's `<header>` and Footer's `<footer>`.
- Keep the `.home-h` class: it remains the scope for homepage-only H rules.
- The selector is (0,2,1), which is above every H display rule, such as
  `html[data-look='h'] .menubar`. The two selectors never match on the same page.

### Tokens

- Change the token selector from `html[data-look='h']:has(.home-h)` to
  `html[data-look='h']`, in the light block, the dark block and the 600px block. Do the
  same for the `body` font and background rule.
- Keep `scroll-padding-block` on `html[data-look='h']:has(.home-h)`. It exists for H's
  sticky command bar, which only the homepage has. The session anchors on `/schedule`
  should jump normally.
- **Map F's remaining roles**, so F's own utilities and scoped styles turn H without a
  hook. Add these to the token blocks:
  - `--hero-bg: var(--titlebar-bg)` and `--hero-content: var(--titlebar-content)`: the
    page-title strip and the `module-code` tag;
  - `--color-spot: var(--highlight)` and `--color-spot-content: var(--highlight-content)`:
    the keyed-number chips on h2s, GameCards and FAQ items;
  - `--rule-heavy: 2px`: the keyed-title rule.
    F's other tokens that H doesn't set (`--band-*`, `--hero-panel`) belong to F's navbar,
    footer and command bar, and to the homepage cover. All of them are hidden in H.
- **A correction to the design's specificity risk.** `:has()` takes the specificity of
  its argument, so CommandBar's `html:has(#cmdbar)` is (1,0,1), not (0,1,1). It already
  beats H's scroll padding on `/` today. And `body:has(#cmdbar) > footer` would pad H's
  new `<footer class="statusbar">` by the bar's height. Fix both at the source: prefix
  both rules in `CommandBar.astro` with `:root:not([data-look='h'])`. F never sets
  `data-look`, so F is unchanged. The token selector then ties with nothing.

### Widening goldbox.css

`goldbox.css` is **unlayered**. Every rule in it beats every Tailwind and daisyUI rule,
whatever the specificity, because those rules sit in cascade layers. A widened rule that
reaches an inner page therefore overrides F's utilities there, such as `mb-4` or `p-6`.
So widen only what the skin needs.

- **Move to `html[data-look='h'] { … }`:**
  - the `a` colour and `:focus-visible` rules;
  - `.hot` and `.icon`;
  - `.window`, `.titlebar`, `.tb-text`, `.ctl`, `.window-body` and `.sunken`;
  - `.gb-btn`, `.gb-btn-primary` and `.gb-actions`;
  - the menubar block and the status-bar block;
  - their dark, 600px, 374px and 360px counterparts.
- **Keep under `.home-h`:**
  - the h1–h3, `p` and `ul` resets;
  - the hero, MAIN MENU, roster, dialog, about, expect, journal, help-log FAQ and command
    bar;
  - their counterparts in the dark and responsive blocks.
- **The chrome's own resets.** The menubar and status bar relied on `.home-h`'s `ul` and
  `p` resets. Give them the same resets under `:is(.menubar, .statusbar)`.
- **No copies.** Add a hook to an existing selector list. Never paste a declaration block
  a second time. For example, `.sunken` becomes `:is(.sunken, [data-ui='card'], …)`.
- Rewrite the header comment (`:1-8`). It says none of the file reaches the inner pages.

### The skin

Tokens do most of the work. A hook exists only where H needs a different shape, not
just different colours.

| Hook                                              | On                                                         | In H                                                                                                                           |
| ------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `data-ui="page"`                                  | `Section`'s inner column, only when `page` is set          | A window: `.window`'s face, frame and bevel, with window-body padding. On phones, it follows the homepage's flat-window rules. |
| `data-ui="page-title"`                            | `SectionHeading`'s h1 wrapper (`.cover-strip`)             | The window's title bar: flush across the top of the page window, with no F frame or inner hairline                             |
| `data-ui="section-title"`                         | `SectionHeading`'s h2 wrapper (`.keyed`)                   | h2 in `--heading`, VT323; the rule under it in `--frame`                                                                       |
| `data-ui="card"`                                  | `Card`'s root                                              | A sunken panel. Its title is in `--heading`, like `.inventory h3`.                                                             |
| `data-ui="faq"`                                   | `FaqItem`'s `<details>`                                    | The homepage help log: a VT323 summary in `--heading`, with the `+`/`−` marker                                                 |
| `data-ui="icon-list"`                             | `IconList`'s `<ul>`                                        | The `►` marker in `--color-muted`, like `.inventory li::before`                                                                |
| `data-ui="read-aloud"`                            | the `.read-aloud` divs in `CodeOfConduct` and `ComingSoon` | A sunken panel                                                                                                                 |
| `.btn`, `.btn-primary` (daisyUI classes, no hook) | every inner-page button                                    | `.gb-btn` and `.gb-btn-primary`, added to their selector lists. Reset daisyUI's `height` and `border` there.                   |
| `.table` (daisyUI and `app.css` class, no hook)   | `Schedule`'s agenda and `WhatIsOSR`'s comparison           | The head row in titlebar colours; the rows on `--surface-raised`, ruled in `--frame`                                           |

Why the page is one window: in light H, the desktop is teal `#008080`. Black body text on
it reads about 4.4:1, and the navy link is worse. The homepage never puts text on the
desktop. The inner pages must not either. Everything sits in the page window, on
`--color-base-200`.

These need no hook, because tokens alone turn them H:

- the Google Form box on `/gm-submission`;
- the map box on `/location`;
- the gallery tiles;
- `GameCard`'s compact cards on `/schedule`;
- `text-(--color-muted)` text.

Third-party embeds keep their contents. Don't style inside an iframe.

### Funnel and page states

Today's data is the **off-season**. Both events are `status: 'past'`, so `currentEvent`
is `undefined`, and `gmApplications` is open until 2026-11-30. Never edit
`src/data/events.ts` in the worktree. Build each state from a throwaway copy of the
committed tree:

```sh
# usage: ozstate <name> <port> [sed args…]; run from the repo root after committing.
ozstate() {
  local name=$1 port=$2; shift 2
  rm -rf /tmp/ozh-$name && mkdir /tmp/ozh-$name
  git archive ${OZREF:-HEAD} | tar -x -C /tmp/ozh-$name
  ln -s "$PWD/node_modules" /tmp/ozh-$name/node_modules
  [ $# -gt 0 ] && sed -i "$@" /tmp/ozh-$name/src/data/events.ts
  (cd /tmp/ozh-$name && npm run build >/dev/null && npx astro preview --port $port)
}
SEP="/^const adelaideSep2026/,/^};/"
```

| State      | Port | Command (run each in the background)                                                                                                                                         | Proves it's that state                                                                                 |
| ---------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| off-season | 4401 | `ozstate offseason 4401`                                                                                                                                                     | `dist/index.html` has "Join the Mailing List"; `dist/schedule/index.html` has "will be posted here"    |
| open       | 4402 | `ozstate open 4402 -e "$SEP s/status: 'past'/status: 'current'/"`                                                                                                            | `dist/index.html` has "Sign Up for Event"; `dist/schedule/index.html` has "Session 1"                  |
| announced  | 4403 | `ozstate announced 4403 -e "$SEP s/status: 'past'/status: 'current'/" -e "$SEP s\|warhornUrl: '[^']*'\|warhornUrl: ''\|" -e "$SEP s/games: adelaideSep2026Games/games: []/"` | `dist/index.html` has "Register Your Interest"; `dist/schedule/index.html` has "Games To Be Announced" |
| GMs closed | 4404 | `ozstate gmclosed 4404 -e '/^export const gmApplications/,/^};/c\export const gmApplications: GmApplications \| undefined = undefined;'`                                     | `dist/gm-submission/index.html` has "Submissions for"                                                  |

- The `\|` in the table escapes the Markdown pipe. In the shell, the character is a
  plain `|`.
- These seds were run against today's `events.ts`. Each one changes exactly the lines it
  should.
- Grep each copy's `dist/` for the string in the last column before running any check.
  A state that fails its grep has not been checked.
- **What each state covers:**
  - open: the owner's phone funnel ("Sign Up for Event"), the schedule's session grids,
    and the location map;
  - announced: the disabled Event Signup link in the menubar, and the schedule's no-games
    branch with its button;
  - off-season: both `ComingSoon` pages, and the Google Form;
  - GMs closed: `/gm-submission`'s card with two buttons.

### F must not change

Build `main` (a49f29e) the same way, with `OZREF=main`:

- `ozstate base-offseason 4411`;
- `ozstate base-open 4412 -e "$SEP s/status: 'past'/status: 'current'/"`.

Write a throwaway Playwright script in `/tmp`, and don't commit it. Import `sharp` from
`/home/riley/dev/adl-osr-website/node_modules/sharp/lib/index.js`. The script compares
each base against the branch's build of the same state:

- the 8 routes in `layout.mjs:15-24`;
- at 390×844 and 1280×900;
- in the light and dark schemes;
- with `reducedMotion: 'reduce'` and no `LOOK`.

For each page:

1. `goto` with `networkidle`, then await `document.fonts.ready`.
2. Resize the viewport to the full `scrollHeight`, as `pixc.mjs` does, and wait for
   `networkidle` again, so every lazy image has loaded.
3. Take a screenshot with `mask: [page.locator('iframe')]`, since the embeds are
   third-party.
4. Count the differing pixels.

Every pair must differ by 0 pixels. If one differs, rerun it once, to rule out a slow
image, before treating it as a regression.

## Assumptions

- The page body in H is one window, with its h1 strip as the title bar. Contrast forces
  this, as "The skin" explains. It isn't a style preference.
- The `module-code` tag ("CONVENTION MODULE OZ3") stays in H and reads as a title-bar
  badge through the token mapping. Hiding it would need a hook for a cosmetic choice.
- `.btn` and `.table` are daisyUI component classes, not Tailwind utility strings. So
  the skin matches them directly rather than hooking about ten buttons one by one.
- Triggering the code on an inner page focuses that page's h1, as Exit does there.
- The site-wide menubar's Attend menu keeps its Event Signup condition
  (`currentEvent?.warhornUrl`), as in `GoldBox.astro` today.
- No new unit test. `createKonami` keeps its tests, and `look.ts` holds only a constant
  and a type. The behaviour lives in the DOM, and the checks below drive it in Chromium.

## Out of scope

- Custom H markup for any inner page (slices 2 and later). The owner picks those pages
  after seeing this slice.
- Any change to the homepage's H markup beyond the moved menubar and status bar.
- The Astro 5→7 and sharp 0.34→0.35 upgrade. Build on Astro 5 as it is.
- Styling inside the Google Form or map iframes.
- Editing `scripts/visual/*.mjs`.
- Moving the copied prose or the socials list into `src/data/`.

## Phase 1 — Site-wide trigger and chrome

1. Write `src/lib/look.ts`.
2. Build `GoldBoxChrome.astro`: move the menubar, the status bar, `socials` and the
   script parts named in the Code Map out of `GoldBox.astro`. Add the event dispatch and
   the first-heading focus.
3. Change `GoldBox.astro`'s script: drop the moved parts, and add the `LOOK_CHANGE`
   listener. Keep the arrow keys and the `astro:page-load` restore.
4. Wrap `<main>` in `Layout.astro`, and fix the restore script's comment.
5. Add the `data-look-only` attributes. Replace the show and hide rules.
6. Make the tokens page-wide, add the F-role mappings, and scope CommandBar's two global
   rules.
7. Widen the base, window, button, menubar and status-bar rules, as in "Widening
   goldbox.css".
8. Commit. Inner pages now show H's chrome and colours over F's shapes on the teal
   desktop. Some text fails contrast in light mode until Phase 2.

**Tests** (drive the off-season build in headless Chromium, with an ad-hoc script)

- The code works on an inner page. On `/schedule` in F, type ↑ ↑ ↓ ↓ ← → ← → B A.
  Expected: `data-look="h"`, `sessionStorage['oz-look']` is `'h'`, the H menubar is
  visible, F's navbar is `display: none`, one AudioContext exists, and `main h1` is
  `document.activeElement`.
- The code does nothing while focus is in an input. On `/`, focus the MailerLite email
  field and type the code. Expected: no `data-look`.
- The homepage keeps its steps. Type the code on `/`. Expected: `.ml-embedded` is inside
  `[data-ml-slot]`, and focus is on `#h-hero-signup`.
- Exit works on an inner page. In H on `/gm-info`, click Exit. Expected: no `data-look`,
  no storage key, F's navbar and footer are visible, and focus is on `main h1`.
- Exit on `/` returns the form. Expected: `.ml-embedded` is the last child of
  `#register .record`, and focus is on `#hero-signup`.
- H survives navigation. In H, click Attend → Event Schedule in the menubar. Expected:
  `/schedule` loads with `data-look="h"` and the H chrome. Browser Back to `/` shows H,
  with the form in `[data-ml-slot]`.
- One dropdown at a time. Open Attend, then GM's. Expected: only GM's has `[open]`.

**Done when**

- [ ] Each Tests line above was observed as stated.
- [ ] `npm test`, `npm run lint`, `npx astro check` and `npm run build` pass.
- [ ] `git ls-files | xargs npx prettier --check --ignore-unknown` passes.

## Phase 2 — Skin the inner pages, and check every state

1. Add the `data-ui` hooks from "The skin".
2. Add the hooks to `goldbox.css`'s selector lists, and write the new rules: the page
   window, the title-bar strip, the section title, the help-log FAQ item, the list
   marker, and `.btn`/`.table`. Cover the dark, 600px and 360px blocks too.
3. Commit. Then build all four states and both base states, and run every check below.
   Fix H's CSS at the rule that fails, and commit again.

**Tests**

- Worked example: in light H, the body text on `/code-of-conduct` sits on
  `--color-base-200` `#c0c0c0` or `--surface-raised` `#ffffff`, never on `#008080`.
  `pixc.mjs` reads a worst contrast above 4.5 for it.
- Worked example: the phone funnel line in the open state reads
  `ok light / funnel@390x844 #h-hero-signup="Sign Up for Event" signup=true discord=true facebook=true`,
  and the same for `dark`.

**Done when**

- [ ] Each state's `dist/` grep from "Funnel and page states" matched, for all four
      states.
- [ ] The phone funnel, in the **open** state (port 4402): `node scripts/visual/layout.mjs http://localhost:4402`
      and `LOOK=h node scripts/visual/layout.mjs http://localhost:4402` both exit 0. Their
      funnel lines show `"Sign Up for Event"` with `signup=true discord=true facebook=true`
      in light and dark.
- [ ] No sideways scroll at 320px: both `layout.mjs` commands exit 0 against ports 4401,
      4403 and 4404 too. That covers all 8 routes, both schemes, and the form's error and
      success states on `/`.
- [ ] Contrast of at least 4.5:1 for body text and buttons, in both modes, on rendered
      pixels. For each port from 4401 to 4404, every route from `layout.mjs:15-24`, and
      each mode (`light`, `dark`), this command exits 0:
      `LOOK=h node scripts/visual/pixc.mjs http://localhost:<port><route> 320,390,1280 <mode>`
      This also exits 0 for each port and mode:
      `node scripts/visual/pixc.mjs http://localhost:<port>/ 320,390,1280 <mode>`
      (F's homepage).
- [ ] The MailerLite form's states, off-season only: `pixc.mjs http://localhost:4401/ 320,390,1280 <mode> <state>`
      exits 0, with and without `LOOK=h`, for each mode, and for `error` and `success`.
- [ ] `node scripts/visual/overflow.mjs http://localhost:4401` and `…:4402` exit 0: F's
      cover is unchanged.
- [ ] F is unchanged: the screenshot comparison in "F must not change" reports 0 differing
      pixels for every pair.
- [ ] `npm test`, `npm run lint`, `npx astro check` and `npm run build` pass.
- [ ] `git ls-files | xargs npx prettier --check --ignore-unknown` passes.
- [ ] No real MailerLite subscribe request was sent. Only `mlform.mjs` drives the form,
      and it aborts subscribe requests. Never submit the form with a real address.
- [ ] `/tmp/ozh-*` is deleted, and every preview server is stopped.

## Manual verification

- [ ] On desktop Chrome, on `/gallery`, type ↑ ↑ ↓ ↓ ← → ← → B A. The tune plays, the
      page turns H, and focus is on the page title.
- [ ] Walk all seven inner pages in H, in both colour schemes. Each reads as one H window
      with its own title bar. Note which pages read poorly as a skin; they are the
      candidates for follow-up slices.
- [ ] Press Exit on an inner page. F returns with its navbar and footer. A new tab opens
      in F.
- [ ] On `/`, H looks as it did before this slice, with the menubar and status bar in the
      same places.
- [ ] A human submits the MailerLite form once in H's dialog and once in F after Exit.

## Implementer notes

- Work on `feat/h-every-page` in `/home/riley/dev/adl-osr-website`. Commit each phase
  separately.
- Never stage these:
  - `package-lock.json` (this plan changes no dependencies);
  - `.playwright-mcp/`, `announcements/`, `docs/agent/` and `what_is_osr_project/`;
  - the root `*.csv` files.
    Stage files by name.
- `node_modules` is installed. If you ever reinstall, run
  `SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm ci`.
- Every Playwright script, ad-hoc ones included, imports
  `/home/riley/.npm/_npx/86170c4cd1c5da32/node_modules/playwright/index.mjs` and
  launches with `executablePath: '/usr/bin/chromium'`.
- Use ports 4401–4412. The owner's dev server may be on 4321.
- The state recipes read the committed tree (`git archive HEAD`). Commit before building
  the states, and rebuild them after each fix commit.
