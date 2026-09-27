# Typing the Konami code on the homepage plays a short retro tune and swaps the page to option H, "The Gold Box, Refined", which stays for the rest of the browser session until the visitor presses Exit

Branch: `feat/oz-orc-konami-egg`

## Code Map

- `docs/design/2026-09-27-oz-orc-look-spike.md` — section "Easter egg: option H": the
  owner's rules this plan implements. Section "Retirement" names the follow-up.
- `/home/riley/dev/adl-osr-website/prototypes/oz-orc-look-h/` — H's source, **untracked
  and present only in the main checkout**. Read it by this absolute path; don't copy the
  folder into this tree.
  - `index.html` — the markup to lift: menubar, hero window with MAIN MENU, roster,
    dialog, about viewport and text log, inventory, journal, FAQ help log, status-bar
    footer, and command bar. The inline `<script>` at the bottom holds the MAIN MENU
    arrow-key cursor and the one-open-dropdown rule; lift both.
  - `styles.css` — H's CSS. Lift everything except the `MAC` block and every
    `[data-palette='mac']` rule.
  - `palettes.css:5-33` — the `goldbox` light and dark tokens. This is the only palette
    that ships.
  - `NOTES.md` — contrast per palette, and the traps the prototype hit: `minmax(0, 1fr)`
    and a `clamp()` size on every menu item. Without them, the page is 362px wide at 320.
- `src/pages/index.astro` — F's body sits under `<div class="home-f">`. Mount H as a
  sibling after it. `homeFunnel(...)` is already computed here as `funnel`.
- `src/data/home.ts:homeFunnel` — the funnel H renders: `title`, `lead`, `primary`,
  `discord`, `facebook`, `stats`, `venue`, `gmLink`, `hasGames`. Don't change it.
- `src/data/faq.ts:homeFaqs` and `src/components/ui/RichText.astro` — the FAQ answers
  and their renderer. H's help log uses both. `src/components/FAQ.astro` shows the call.
- `src/data/events.ts` — `currentEvent` (with `.games`), `gmApplications`,
  `nextEventWindow`, `latestEvent`. `src/data/site.ts:site` — socials and email.
- Copy sources for H's static prose. Keep the same event-state branches and the same
  data expressions:
  - `src/components/About.astro` — four paragraphs and the photo
    `/images/gallery/sep-2026/wrap-up-01.webp` with its alt text;
  - `src/components/WhatToBring.astro` — both lists;
  - `src/components/Testimonials.astro` — the quote;
  - `src/components/CallForGames.astro` — the three-state "GMs Wanted" copy;
  - `src/components/Navbar.astro:52-68` — the menu links, including the Warhorn link
    that's disabled when there's no `warhornUrl`;
  - `src/components/Footer.astro` — socials, contact and copyright.
- `src/assets/{discord,facebook,instagram,bluesky,calendar,location}.svg?raw` — site
  icons. Use these instead of the prototype's mask icons.
- `src/components/RegisterInterest.astro` — holds the live MailerLite embed,
  `<div class="ml-embedded" data-form="B6FVva">`. **Read only.** Another slice
  (`feat/mailerlite-form-f-look`) is restyling this file and `src/assets/app.css` right
  now. Editing either one would conflict with it.
- `src/layouts/Layout.astro` — the `<head>` holds an `is:inline` MailerLite loader with
  a `window.__mlWatcher` guard. Copy that shape for the look-restore script.
- `src/components/CommandBar.astro:76` — `observer = undefined;`, the redundant line to
  delete.
- `scripts/visual/layout.mjs` and `scripts/visual/pixc.mjs` — the owner's layout and
  contrast checks. `layout.mjs:73` finds the hero Sign Up by `#hero-signup`.
- `public/fonts/` and `public/fonts/OFL.txt` — self-hosted fonts and their licence file.
- `src/lib/format.test.ts` — the Vitest style to copy for the matcher test.

## Approach

### Files

| File                                                                    | Change                                                                                 |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/lib/konami.ts` (+ `konami.test.ts`)                                | New pure matcher                                                                       |
| `src/components/GoldBox.astro`                                          | New: H's markup, and a `<script>` for the trigger, tune, Exit, form move and menu keys |
| `src/assets/goldbox.css`                                                | New: H's CSS, imported by `GoldBox.astro` so only the homepage bundles it              |
| `src/pages/index.astro`                                                 | Render `<GoldBox funnel={funnel} />` right after `.home-f`                             |
| `src/layouts/Layout.astro`                                              | Add the inline look-restore script to `<head>`                                         |
| `public/fonts/vt323-latin.woff2`, `ibm-plex-mono-latin-{400,600}.woff2` | New self-hosted fonts; add their copyright lines to `OFL.txt`                          |
| `scripts/visual/layout.mjs`, `pixc.mjs`                                 | Add the optional `LOOK=h` variable                                                     |
| `src/components/CommandBar.astro`                                       | Delete line 76                                                                         |

### The matcher (the tested seam)

```ts
// src/lib/konami.ts
/** Feed it every keydown's `event.key`; it returns true only on the key that
 *  completes ↑ ↑ ↓ ↓ ← → ← → B A, then starts over. */
export function createKonami(): (key: string) => boolean;
```

- Keep the last ten keys, and compare them to
  `ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a`.
  Lower-case single-character keys first, so `B` and `A` count. Comparing a rolling
  window, rather than a progress counter, is what makes ↑ ↑ ↑ ↓ … match. A counter that
  resets on a wrong key misses that case.
- Clear the window after a match, so the next match needs all ten keys again.
- It knows nothing about the DOM, focus or modifier keys. Those checks belong to the
  listener.

### Look state (session-scoped)

- **Storage.** `sessionStorage['oz-look'] = 'h'` while H is on; the key is absent
  otherwise. It lasts across reloads and in-site navigation in the same tab. A new tab
  or a new visit starts in F, as the owner asked.
- **The attribute.** The DOM reads the state from one attribute:
  `<html data-look="h">`. All show and hide CSS keys off it.
- **The restore script.** It is an `is:inline` script in `Layout.astro`'s `<head>`,
  placed before the stylesheet links so it runs before first paint:
  - `applyLook()` sets `document.documentElement.dataset.look = 'h'` when storage says
    so;
  - it runs once immediately;
  - it also runs on every `astro:after-swap`, because view transitions replace
    `<html>`'s attributes with the incoming page's;
  - a `window.__lookWatcher` guard registers the listener only once, as the MailerLite
    loader does;
  - `try`/`catch` wraps the storage access, since blocked storage throws. The page then
    stays F.
- **Inner pages.** They carry the attribute too, but no H CSS exists there, so they
  render F. H covers the homepage only.
- **Duplicated key names.** The inline script can't import modules, so `'oz-look'` and
  `'h'` appear there and in `GoldBox.astro`. Put a comment at each place naming the
  other.

### Showing and hiding (CSS only)

`GoldBox.astro` renders `<div class="home-h">` on every homepage build. `goldbox.css`
holds these rules:

```css
.home-h {
  display: none;
}
html[data-look='h'] .home-h {
  display: block;
}
html[data-look='h'] .home-f,
html[data-look='h'] body:has(.home-h) > :is(header, footer) {
  display: none;
}
```

- **Why always render H.** H is always in the HTML and CSS picks which look shows. A
  reload in H therefore paints H first, with no flash of F and no empty frame before a
  script mounts H.
- **No extra downloads.** Every `<img>` in H has `loading="lazy"`, so nothing downloads
  while it's hidden. Its fonts load only when H text renders.
- **One set of IDs.** Every `id` in H takes an `h-` prefix, such as `h-games`, `h-faq`,
  `h-register` and `h-hero-signup`, because F's copies stay in the DOM. When H renders
  a funnel `href` that starts with `#` (`#register` off-season), it rewrites the href to
  `#h-…`.
- **Search and assistive tech.** `display: none` hides H from screen readers while it's
  off. The FAQ and Event JSON-LD come only from F's components, so the page emits each
  schema once.
- **Page-wide tokens.** Scope the goldbox tokens, the `body` font and background, and
  `scroll-padding` to `html[data-look='h']:has(.home-h)`. That covers the whole page
  while H is on, including the moved MailerLite form, and never leaks to F or to inner
  pages. The selector's specificity (0,2,1) beats CommandBar's `html:has(#cmdbar)`
  scroll padding (0,1,1); keep that margin.
- **Light and dark.** The site has no `data-theme` attribute; dark mode is
  `prefers-color-scheme`. Rewrite the prototype's `[data-theme='dark']` rules as
  `@media (prefers-color-scheme: dark)` blocks, and drop every `[data-palette]` qualifier
  and non-goldbox palette.
- **Fonts.** Declare `@font-face` for VT323 and IBM Plex Mono (400 and 600) with
  `font-display: swap`, pointing at `/fonts/…`. Drop the Google Fonts `<link>`s. Get
  the files from Fontsource:
  - `https://cdn.jsdelivr.net/fontsource/fonts/vt323@latest/latin-400-normal.woff2`
  - `https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-{400,600}-normal.woff2`

### H's markup (`GoldBox.astro`, props `{ funnel: HomeFunnel }`)

Follow the prototype's `index.html` structure and class names. Change these parts:

- **Menubar.**
  - `ADL OSR - OZ ORC` stays the home link.
  - The Attend and GM's menus carry Navbar's links and conditions. A comment at each
    list says it mirrors the other.
  - Add a `<button type="button" data-look-exit>` labelled `Exit` after the menus. Style
    it as a menubar item and underline the E as a hotkey (`.hot`).
- **Hero window.**
  - The logo is an `<img>` with the cover logo's `srcset`
    (`/images/OZORC_Dungeon-{500w,800w}.webp`, `/images/OZORC_Dungeon.webp`),
    `sizes="(max-width: 600px) 220px, 420px"` and `alt="OZ ORC"`. Don't use the
    prototype's mask logo: it loads the 226 KB SVG.
  - The webp has alpha. For dark mode, give it a CSS `filter` so the black line art
    reads on the dark window (`invert(1)` at least; a tint toward `#ffd24a` is
    optional).
  - `h1` = `OZ ORC: {funnel.title}`.
  - Build the facts from `funnel.stats` and `funnel.venue`:
    - Date: `stats[0].spoken ?? ${big} ${small.join(' ')}`;
    - Venue: `funnel.venue`;
    - Tickets: `Tickets: ${stats[1].big} ${stats[1].small[0]}`.
  - The lead paragraphs are `funnel.lead`.
- **MAIN MENU.**
  - The primary item `id="h-hero-signup"` shows `funnel.primary.label` and has
    `target="_blank" rel="noopener noreferrer"` only when `primary.external` is true.
  - Then Join Discord (`funnel.discord`) and Follow on Facebook (`funnel.facebook`), both
    external.
  - Then `funnel.gmLink` when it exists.
- **Section order.** It follows `index.astro`'s state branches: with a `currentEvent`,
  the roster (`hasGames`) or the GMs Wanted window, then the mailing dialog. Off-season,
  the dialog comes before GMs Wanted. After those come About, What to Expect, What
  Attendees Say and the FAQ, as in the prototype.
- **Roster.** One `.sheet` per `currentEvent.games` entry. The stats are System, Level
  (when set) and GM (when set). The button is "Sign Up on Warhorn" to `game.warhornUrl`,
  external.
- **Mailing dialog** `id="h-register"`. It has the titlebar, the info message "Hear first
  when dates and games are announced.", and an empty `<div data-ml-slot>`. The live
  form moves into that slot (next section). Drop the prototype's fake `<form>`.
- **FAQ help log.** One `<details name="h-faq">` per `homeFaqs(...)` entry, with the same
  arguments as `FAQ.astro`. The first one is open. Answers render through `RichText`.
- **Static prose.** About, What to Expect, the quote and GMs Wanted copy their text from
  the F components named in the Code Map, keeping the same `currentEvent` branches. Mark
  the duplication in the component's frontmatter:
  `// lazy: prose copied from About/WhatToBring/Testimonials/CallForGames. ceiling: F and H drift when copy changes. upgrade: move the prose into src/data/ if it's edited twice.`
- **Status bar and command bar.**
  - The status bar has site socials with the `?raw` icons, `site.email`, and
    `© {year} OZ ORC`.
  - The command bar holds the SIGN UP, GAMES (only when `hasGames`), FAQ and RUN A GAME
    links, with `#h-` anchors.
  - Keep the command bar as the **last child of `.home-h`**, after the status bar. It is
    `position: sticky`, so it parks under the status bar at the end of the page. Moving
    it earlier lets it cover the footer.

### The script in `GoldBox.astro`

It is a bundled `<script>`, so it runs once per full page load. It registers
`document`-level listeners only, so they keep working across view-transition swaps.

- **keydown.** Skip the key in any of these cases:
  - `e.repeat` is set;
  - `e.ctrlKey`, `e.altKey` or `e.metaKey` is held;
  - `e.key` is `Shift` or `CapsLock`;
  - the target is an `input`, `textarea` or `select`, or is `isContentEditable`.

  Otherwise feed `e.key` to one `createKonami()` matcher. On a match, do nothing when
  there is no `.home-h` in the document (an inner page) or when `data-look` is already
  `h`. Otherwise, **in this order**:
  1. play the tune (see below);
  2. set storage and `data-look`;
  3. move the form into H;
  4. `scrollTo(0, 0)`;
  5. focus `#h-hero-signup`.

  Don't call `preventDefault` on any key, so the arrow keys still scroll.

- **Exit.** Use a delegated `click` on `[data-look-exit]`. It removes the storage key,
  deletes `data-look`, moves the form back, scrolls to the top, and focuses F's
  `#hero-signup`.
- **Restore.** On `astro:page-load`, when `data-look` is `h` and `.home-h` exists, move
  the form into H. This covers reloads and returns to the homepage.
- **Moving the form.** `document.querySelector('.ml-embedded')` moves into
  `[data-ml-slot]`. Moving it back puts it at the end of F's `#register` `.record`,
  where it sat. Move the element itself; never clone it. MailerLite's loader
  (`Layout.astro`) renders into the first `.ml-embedded` it finds, so the page must
  only ever have one.
- **The tune.**
  - Keep one module-level `AudioContext`. Create it (`ctx ??= new AudioContext()`) and
    call `ctx.resume()` **inside the keydown handler that completed the code**. Browsers
    allow audio only from a user gesture.
  - Play square-wave notes C5 523.25, E5 659.25, G5 783.99 for 0.08 s each, then C6
    1046.5 for 0.3 s. That is 0.54 s in all.
  - Route them through one `GainNode`: ramp up to 0.05 over 5 ms, then down with
    `exponentialRampToValueAtTime(0.0001, end)`. Stop the oscillators at `end`.
  - The tune plays on every trigger, even under reduced motion, as the owner asked. It
    never plays on restore or Exit.
- **Lifted as-is.** The prototype's MAIN MENU arrow-key cursor and the menubar rule that
  closes other dropdowns on an outside click. Scope their queries to `.home-h`.

### Visual checks under H

- `layout.mjs` and `pixc.mjs` read `process.env.LOOK`. When it is `h`, run
  `context.addInitScript(() => sessionStorage.setItem('oz-look', 'h'))` before
  `page.goto`.
- `layout.mjs` looks up `h-hero-signup` instead of `hero-signup` when `LOOK=h`.
- Add one usage line to each script's header comment. Change nothing else in them.

## Assumptions

- The Konami code works only on the homepage. On inner pages it does nothing, since
  there is no H there to show.
- "Desktop only" needs no code. The trigger is a keyboard sequence, so phones never fire
  it. Tablets with keyboards may.
- The live MailerLite form moves into H's dialog. It keeps its own styling (another
  slice restyles it) under goldbox tokens. `pixc.mjs` decides whether that passes.
- H's static prose is copied from F's components, not extracted into `src/data/`. This
  is marked with a `lazy:` comment.
- Exit and the trigger both scroll to the top and move focus to the new look's primary
  Sign Up, so keyboard and screen-reader users land somewhere meaningful.
- After Exit, entering the code again brings H back and plays the tune again.
- Only the `goldbox` palette ships. There is no palette switcher.

## Out of scope

- H on inner pages. If the owner wants H to cover the whole site, that is its own slice.
- Deleting `prototypes/` (the design doc's Retirement step). **Follow-up once this lands**:
  - delete `prototypes/`;
  - remove `prototypes` from `.prettierignore` and `eslint.config.js`.

  H's source must stay until this slice has merged.

- Any edit to `RegisterInterest.astro` or `src/assets/app.css`. They belong to the
  concurrent MailerLite slice.
- Changing `homeFunnel`, `homeFaqs` or the F components.
- Rewording CommandBar's "Slice 2 may remove either element" comment. The owner asked
  only for the one-line deletion.

## Phase 1 — Build the egg

1. Delete `src/components/CommandBar.astro:76` (`observer = undefined;`).
2. Write `src/lib/konami.ts` test-first.
3. Download the three fonts into `public/fonts/`, and append the VT323 and IBM Plex Mono
   copyright lines to `OFL.txt`.
4. Build `GoldBox.astro` and `goldbox.css` from the prototype, as Approach describes,
   and render it in `index.astro`.
5. Add the restore script to `Layout.astro`'s `<head>`.
6. Add `LOOK=h` to both visual scripts.
7. Run the checks below. Fix H's CSS until they pass in all three funnel states.

**Tests**

- The matcher returns true only on the completing key — observed at
  `src/lib/konami.ts:createKonami`.
- Worked example: `ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a`
  → `false` ×9, then `true`.
- Worked example: `ArrowUp ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight B A`
  (an extra ↑, capitals) → `true` on the final `A` only.
- Worked example: the ten keys with `x` between `b` and `a` → never `true`.
- Worked example: a full sequence, then `a` → `false`. A second full sequence then
  returns `true` on its `a`.

**Done when**

Set up the preview server, then run the checks:

1. `ln -s /home/riley/dev/adl-osr-website/node_modules node_modules`, if it isn't
   linked yet.
2. `npm run build && npm run preview`. The preview serves `http://localhost:4321`.

- [x] `npm test` passes.
- [x] `npm run lint` and `npm run format:check` pass.
- [x] `npm run build` succeeds.
- [x] `node scripts/visual/layout.mjs http://localhost:4321` passes, so F is unchanged.
- [x] `LOOK=h node scripts/visual/layout.mjs http://localhost:4321` passes: no sideways
      scroll at 320, and H's Sign Up, Discord and Facebook are on the first screen at
      390×844, in both schemes.
- [x] `LOOK=h node scripts/visual/pixc.mjs http://localhost:4321/ <w> <mode>` passes for
      each w in 320, 390 and 1280 and each mode in light and dark.
- [x] The layout and contrast checks under `LOOK=h` pass in all three funnel states:
      registration open (today's data), announced but not open (set `warhornUrl` to
      `undefined` on the current event), and off-season (make `currentEvent`
      `undefined`). Make the data changes temporarily in `src/data/events.ts`, and
      revert them before stopping. The long labels "Register Your Interest" and "Join
      the Mailing List" are the likeliest to break 320px.
- [x] Delete the `node_modules` symlink before stopping.

## Manual verification

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

## Implementer notes

- Work in this worktree only. The main checkout
  (`/home/riley/dev/adl-osr-website`) is busy with the MailerLite slice; only read
  the prototype from it.
- For any ad-hoc Playwright script, import
  `/home/riley/.npm/_npx/86170c4cd1c5da32/node_modules/playwright/index.mjs` and launch
  with `executablePath: '/usr/bin/chromium'`, as `scripts/visual/*.mjs` do.
