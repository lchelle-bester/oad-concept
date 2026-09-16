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
├── assets/images/flagships/  astrotourism.jpg, mental-health.jpg, skills.jpg (1200×800, resized)
├── assets/video/         milky-way.mp4, milky-way-poster.jpg
├── credits.md            source of every image and video
└── CLAUDE.md
```

Full-size source photos live in `C:\dev\oad-concept\originals\`, outside the website folder and ignored by git (`.gitignore` at the repo root). Resize new photos to about 1200px wide and under 250 KB before using them. No ffmpeg or ImageMagick on this machine; Windows' built-in .NET `System.Drawing` (high-quality bicubic, JPEG quality 80) works.

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
| `--color-purple-light` | `#B49DC6` | 8.1:1 | Purple as text (Astronomy for Skills card) |
| `--color-navy` | `#404470` | 2.2:1 | Glows and background shapes. Never text |
| `--color-navy-light` | `#8F95D6` | 7.0:1 | Navy as text (Astronomy for Mental Health card) |
| `--color-surface` | `#0F1128` | – | Card background, a touch lighter than the page. `--color-surface-hover` `#151838` on hover |

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
- Flagship names in the Our work dropdown match the cards: "Flagship 1: Astrotourism", "Flagship 2: Astronomy for Mental Health", "Flagship 3: Astronomy for Skills".
- Dropdowns are `<button>`s using `aria-expanded`. JS toggles the attribute; CSS shows the panel with `.submenu-toggle[aria-expanded="true"] + .submenu`. Escape and outside-click close them.
- At 1024px and below: full-screen menu with accordion submenus, Menu/Close button.
- At 1024px and below, the Menu button is `position: fixed` top-right, so it stays on screen while scrolling; the logo scrolls away with the page. It starts centred on the logo's middle line (`top: calc(1.5rem + 28px)` + `translateY(-50%)`) — if the header padding or logo size changes, update that `top`. Background `rgba(12, 13, 34, 0.85)` so it reads over anything scrolling underneath.

**Hero** (done)
- Left-aligned headline "Astronomy for a better world", text anchored bottom-left.
- Subheading: "Turning our knowledge of the universe into skills, inspiration and opportunities for people on Earth."
- Buttons: "Explore our work" (`#work`, the What we do section) and "Apply for funding" (live CFP page).
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
- Four numbers from the 2025/26 annual report: 254 projects funded, 114 countries, 2M+ people reached, €1.5M+ granted to projects. Four equal `1fr` columns, thin line above, 2 by 2 grid at 720px and below. The heading stays on the hero's left line; the numbers row is capped at 72rem and centred (`margin-inline: auto`).
- The finished numbers are written in the HTML, and JS parses each one into prefix / number / suffix (`€1.5M+` → `€`, `1.5`, `M+`). To change a figure, edit the HTML only. `data-decimals="1"` just sets how many decimals show *while* counting.
- Counting: one `requestAnimationFrame` loop drives all four, 2 s, ease-out (`1 - (1 - t)³`), started by an `IntersectionObserver` watching the `.stats` row (not the whole section) with `rootMargin: '0px 0px -10% 0px'`, so it fires as soon as the numbers come a little way onto the screen. It disconnects itself after the first run. Tuning history: a third of the section fired while the numbers were still off screen; `-30%` left the numbers sitting at 0 in full view; `-10%` with 2 s feels right. The last frame writes the original HTML text back, so `2M+` doesn't land as `2.0M+`. Skipped entirely under `prefers-reduced-motion`.
- `.impact-overlay` has two layers whose top edge matches the hero overlay's bottom edge exactly: the hero's bottom-left radial shadow mirrored to the top-left (same `ellipse 75% 80%` and colour stops), plus a linear darkening from `rgba(7, 8, 24, 0.6)` to `0.86`. Without the mirrored shadow, the left side was about half as bright above the join as below it. If the hero overlay changes, change this to match. It uses `inset: 0`, not `-1px` (see gotchas).

**What we do** (done)
- `id="work"`, directly after the sky, solid `--color-bg`. Heading "What we do" + one-line intro, then three flagship cards in a `<ul class="cards">`, in this order: Astrotourism, Astronomy for Skills (middle), Astronomy for Mental Health. Each links to its programme site. Heading and intro stay on the hero's left line; the card row is capped at 72rem and centred (`margin-inline: auto`).
- Card: photo on top (`aspect-ratio: 4 / 3`, `object-fit: cover` crops the 3:2 photos), then h3 name, tagline in the card's text colour, body text in `--color-text-soft`, "Explore →" pushed to the bottom with `margin-top: auto` so it lines up across cards. 3px top border in the card's line colour, 1rem corners, `--color-surface` background.
- Colour-coding: each `<li>` has a class (`card-astrotourism`, `card-mental-health`, `card-skills`) that sets `--card-line` and `--card-text`; everything inside reads those two variables.
- Stretched link: only the h3 contains a real `<a class="card-link">`. Its `::after` is `position: absolute; inset: 0`, filling the card (`position: relative`), so the whole card is clickable while screen readers hear just the programme name. "Explore →" is `aria-hidden`. Keyboard focus outlines the whole card with `.card:has(.card-link:focus-visible)`.
- Hover: photo `scale(1.04)` over 0.6 s and card to `--color-surface-hover`. Under `prefers-reduced-motion` the zoom is off; the colour change stays.
- Images: `width="1200" height="800"`, `loading="lazy"`, descriptive alt text.
- Orbit doodle (desktop): inline `<svg class="work-orbits">` behind `.work-content`, `viewBox="0 0 2560 1060"`, `preserveAspectRatio="xMidYMin slice"` (anchored in the middle because the card row is centred). One solid and one dashed line, white at 14%, 1.5px with `vector-effect="non-scaling-stroke"` on each path (it isn't inherited). The dashed line starts at a green dot above the cards, sweeps down through the card row and leaves through the left side; the solid line crosses from the left side, rises through the row and leaves through the right side. Neither line touches the top edge next to the impact section.
- Dots (4px radius), all in the open space above the cards: green (start of the dashed line, links to the logo's green), amber and purple-light further along the dashed line, navy-light on the solid line.
- Because the drawing is centred but the heading and intro are on the left, the text's position *in the drawing* moves with screen width. Lines and dots must stay clear of the whole top-left band the text can occupy at any width (roughly viewBox x 0–1380, y 80–280).
- Checked in headless Chrome at 1100×900, 1280×800, 1536×730, 1920×1080 and 2560×1440: every dot visible (not under a card, not off screen) and at least ~59px above the cards; no line point within 12px of the heading or intro text; no line within 65px of the section top. If you move the lines or dots, re-run that check.
- 1024px and below: SVG hidden; cards in one column, `max-width: 34rem`, `gap: 4rem`. Each `.card-item + .card-item` draws a dashed vertical thread up through the gap (`::before`) and a 7px dot in its own card's colour (`::after`). The thread is on the `<li>`, not the card, because the card's `overflow: hidden` would clip it.

## Decisions log

- Left-aligned hero, not centred (keeps the galactic core visible).
- Space Grotesk for headlines over Outfit.
- Pause button removed (my choice). Note: WCAG asks for a pause control on motion over 5 s; reduced-motion users already get the still image.
- Build with code (and Claude), not Framer.
- No `backdrop-filter` over the video: it made the video shake when dropdowns opened. Dropdown panels use a solid `rgba(12, 13, 34, 0.97)` background instead.
- The Mission section is cancelled. The impact numbers follow the hero directly: the hero gives the feeling, the numbers give the proof, fast.
- The sky continues behind the impact numbers rather than the hero ending on a hard edge, then fades into `--color-bg` so the next section starts on dark.
- `position: sticky` for the sky, not `position: fixed`: it pins and releases inside its own wrapper automatically, and it behaves on iOS.
- Numbers count up on first view only, ease-out over 2 s (slowed from 1.5 s), all four together. Reduced-motion users get the final numbers straight away.
- Mobile/tablet: only the Menu button stays pinned while scrolling (my choice, over a full pinned header bar or a hide-on-scroll header). Smallest footprint, keeps the sky clear; trade-off is no logo/home link once scrolled.
- Counting starts when the numbers row itself is well on screen, not when the section first appears, so you actually see it happen.
- Headings and intro text always line up with the hero text on the left. Rows of content (the impact numbers, the flagship cards) are capped at 72rem and centred, so wide screens get equal space on both sides instead of a big gap on the right. (Replaced "whole section content left-aligned with a max-width", which left ~300px empty on the right.)
- Flagship naming: "Astrotourism", "Astronomy for Mental Health", "Astronomy for Skills" (not "Astro 4 Skills"), title case, used the same way on the cards and in the nav.
- Flagship colour-coding from the logo palette: Astrotourism amber (line and text), Mental Health navy line with `#8F95D6` text, Skills purple line with `#B49DC6` text. The light tints exist because navy and purple fail contrast as text on dark.
- Cards are doorways: whole card clickable via a stretched link on the heading, not an `<a>` wrapped around the card (keeps the link name short for screen readers).
- Background doodle: the logo's orbit lines as a static, decorative SVG that threads behind the cards, with one dot per programme colour. Desktop only; phones get short dashed threads between stacked cards instead. No animation.
- Doodle dots go in the open space above the cards, not in the 32px gaps: the gaps move whenever the cards resize, but the space above them is clear at every desktop width.
- Wide `viewBox` anchored in the middle (`xMidYMin slice`) rather than one matching the section: the card row stops growing at 72rem and is centred, so the drawing scales with the section's height (about 1:1) and stays lined up with the cards. (Was `xMinYMin` while the cards were left-aligned.)
- Card order: Astrotourism, Astronomy for Skills, Astronomy for Mental Health (my choice). The nav keeps the official flagship numbers (Skills is still "Flagship 3").
- Orbit lines shouldn't start or stop at a section edge for no reason: the dashed line starts at a green dot (the logo's green), and both lines leave through the sides.
- Section uses a solid background: the sky has fully faded out before it.
- Full-size photo originals kept outside the site folder and out of git.

## Known gotchas

- Removing HTML that JS depends on breaks the JS silently. Check the browser Console (F12) for errors.
- Chrome effects that blur or blend over playing video can cause jitter on Windows.
- Headless browsers may not play H.264; test video playback in real Chrome.
- If JS calls a method (e.g. `addEventListener`) on an element that's been removed from the HTML, it throws and silently stops every line after it in that block — including unrelated code further down. Found this when the pause-button element was deleted from HTML but its JS wasn't cleaned up, which quietly broke the scroll-pause behaviour too.
- `overflow: hidden` on any ancestor silently stops `position: sticky` working. Keep it off `.sky` (it lives on `.sky-media` instead). `body.menu-open` sets it too, but only while the mobile menu covers the screen.
- A solid `background-color` on a section will hide a shared background sitting behind it.
- The `inset: -1px` overlay trick only works inside a parent with `overflow: hidden` (like `.hero`). Without it, the extra pixel spills out: on top of the section above it (a dark 1px line where two overlays stack) and past the right edge (a horizontal scrollbar).
- Two overlays meeting at a section edge must have the same darkness at every point along that edge, not just the same average, or the join shows as a brightness step.
- To find what makes a page too wide, compare `document.documentElement.scrollWidth` with `clientWidth` in the Console, then look for elements whose `getBoundingClientRect().right` is bigger than the window.
- `vector-effect` is not inherited in SVG: put `vector-effect="non-scaling-stroke"` on each `<path>`, not only on the `<g>` around them.
- With a stretched link, the invisible box covers the card, so card text can't be selected with the mouse. That's the known trade-off of the pattern.
- `overflow: hidden` on an element clips its own `::before`/`::after` if they're positioned outside it. That's why the phone threads are drawn by `.card-item`, not `.card`.
- Headless Chrome won't make a window narrower than about 504px. To test 390px, load the page inside a 390px-wide `<iframe>`; media queries use the iframe's width.
- Headless Chrome screenshots of a scrolled position are unreliable with the sticky sky. For layout checks, hide `.sky` in a scratch copy so the section you're testing is at the top.
- A commit message describing a change doesn't guarantee the change is in that commit — always check `git show <hash>` / `git diff` against what's actually in the file, don't trust the message alone.

## Homepage plan (next sections)

1. Hero (done)
2. **Impact numbers** (done) — the "15 years" section, `id="impact"`. Background: OAD launched 16 April 2011 at the South African Astronomical Observatory in Cape Town. Figures come from the 2025/26 annual report. Always use the newest official figures; they live in the HTML only, so there's one place to update. (This replaced the planned Mission section.)
3. **What we do** (done) — the three flagship cards, `id="work"`. The hero's "Explore our work" button now points here.
4. **Stories** — real people and quotes from the annual report. Get OAD's confirmation of consent before using named people or photos. The page warms towards amber here.
5. **What's next** — Innovation Hub and Research Institute.
6. **Get involved** — apply, partner, subscribe.
7. **Footer** — full official logo, links, media credits.

## Later ideas

- Interactive impact map like charity: water's, based on the impact map on the current OAD site.
- Proper mobile menu polish, footer, other pages.
- Optional: WebM/AV1 video versions, a separate richer poster frame for phones.
- Move to Astro, put on GitHub, deploy to Netlify.
