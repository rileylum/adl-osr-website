# Restyle the MailerLite signup form in option F's look

MailerLite still draws the homepage signup form in its own style: grey panel, rounded
corners, Open Sans and a black button. Pure `#ff0000` error text fails 4.5:1 on cream
(3.65:1). Once this lands, the form's fields, consent row, button, and error and success
states wear F's tokens, type, square corners and rules in both modes. MailerLite still
owns validation, reCAPTCHA, double opt-in and the success message.

Branch: `feat/mailerlite-form-f-look`

## Code Map

- `src/components/RegisterInterest.astro` — the embed (`<div class="ml-embedded"
data-form="B6FVva">`) inside F's `.record` frame. Its `<style is:global>` block already
  holds the `.ml-embedded label.checkbox` fix for daisyUI. Keep that fix. The new
  overrides go in the same global block.
- `src/layouts/Layout.astro:52-100` — the MailerLite loader. It re-renders the form on
  `astro:page-load`. **Do not touch it.**
- `src/assets/app.css:14-104` — the two theme blocks. Add the new error-ink token next
  to "F's roles that daisyUI has no name for". The other tokens used here are
  `--color-base-100`, `--color-base-content`, `--color-muted`, `--color-rule`,
  `--color-link`, `--color-primary`, `--color-primary-content`, `--color-focus`,
  `--border`, `--font-sans` and `--font-display`.
- `src/assets/app.css` `@utility label-caps` (and `.btn` in `@layer utilities`) — the
  button type to copy by hand. Its properties are Archivo, `font-variation-settings:
'wdth' 70`, weight 800, uppercase and `letter-spacing: 0.06em`. No component in this
  repo uses `@apply` or `@reference`, so write the properties out rather than adding
  that setup.
- `src/assets/app.css` `@utility title-card` — the heading style for MailerLite's `<h4>`:
  Anton, `--text-2xl`, weight 400.
- `scripts/visual/pixc.mjs` — the rendered-pixel contrast check. Its text-hiding step
  (the `page.addStyleTag` near the end) must change; see Approach §4.
- `scripts/visual/layout.mjs` — the 320px sideways-scroll check over every route.
- `scripts/visual/mlform.mjs` — **new**. It puts the form into its error or success
  state for both scripts.

## Approach

### 1. The rendered markup these rules depend on

This is what universal.js wrote into `.ml-embedded` on 2026-09-27. It is not an
iframe. Only the classes are shown:

```
.ml-embedded
  div#mlb2-43333054.ml-form-embedContainer.ml-subscribe-form.ml-subscribe-form-43333054
    .ml-form-align-center > .ml-form-embedWrapper.embedForm
      .ml-form-embedBody.row-form
        .ml-form-embedContent > h4, p                      ← MailerLite's own heading + intro
        form.ml-block-form
          .ml-form-formContent > .ml-form-fieldRow > .ml-field-group.ml-field-email
              > input.form-control[type=email]              ← gets aria-invalid="true" on error
          .ml-form-embedPermissions > .ml-form-embedPermissionsContent > p
          .ml-form-checkboxRow.ml-validate-required
              > label.checkbox > input[type=checkbox] + .label-description > p
          .ml-form-embedSubmit > button.primary[type=submit]
                               + button.loading (spinner .ml-form-embedSubmitLoad)
      .ml-form-successBody.row-success (display:none until success)
        .ml-form-successContent > h4, p (contains a bare Discord URL link)
```

The error state is MailerLite adding `.ml-error` to `.ml-field-group` and to
`.ml-form-checkboxRow`. MailerLite shows no message text: the error is signalled by
colour alone. There is no reCAPTCHA in the DOM before submit.

Write this outline, shortened, into the code comment above the overrides. The comment
must also say what breaks if MailerLite renames these classes (the form falls back to
MailerLite's look) and which check catches it (Phase 1's pixc/layout runs, at build
time only).

### 2. How the overrides win: a cascade layer, not the ID

MailerLite's styles are unlayered and scoped by `#mlb2-43333054`, which is a generated
ID. Many of them are `!important`. A class-only selector cannot out-specify an ID. Put
every override inside **`@layer mailerlite-embed { … }`** and mark **every
declaration `!important`**:

- A layered `!important` beats an unlayered `!important` whatever the specificity.
  This was verified in Chromium: `@layer probe { .ml-embedded .ml-form-embedSubmit
button { background-color: … !important } }` beat MailerLite's
  `#mlb2-… button { background-color: #000 !important }`.
- A layered _normal_ declaration loses to MailerLite's unlayered normal ones, so
  leaving out `!important` on a property MailerLite also sets makes that line do
  nothing. That is why every declaration carries it.
- Anchor every selector on `.ml-embedded` plus MailerLite's `ml-form-*` class names.
  Never use `#mlb2-…`.

Say this in the code comment too. A later reader will otherwise "tidy away" either
the layer or the `!important`s.

### 3. The look, rule by rule

Every colour is a token, so dark mode follows automatically. No `@media
(prefers-color-scheme)` is needed.

| Target                                                   | Style                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.ml-form-embedWrapper`                                  | Transparent background, no border, radius 0, padding 0, `display: block`, `width: 100%`, `max-width: none` (MailerLite caps it at 400px). The `.record` frame is already the panel.                                                                                                                                                                          |
| `.ml-form-embedBody`, `.ml-form-successBody`             | Padding 0.                                                                                                                                                                                                                                                                                                                                                   |
| `.ml-form-embedContent h4`, `.ml-form-successContent h4` | `title-card` type (Anton, `--text-2xl`, weight 400), `--color-base-content`, `text-transform: none`.                                                                                                                                                                                                                                                         |
| `.ml-form-embedContent p`, `.ml-form-successContent p`   | Archivo, `1.0625rem`/1.6 (the body size), `--color-base-content`. Add `overflow-wrap: anywhere` so the bare Discord URL wraps at 320px.                                                                                                                                                                                                                      |
| `.ml-form-successContent a`                              | `--color-link`, underline 2px, offset 3px (as the base `a` rule).                                                                                                                                                                                                                                                                                            |
| Email `input`                                            | Background `--color-base-100`, text `--color-base-content`, `var(--border) solid var(--color-rule)`, radius 0, Archivo `1.0625rem` (at 16px or more, iOS doesn't zoom), comfortable padding (~0.7rem 0.8rem). Placeholder colour `--color-muted`. `:focus-visible` gets the site's ring: `3px solid var(--color-focus)`, offset 3px.                         |
| `.ml-form-embedPermissionsContent p`                     | Archivo `0.9375rem`, `--color-muted`.                                                                                                                                                                                                                                                                                                                        |
| `.ml-form-checkboxRow .label-description p`              | Archivo `0.9375rem`, `--color-base-content`.                                                                                                                                                                                                                                                                                                                 |
| `.label-description::before` (the drawn box)             | Square (radius 0), about `1.1rem`, `2px solid var(--color-rule)`, background `--color-base-100`. Adjust the label's `padding-left` and the pseudo's `left`/`top` so the box sits on the first text line.                                                                                                                                                     |
| `input:checked ~ .label-description::before` / `::after` | Box background `--color-primary`. Replace the tick with the same data-URI SVG but `fill='%2322170e'`: MailerLite's white tick vanishes on yellow. The dark tick on yellow works in both modes.                                                                                                                                                               |
| `input:focus-visible ~ .label-description::before`       | The focus ring (`3px solid var(--color-focus)`). The real checkbox has `opacity: 0`, so without this rule the keyboard focus is invisible.                                                                                                                                                                                                                   |
| `button.primary`                                         | Match the site's `.btn.btn-primary.btn-lg` as rendered: background `--color-primary`, text `--color-primary-content`, `var(--border) solid var(--color-primary)`, radius 0, no shadow, label-caps type at `1.125rem`, min-height 3rem, full width. Hover: the colour the site's `.btn-primary:hover` computes to (read it in the browser; don't invent one). |
| `button.loading` and `.ml-form-embedSubmitLoad::after`   | The same box as `button.primary`. Spinner border `--color-primary-content` with the fourth side transparent: MailerLite's white spinner vanishes on yellow.                                                                                                                                                                                                  |
| `.ml-error input`                                        | Border colour `--color-error-ink`, plus `box-shadow: inset 0 0 0 2px var(--color-error-ink)`. The thicker rule is a cue that doesn't rely on hue alone.                                                                                                                                                                                                      |
| `.ml-error .label-description p`                         | `--color-error-ink`.                                                                                                                                                                                                                                                                                                                                         |
| `.ml-error .label-description::before`                   | Border `--color-error-ink`, width `var(--border)`.                                                                                                                                                                                                                                                                                                           |

### 4. New token: `--color-error-ink`

F has no role for error text, and daisyUI's `--color-error` (a pink) fails on cream.
Add the token to both theme blocks, in the "F's roles" group:

| Mode  | Value     | On `--surface-raised` | On `--color-base-100` |
| ----- | --------- | --------------------- | --------------------- |
| light | `#9b1c10` | 7.46:1                | 6.84:1                |
| dark  | `#ff8a70` | 7.45:1                | 8.13:1                |

These ratios were computed by hand with pixc's luminance formula.

### 5. Checking the error and success states without a real submit

`scripts/visual/mlform.mjs` exports one function:

```js
// Puts the MailerLite form on `page` into `state`, never sending a subscription.
// state: 'error' | 'success'
export async function setFormState(page, state) { … }
```

- It first calls `page.route(/mailerlite\.com\/.*subscribe/, (r) => r.abort())`. This
  is the safety net: a real subscribe request can never leave the browser, even if
  validation passes by accident. **Do not widen the pattern to `jsonp`.** The form
  itself loads from `…/jsonp/…/forms/B6FVva`, and blocking that stops it rendering.
- It waits for `.ml-embedded button.primary` to exist.
- `'error'`: click `.ml-embedded button.primary` on the empty form. MailerLite's
  validator adds `.ml-error` to the email group and the consent row, and nothing is
  posted. This was verified: zero subscribe requests. Don't type an invalid address:
  `type=email` then raises the browser's own validation bubble on top of the form.
- `'success'`: call MailerLite's own `window.ml_webform_success_<id>()`. Find it with
  `Object.keys(window).find((k) => k.startsWith('ml_webform_success_'))`. It shows
  `.row-success` and hides `.row-form`, which is exactly what a successful submit does
  (verified). If the function is missing, throw: the page's embed has changed, and a
  silent pass would hide that.

It has two callers:

- **pixc.mjs** takes an optional fourth argument, `[error|success]`. After the
  existing `goto` and its 600ms wait, and before measuring, call
  `setFormState(page, state)` when the argument is given. Update the usage line.
- **layout.mjs**: in each scheme, after the route loop, open `/` at 320×844 once per
  state, call `setFormState`, and apply the same `scrollWidth === 320` test. Print
  lines in the existing `ok  `/`FAIL` format with the state in them.

### 6. pixc's text-hiding step must move into a first cascade layer

pixc hides text with an unlayered `* { color: transparent !important; … }`. The new
layered `!important` overrides beat that rule, so the form's text would stay painted in
the screenshot. The background samples would then include glyph pixels, and the
measured contrast would be wrong. Change the step to **prepend** a `<style>` element to
`<head>` whose content is the same declarations wrapped in `@layer pixc-hide { … }`.
Among `!important` declarations the earliest-declared layer wins, and a prepended
layer is declared before Tailwind's and ours. This was verified: with the layered form
rule present, the unlayered hide left the button text coloured, and the prepended layer
made it transparent. Update the comment above the step to give this reason in place of
the current one.

## Assumptions

- **Keep MailerLite's own heading and intro, and restyle them.** Hiding them would
  leave the form's copy half on our site and half in the dashboard. The intro is stale:
  it reads "Oz ORC is back in February 2026". Fixing that is a dashboard edit for the
  owner, flagged in Manual verification.
- **The error token is new** (`--color-error-ink`), not a reuse of `--color-link`. In
  dark mode the link is yellow, and yellow doesn't read as an error.
- **The loading button matches the submit button.** It shows only while a request is in
  flight, and the checks never send one.
- **No registration-open flip is needed.** `src/pages/index.astro` renders
  `<RegisterInterest />` in both branches.
- **reCAPTCHA is out of our reach.** It is a Google iframe that appears only on some
  submits, and CSS can't style inside it.

## Out of scope

- Editing the form in the MailerLite dashboard: its copy, fields, or success message.
- Blocking MailerLite's Open Sans / font CSS downloads. Once restyled they go unused,
  but stopping them means touching the loader.
- Measuring the input's typed value and placeholder in pixc. pixc walks DOM text nodes,
  and input values aren't text nodes. Their pairs are known tokens (`base-content` on
  `base-100` for the value; `muted` on `base-100`, 7.45:1, for the placeholder).
- The popup/promotion forms MailerLite can inject (`renderPopupsAndPromotions`).
- Any change to `Layout.astro`'s loader.

## Phase 1 — Restyle, and teach the checks the form's states

1. Add `--color-error-ink` to both theme blocks in `app.css`.
2. In `RegisterInterest.astro`'s global style, below the existing `label.checkbox`
   fix, add the dependency comment (§1, §2) and the `@layer mailerlite-embed` block
   (§3). Also update the frontmatter comment. It says universal.js "owns its styling",
   which is no longer true: MailerLite owns behaviour and copy, and this file owns the
   look.
3. Write `scripts/visual/mlform.mjs` (§5).
4. Change pixc's hiding step (§6) and add its state argument (§5).
5. Add the per-state 320px check to `layout.mjs` (§5).

**Tests**

This repo has no unit seam for CSS. The observable checks are the visual scripts
against a built preview, run in Done when. What each run must show:

- The default, error and success states each pass pixc at 320 and 1280 in both modes.
  The button, consent text, permissions text, headings and success link are all
  measured.
- Error state, light: the consent text is `#9b1c10` on `#fbf4e3`, 7.46:1 by hand. pixc
  should report about that value, well above 4.5. A result near 3.65 means MailerLite's
  `#ff0000` is still winning.
- Success state at 320px: `scrollWidth` is 320 in both modes, despite the bare Discord
  URL.
- No run makes a subscribe request. The route abort in `setFormState` guarantees this;
  don't remove it to "see a real success".

**Done when**

Start with `npx astro build && npx astro preview`, then run against its URL:

- [x] `node scripts/visual/layout.mjs <url>` exits 0, including the new error and
      success lines.
- [ ] For each of `light` and `dark`, at widths `320` and `1280`:
      `node scripts/visual/pixc.mjs <url>/ <w> <mode>`, then the same with `error`, then
      with `success`. All 12 runs exit 0.
- [x] Sanity check that pixc sees the form: temporarily set `--color-error-ink` to
      `#ff0000` in light, rerun `pixc … 320 light error`, and confirm it fails on the
      consent line. Revert.
- [x] In the browser, `getComputedStyle` of `.ml-embedded button.primary` shows
      `rgb(245, 191, 31)` background and `0px` border-radius. This confirms the layer
      survived Astro's build.
- [ ] `npm run lint`, `npm run format:check` and `npm test` pass. None of them runs on
      a hook or in CI in this repo.

## Manual verification

- [ ] At 1280 and 390, in each mode, the form reads as part of the record sheet:
      square fields with rules, the yellow label-caps button, no grey panel, no
      rounded corners, no Open Sans.
- [ ] Keyboard: Tab reaches the email field and then the consent checkbox, and both
      show the focus ring. Space toggles the box, and the tick is visible.
- [ ] Error state (empty submit): the email field's rule thickens in error ink, and
      the consent text and box turn error ink.
- [ ] Navigate `/` → `/gm-info` → back. The form re-renders, and it is still restyled.
- [ ] **For the owner:** MailerLite's intro still says "Oz ORC is back in February
      2026". Edit it in the MailerLite dashboard (form B6FVva).

## Implementer notes

- **Never submit the real form.** A real submit adds a subscriber and sends a
  double-opt-in email. Use only `setFormState`, whose route abort is the guard. When
  checking by hand, use the empty-form submit only.
- **Playwright.** Import
  `/home/riley/.npm/_npx/86170c4cd1c5da32/node_modules/playwright/index.mjs` and launch
  with `executablePath: '/usr/bin/chromium'`, as the existing scripts do.
- The MailerLite form needs network access to render. Offline, every state check fails
  at "waits for `button.primary`".
