# OZ ORC Website

The official website for OZ ORC - Adelaide's premier old-school D&D and OSR gaming convention.

## For Developers

### Tech Stack

- **Framework**: Astro 5 (static output — no SSR adapter)
- **Styling**: TailwindCSS 4 + DaisyUI 5
- **Carousel**: Swiper.js 12
- **TypeScript**: For type safety and better DX
- **Testing**: Vitest (pure helpers only — `.astro` components are not unit-tested)
- **Image Optimization**: WebP format with responsive images

> **Start here:** `docs/agent/CONTEXT.md` is the domain glossary (Event, Venue,
> Agenda, Session, `currentEvent`, Game, GameCard). Event content is data-driven
> — read it before changing event facts.

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run development server**

   ```bash
   npm run dev
   ```

   Site will be available at `http://localhost:4321`

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```
   Preview will be available at `http://localhost:4322`

### Development Commands

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start dev server at localhost:4321 |
| `npm run build`        | Build production site to `./dist/` |
| `npm run preview`      | Preview production build locally   |
| `npm run format`       | Format code with Prettier          |
| `npm run format:check` | Check code formatting              |
| `npm run lint`         | Lint code with ESLint              |
| `npm run lint:fix`     | Fix linting issues                 |
| `npm test`             | Run unit tests (Vitest)            |
| `npm run test:watch`   | Run unit tests in watch mode       |
| `npm run astro check`  | Type-check `.astro` files          |

### Project Structure

```
src/
├── assets/          # SVG icons, app.css (global styles)
├── components/      # Reusable Astro components
│   ├── schemas/     # JSON-LD structured data (Event, Organization)
│   ├── GameCard.astro   # The one Game card (featured + compact variants)
│   ├── Hero.astro
│   ├── Schedule.astro
│   └── ...
├── data/            # The data layer — single source of truth
│   ├── site.ts      # Organization/global facts (URL, socials, email, brand)
│   ├── events.ts    # Event[] + selectors, guards; per-occurrence facts
│   └── games.ts     # Per-event game arrays + the Game type
├── lib/
│   └── format.ts    # Pure formatters (times, address) — unit-tested
├── layouts/         # Page layouts
│   └── Layout.astro
└── pages/           # Routes (file-based routing)
    ├── index.astro
    ├── schedule.astro
    └── ...

public/
└── images/          # Static images
    ├── games/       # Game cover art (16:9 WebP + -400w/-600w/-800w variants)
    └── gallery/     # Event photos
```

### How event content works

Event facts are **defined once** in the data layer and derived everywhere else —
there is no hardcoded date, venue, price, or URL in any component.

- `src/data/site.ts` owns facts shared across every event (site URL, socials, email).
- `src/data/events.ts` owns each occurrence: region, date, venue, price, Warhorn
  URL, agenda, and its games. Exactly one event per region is `status: 'current'`
  (a build guard enforces this); `currentEvent` is what components read.
- The site's state is **derived from the data**. An event with an empty
  `warhornUrl` and empty `games` renders the pre-launch "register interest / GMs
  wanted" state; filling both in flips the whole site to sign-up mode with no
  code change.

---

## Deployment

The site is a **static build** — no SSR adapter, no server runtime. Publishing is
"build, then serve `dist/`".

```bash
git pull
npm ci            # or `npm install` if you're not on a clean checkout
npm test          # guards + formatters — catches bad event/game data
npm run build     # outputs to ./dist/
```

`npm run build` writes the entire site to `./dist/`. Nothing else needs moving:
game images live in `public/` and are committed, so a `git pull` brings them and
the build copies them into `dist/`.

### Publishing `dist/` on the VPS

<!-- TODO: fill in the real docroot / server block for ozorc.com. -->

Two setups are possible; use whichever matches this server:

- **Docroot points directly at the repo's `dist/`** — then the build _is_ the
  deploy and there is nothing further to do.
- **Docroot is elsewhere** (e.g. `/var/www/ozorc.com`) — sync after building:

  ```bash
  rsync -a --delete dist/ /var/www/ozorc.com/
  ```

  The `--delete` matters: without it, pages and images removed since the last
  release linger and keep getting served.

### After publishing

- Hard-refresh and confirm the homepage shows the **current** event's date, venue
  and CTA (sign-up vs register-interest depends on `warhornUrl` / `games`).
- Check `/schedule` renders every session, and spot-check a game card image.
- `curl -s https://ozorc.com/sitemap-index.xml` to confirm the sitemap regenerated.

---

## For Content Contributors

You don't need to be a developer to update content! Most content is stored in easy-to-edit files.

### Adding or Editing Games

**File**: `src/data/games.ts`

Games live in a **per-event array** (e.g. `adelaideSep2026Games`), which the
Event references in `src/data/events.ts`. Add your game to the array for the
event it belongs to — not to a single global list.

```typescript
{
  title: "Game Title",
  system: "RPG System Name",
  level: "1-3",              // Optional
  image: "/images/games/game-image.webp",
  description: "Game description...",
  warhornUrl: "https://warhorn.net/.../schedule/sessions/<uuid>",  // full per-session URL
  gm: "GM Name",
  tags: ["Tag1", "Tag2"],    // Optional
  session: 1,                // Required — which agenda session it runs in
}
```

`session` must match a `sessionNumber` defined in that event's `agenda`. A
mismatch **fails the build** (rather than silently dropping the game from the
schedule), so if you add a game to a session that doesn't exist, add the agenda
row too.

**To add a new game:**

1. Add the cover art to `public/images/games/` as `<slug>.webp` (16:9).
2. Generate the responsive variants — `<slug>-400w.webp`, `-600w.webp`, and
   `-800w.webp` must all exist alongside it. `GameCard` builds its `srcset` from
   this naming convention, so a missing variant is a broken image.
   ⚠️ There is currently **no script for this** — `sharp` is available as a dev
   dependency, but the resizing is done by hand. (Worth automating.)
3. Add the game object to the right per-event array in `src/data/games.ts`.
4. Run `npm test` and `npm run build` to confirm the guards pass.

**Common tags:**

- "Dungeon Crawl"
- "Mystery/Investigation"
- "New Player Friendly"
- "Character Funnel"
- "Horror"
- "Wilderness"
- "Classic Module"

### Updating Event Information

**File**: `src/data/events.ts` — and nowhere else.

Date, venue, price, timezone offset, Warhorn URL, and the agenda are all defined
once on the Event. Editing them updates the hero, schedule, navbar, FAQ, SEO tags
and JSON-LD together. **Do not edit these values in components** — components
read `currentEvent`.

- **Date / venue / price**: edit the fields on the relevant Event object.
- **Registration link**: set `warhornUrl` on the Event (an empty string keeps the
  site in pre-launch "register interest" mode).
- **Schedule times**: edit the `agenda` rows. Times are canonical `"HH:MM"`
  24-hour strings; the timetable table, session headings, and JSON-LD start/end
  are all derived from them, so a time is never typed twice.

**Running a new event?** Add a new Event object, set its `status` to `'current'`,
and flip the previous one to `'past'` — exactly one event per region may be
`current` or the build fails.

### Adding Testimonials

**File**: `src/components/Testimonials.astro`

Add a new blockquote:

```astro
<blockquote class="bg-base-200 p-6 rounded-lg shadow-md">
  <p class="text-lg mb-4">"Quote text here..."</p>
  <cite class="text-sm opacity-70">— Person Name</cite>
</blockquote>
```

### Updating FAQ

**File**: `src/components/FAQ.astro`

Add a new question by copying an existing collapse block:

```astro
<input type="radio" name="faq-accordion" />
<div class="collapse-title text-xl font-medium">Your Question?</div>
<div class="collapse-content">
  <p>Your answer here.</p>
</div>
```

### Updating About Section

**File**: `src/components/About.astro`

Simply edit the paragraph text directly in this component.

### Adding Gallery Images

**Directory**: `public/images/gallery/`

1. Add images to this directory
2. Edit `src/components/Gallery.astro` to reference new images
3. Use WebP format for best performance

### Updating Code of Conduct

**File**: `src/components/CodeOfConduct.astro`

Edit the content directly in this file. The component is used on the `/code-of-conduct` page.

---

## Need Help?

- **Developers**: Check the Astro docs at https://docs.astro.build
- **Content Contributors**: Ask a developer to help with your first edit, or create an issue on GitHub
- **Questions**: Contact the OZ ORC team

## License

All rights reserved © 2025 OZ ORC
