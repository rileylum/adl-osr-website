# OZ ORC Website

The official website for OZ ORC - Adelaide's premier old-school D&D and OSR gaming convention.

## For Developers

### Tech Stack

- **Framework**: Astro 5.1.3
- **Styling**: TailwindCSS + DaisyUI
- **Carousel**: Swiper.js 12.0.3
- **TypeScript**: For type safety and better DX
- **Image Optimization**: WebP format with responsive images

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

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run lint` | Lint code with ESLint |
| `npm run lint:fix` | Fix linting issues |

### Project Structure

```
src/
├── assets/          # SVG icons and static assets
├── components/      # Reusable Astro components
│   ├── schemas/     # SEO schema components
│   ├── Hero.astro
│   ├── FeaturedGames.astro
│   ├── Testimonials.astro
│   └── ...
├── data/            # Content data files
│   └── games.ts     # Featured games data
├── layouts/         # Page layouts
│   └── Layout.astro
├── pages/           # Routes (file-based routing)
│   ├── index.astro
│   ├── schedule.astro
│   └── ...
└── assets/
    └── app.css      # Global styles

public/
└── images/          # Static images
    ├── games/       # Game cover art (16:9 WebP)
    └── gallery/     # Event photos

scripts/
├── import-warhorn.ts              # Import games from Warhorn API
└── optimize-game-images.js        # Optimize game images to WebP
```

### Key Technical Notes

- **View Transitions**: Astro's View Transitions API is enabled for smooth page navigation
- **SEO**: Comprehensive meta tags, Open Graph, and JSON-LD schema
- **Performance**: All images are WebP format with responsive srcsets
- **Carousel**: Swiper carousel with loop mode disabled (13 slides insufficient for loop with slidesPerView: 2.5)

---

## For Content Contributors

You don't need to be a developer to update content! Most content is stored in easy-to-edit files.

### Adding or Editing Games

**File**: `src/data/games.ts`

Each game is an object in the `games` array:

```typescript
{
  title: "Game Title",
  system: "RPG System Name",
  level: "1-3",              // Optional
  image: "/images/games/game-image.webp",
  description: "Game description...",
  warhornUrl: "https://warhorn.net/...",
  gm: "GM Name",
  tags: ["Tag1", "Tag2"],    // Optional
}
```

**To add a new game:**
1. Add game image to `public/images/games/` (16:9 aspect ratio recommended)
2. Run `node scripts/optimize-game-images.js` to optimize the image
3. Add game object to the `games` array in `src/data/games.ts`

**Common tags:**
- "Dungeon Crawl"
- "Mystery/Investigation"
- "New Player Friendly"
- "Character Funnel"
- "Horror"
- "Wilderness"
- "Classic Module"

### Updating Event Information

**Date, Venue, Price**: Edit `src/components/Hero.astro`

Look for these lines:
```astro
<span>February 7th, 2026</span>
<span>Colonel Light Gardens RSL</span>
<span class="text-primary">Tickets: $15 AUD</span>
```

**Registration Links**: Search for `warhorn.net` URLs throughout the codebase and update them.

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
<div class="collapse-title text-xl font-medium">
  Your Question?
</div>
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
