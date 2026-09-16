# OAD website concept

A concept redesign of the homepage for the IAU Office of Astronomy for Development (OAD), https://astro4dev.org/.
The goal is a high-quality homepage that shows the awe of astronomy and OAD's human impact, built while learning web development.

## About me and how to work with me

- I'm L'chelle, a first-year electrical engineering student. I know C and java, and I'm new to web development.
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
├── js/main.js            navigation, hero video, then the impact counters
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
- One video only, in the shared "sky" layer behind the hero and the impact numbers. No second video.
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
- Buttons: "Explore our work" (temporarily to the live Projects funded page, `astro4dev.org/projects-search/`, until the flagships section with `id="work"` is built) and "Apply for funding" (live CFP page).
- Background video: Milky Way core timelapse (Pexels clip 9341428), downscaled to 1080p, slowed to half speed with motion interpolation, seamless 3-second crossfade loop, 16 s, 4.4 MB (H.264, CRF 27). Poster is the loop's first frame.
- `js/main.js` only loads the video on screens wider than 720px, without reduced motion, and without data-saver. Otherwise the poster shows. It pauses once the whole sky area is scrolled out of view.
- The video itself lives in the shared sky layer, not inside `.hero` (see below). `.hero` must not have its own `background-color`, or it paints over the sky.
- Overlay: top gradient behind the nav, radial darkening from the bottom-left behind the text (keeps the golden galactic core visible on the right), light bottom fade. `inset: -1px` avoids hairline gaps with Windows display scaling.

**Sky layer** (done)
- `.sky` wraps the hero and the impact section. Inside it: `.sky-media` (the video, `position: sticky`, `height: 100vh`), `.sky-fade` (gradient into `--color-bg` at the bottom), and `.sky-content` (the two sections, `margin-top: -100vh` to sit back over the pinned video).
- The sticky height and the negative margin must always match, or the hero starts in the wrong place.
- Layering: sky media `z-index: 0`, fade `1`, content `2`, header `10`, mobile menu `15`.

**Impact numbers** (done)
- `id="impact"`, directly after the hero, on the same sky. Heading: "15 years of astronomy for development", "15 years" in amber.
- Four numbers from the 2025/26 annual report: 254 projects funded, 114 countries, 2M+ people reached, €1.5M+ granted to projects. Four equal `1fr` columns, thin line above, 2 by 2 grid at 720px and below.
- The finished numbers are written in the HTML, and JS parses each one into prefix / number / suffix (`€1.5M+` → `€`, `1.5`, `M+`). To change a figure, edit the HTML only. `data-decimals="1"` just sets how many decimals show *while* counting.
- Counting: one `requestAnimationFrame` loop drives all four, 1.5 s, ease-out (`1 - (1 - t)³`), started by an `IntersectionObserver` watching the `.stats` row (not the whole section) with `rootMargin: '0px 0px -30% 0px'`, so it fires once the numbers are 70% of the way down the screen. It disconnects itself after the first run. (First version watched a third of the section, which fired while the numbers were still below the screen.) The last frame writes the original HTML text back, so `2M+` doesn't land as `2.0M+`. Skipped entirely under `prefers-reduced-motion`.
- `.impact-overlay` darkens the video from `rgba(7, 8, 24, 0.6)` to `0.86` — 0.6 at the top matches the hero overlay's bottom, so there's no seam. It uses `inset: 0`, not `-1px` (see gotchas).

## Decisions log

- Left-aligned hero, not centred (keeps the galactic core visible).
- Space Grotesk for headlines over Outfit.
- Pause button removed (my choice). Note: WCAG asks for a pause control on motion over 5 s; reduced-motion users already get the still image.
- Build with code (and Claude), not Framer.
- No `backdrop-filter` over the video: it made the video shake when dropdowns opened. Dropdown panels use a solid `rgba(12, 13, 34, 0.97)` background instead.
- The Mission section is cancelled. The impact numbers follow the hero directly: the hero gives the feeling, the numbers give the proof, fast.
- The sky continues behind the impact numbers rather than the hero ending on a hard edge, then fades into `--color-bg` so the next section starts on dark.
- `position: sticky` for the sky, not `position: fixed`: it pins and releases inside its own wrapper automatically, and it behaves on iOS.
- Numbers count up on first view only, ease-out over 1.5 s, all four together. Reduced-motion users get the final numbers straight away.
- Counting starts when the numbers row itself is well on screen, not when the section first appears, so you actually see it happen.
- Section content is left-aligned with a `max-width`, not centred, so headings line up with the hero text on wide screens.

## Known gotchas

- Removing HTML that JS depends on breaks the JS silently. Check the browser Console (F12) for errors.
- Chrome effects that blur or blend over playing video can cause jitter on Windows.
- Headless browsers may not play H.264; test video playback in real Chrome.
- If JS calls a method (e.g. `addEventListener`) on an element that's been removed from the HTML, it throws and silently stops every line after it in that block — including unrelated code further down. Found this when the pause-button element was deleted from HTML but its JS wasn't cleaned up, which quietly broke the scroll-pause behaviour too.
- `overflow: hidden` on any ancestor silently stops `position: sticky` working. Keep it off `.sky` (it lives on `.sky-media` instead). `body.menu-open` sets it too, but only while the mobile menu covers the screen.
- A solid `background-color` on a section will hide a shared background sitting behind it.
- The `inset: -1px` overlay trick only works inside a parent with `overflow: hidden` (like `.hero`). Without it, the extra pixel spills out: on top of the section above it (a dark 1px line where two overlays stack) and past the right edge (a horizontal scrollbar).
- To find what makes a page too wide, compare `document.documentElement.scrollWidth` with `clientWidth` in the Console, then look for elements whose `getBoundingClientRect().right` is bigger than the window.
- A commit message describing a change doesn't guarantee the change is in that commit — always check `git show <hash>` / `git diff` against what's actually in the file, don't trust the message alone.

## Homepage plan (next sections)

1. Hero (done)
2. **Impact numbers** (done) — the "15 years" section, `id="impact"`. Background: OAD launched 16 April 2011 at the South African Astronomical Observatory in Cape Town. Figures come from the 2025/26 annual report. Always use the newest official figures; they live in the HTML only, so there's one place to update. (This replaced the planned Mission section.)
3. **Three flagships** — Astrotourism, Astronomy for mental health, Astro 4 Skills. This section gets `id="work"`. When it's built, point the hero's "Explore our work" button back to `#work` instead of the temporary external link.
4. **Stories** — real people and quotes from the annual report. Get OAD's confirmation of consent before using named people or photos. The page warms towards amber here.
5. **What's next** — Innovation Hub and Research Institute.
6. **Get involved** — apply, partner, subscribe.
7. **Footer** — full official logo, links, media credits.

## Later ideas

- Interactive impact map like charity: water's, based on the impact map on the current OAD site.
- Proper mobile menu polish, footer, other pages.
- Optional: WebM/AV1 video versions, a separate richer poster frame for phones.
- Move to Astro, put on GitHub, deploy to Netlify.
