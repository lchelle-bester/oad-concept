# OAD website concept

A concept redesign of the homepage for the IAU Office of Astronomy for Development (OAD), https://astro4dev.org/.
The goal is a high-quality homepage that shows the awe of astronomy and OAD's human impact, built while learning web development.

## About me and how to work with me

- I'm L'chelle, a first-year mechatronic engineering student and a science teacher. I know C, and I'm new to web development.
- **Teach me as we go.** Explain what you change and why, in plain language. Introduce new concepts one at a time.
- **I make the design decisions.** When there's a design choice, give me 2–3 clear options with trade-offs and let me choose. Don't decide for me.
- **Work in small steps.** One section or fix at a time. Don't rewrite files wholesale.
- **Respect my edits.** I edit files myself. Always read the current file before changing it.
- **Debug by elimination.** Confirm the cause of a bug before fixing it, and change one thing at a time.
- After each change, remind me to check it in Live Server and suggest a commit message.
- I'm on Windows, using VS Code, PowerShell, Live Server and Git.

## Tech setup

- Plain HTML, CSS and JavaScript for now. No framework, no build step.
- Preview with the Live Server extension. The project folder `C:\dev\oad-concept` must be the opened folder.
- Plan: move to Astro once there are repeating components (cards, testimonials), then host on Netlify via GitHub.

```
oad-concept/
├── index.html
├── css/styles.css        design tokens at the top, sections numbered in comments
├── js/main.js            navigation, then hero video
├── assets/images/        oad-symbol.png (orbit symbol cropped from the official dark-background logo)
├── assets/video/         milky-way.mp4, milky-way-poster.jpg
├── credits.md            source of every image and video
└── CLAUDE.md
```

## Design brief

**Concept: "From the sky to the ground."** The homepage scroll starts in the cosmos and ends with people. Awe that turns into belonging.

**Colour** (from the official OAD logo, all defined as CSS variables in `:root`):

| Token | Hex | Contrast on bg | Role |
|---|---|---|---|
| `--color-bg` | `#070818` | – | Night-sky background (black tinted towards the logo navy) |
| `--color-text` | `#FFFFFF` | 20:1 | Text |
| `--color-accent` | `#E4A818` | 9.4:1 | Amber. Main accent: buttons, key numbers, links |
| `--color-green` | `#54A030` | 6.1:1 | Small highlights, sparingly |
| `--color-purple` | `#846898` | 4.2:1 | Graphics and large text only |
| `--color-navy` | `#404470` | 2.2:1 | Glows and background shapes. Never text |

**Typography**
- Headlines: Space Grotesk (`--font-heading`), weight 600.
- Everything else: Outfit (`--font-main`), weights 300/400/600.
- Maximum two fonts. Only load weights that are used.

**Rules**
- Restraint: one idea per screen, minimal text, lots of space.
- Motion: gentle and purposeful only (fades, counters). If it doesn't help tell the story, it goes.
- Video in one place only: the hero. No second video.
- Real people and real stories in the lower half of the page.
- Accessibility: text contrast at least 4.5:1, semantic HTML, keyboard-usable, respect `prefers-reduced-motion`.
- Performance matters: OAD's audience is in 114 countries, many on slow or expensive mobile data. Test on a throttled connection.
- Test every change at desktop width and at 390px (phone).

**Brand constraints**
- The OAD logo must never be changed, recoloured or redrawn. Use the official files only.
- Thin orbit lines and dots borrowed from the logo may be used as a graphic motif (not yet used).

## Current state

**Header and navigation** (done)
- Transparent header over the hero. Logo links to `index.html` (not `/`, which broke under Live Server).
- All pages from the current site, links pointing to the live astro4dev.org pages for now:
  Our work (dropdown), Innovation Hub, Research Institute, Impact (dropdown), Regions (dropdown), About us (dropdown).
- Dropdowns are `<button>`s using `aria-expanded`. JS toggles the attribute; CSS shows the panel with `.submenu-toggle[aria-expanded="true"] + .submenu`. Escape and outside-click close them.
- At 1024px and below: full-screen menu with accordion submenus, Menu/Close button.

**Hero** (done)
- Left-aligned headline "Astronomy for a better world", text anchored bottom-left.
- Subheading: "Turning our knowledge of the universe into skills, inspiration and opportunities for people on Earth."
- Buttons: "Explore our work" (`#work`, target section not built yet) and "Apply for funding" (live CFP page).
- Background video: Milky Way core timelapse (Pexels clip 9341428), downscaled to 1080p, slowed to half speed with motion interpolation, seamless 3-second crossfade loop, 16 s, 4.4 MB (H.264, CRF 27). Poster is the loop's first frame.
- `js/main.js` only loads the video on screens wider than 720px, without reduced motion, and without data-saver. Otherwise the poster shows. It pauses when the hero is scrolled out of view.
- Overlay: top gradient behind the nav, radial darkening from the bottom-left behind the text (keeps the golden galactic core visible on the right), light bottom fade. `inset: -1px` avoids hairline gaps with Windows display scaling.

## Decisions log

- Left-aligned hero, not centred (keeps the galactic core visible).
- Space Grotesk for headlines over Outfit.
- Pause button removed (my choice). Note: WCAG asks for a pause control on motion over 5 s; reduced-motion users already get the still image.
- Build with code (and Claude), not Framer.
- No `backdrop-filter` over the video: it made the video shake when dropdowns opened. Dropdown panels use a solid `rgba(12, 13, 34, 0.97)` background instead.

## Known gotchas

- Removing HTML that JS depends on breaks the JS silently. Check the browser Console (F12) for errors.
- Chrome effects that blur or blend over playing video can cause jitter on Windows.
- Headless browsers may not play H.264; test video playback in real Chrome.

## Homepage plan (next sections)

1. Hero (done)
2. **Mission** — one sentence on dark space. Open decision: transition from the video (hard edge, fade, or overlap).
3. **15 years** — OAD launched 16 April 2011 at the South African Astronomical Observatory in Cape Town. Headline numbers from the 2025/26 annual report: 254 projects, 114 countries, more than €1.5 million granted. Always use the newest official figures, and keep numbers in one place so they're easy to update.
4. **Three flagships** — Astrotourism, Astronomy for mental health, Astro 4 Skills. This section gets `id="work"`.
5. **Stories** — real people and quotes from the annual report. Get OAD's confirmation of consent before using named people or photos. The page warms towards amber here.
6. **What's next** — Innovation Hub and Research Institute.
7. **Get involved** — apply, partner, subscribe.
8. **Footer** — full official logo, links, media credits.

## Later ideas

- Interactive impact map like charity: water's, based on the impact map on the current OAD site.
- Proper mobile menu polish, footer, other pages.
- Optional: WebM/AV1 video versions, a separate richer poster frame for phones.
- Move to Astro, put on GitHub, deploy to Netlify.
