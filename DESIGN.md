# Sarthak Rawat · Design System v3

> **Paper and pixels.** A quiet, literary page with small, live, hand-made objects on it.

The site is a personal place, not a pitch. It should feel like opening someone's notebook: calm type, plenty of air, a few small things you can play with, and illustrations instead of slogans.

Tokens live in [`app/_styles/globals.css`](app/_styles/globals.css) and motion lives in [`app/_lib/motion.js`](app/_lib/motion.js). Every page must pass [`docs/anti-slop-checklist.md`](docs/anti-slop-checklist.md).

---

## 0 · Logo

**Wordmark:** lowercase `eik` in Newsreader (opsz 72, regular), outlined from the font. The dot of the **i** is a **small red pixel flame**: 5 × 6 cells of 46 units (230 × 276 of 2000 units per em), centred on the x where Newsreader draws its own round dot, its base just above the stem. It's the one bitmap detail in a literary letterform, which is the whole site in one mark. It has three frames (at rest with the tip curling right, leaning left, ducking low) and steps between them on an uneven 2.6s rhythm (`.eik-flame` in `globals.css`), so it flickers like a pixel candle without ever tweening. Static uses (favicon, OG image, the SVG files) use frame 0.

| Asset                  | File                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Wordmark (ink / light) | `public/brand/eik.svg`, `public/brand/eik-light.svg`                                        |
| Component              | `app/_components/brand/Mark.jsx` (ink = `currentColor`, flame = `--red`, `brand/Flame.jsx`) |
| Geometry               | `app/_components/brand/eik-geometry.js`                                                     |
| Favicon                | `app/icon.svg`: the i alone, paper on ink, red flame                                        |
| OG image               | `app/opengraph-image.js`                                                                    |

**Use:** the nav at 26px tall. Minimum size is 16px. Keep one pixel-width of clear space on every side. **Never** smooth the flame into curves, recolour it anything but red, set the mark in another font, or capitalise it.

---

## 1 · Principles

1. **About me, not about a brand.** The first thing you see is my name, two plain sentences and a small photo.
2. **Say less.** One idea per section. If a sentence sells, cut it.
3. **Objects, not effects.** Interactivity lives in small, self-contained objects (a record player, a bookshelf, a clock), never in page chrome: no custom cursor, no scroll hijack, no wipes.
4. **One loud thing per page,** and it should be an illustration or a toy, not a headline.
5. **Illustrations over icons.** One consistent illustration style; no stock icon decoration.
6. **Fast and accessible.** Native scrolling, keyboard paths, reduced-motion fallbacks.

---

## 2 · Colour

| Token             | Light        | Dark         | Use                                                                                 |
| ----------------- | ------------ | ------------ | ----------------------------------------------------------------------------------- |
| `paper`           | `#FBFBF9`    | `#121211`    | Page                                                                                |
| `tile`            | `#F2F2EF`    | `#1B1B19`    | Soft tiles that hold an object (widgets, toys, thumbnails)                          |
| `tile-2`          | `#E9E9E5`    | `#242422`    | Pressed / nested in a tile                                                          |
| `line` / `line-2` | ink 9% / 18% | ink 9% / 18% | Dividers / control borders                                                          |
| `ink`             | `#1A1A18`    | `#ECEBE6`    | Text                                                                                |
| `soft`            | `#64635D`    | `#A3A29B`    | Secondary text (6:1)                                                                |
| `faint`           | `#6D6C66`    | `#8F8E88`    | Captions and pixel data only                                                        |
| `red`             | `#E5392E`    | `#FF5A4E`    | The one accent: tiny marks (active-nav dot, a ribbon, the playing state, selection) |
| `live`            | `#2F9E5B`    | `#5CC98A`    | A "live" dot, only next to genuinely live data                                      |

**Contrast** (WCAG, computed; text must clear 4.5:1 on both grounds):

| Pair                               | Light on paper / tile | Dark on paper / tile |
| ---------------------------------- | --------------------- | -------------------- |
| ink                                | 16.8 / 15.5           | 15.7 / 14.5          |
| soft                               | 5.8 / 5.4             | 7.3 / 6.7            |
| faint                              | 5.1 / 4.7             | 5.7 / 5.3            |
| red (marks only, never small text) | 4.1 / 3.8             | 6.1 / 5.6            |

**No** gradients, glows, blurs, grain, dot grids or glass. Depth comes from `tile` vs `paper`, plus one soft `shadow-pop` for popovers.

---

## 3 · Type: "paper and pixels"

| Role         | Family                              | Use                                                        |
| ------------ | ----------------------------------- | ---------------------------------------------------------- |
| `font-serif` | **Newsreader** (opsz, 400 + italic) | The voice: name, intro, paragraphs, titles                 |
| `font-sans`  | **Geist**                           | Small UI: nav, labels, captions, buttons                   |
| `font-pixel` | **Departure Mono** (MIT)            | **Live data only**: clock, now playing, track time, counts |

| Token        | Size / line                | Use                                                  |
| ------------ | -------------------------- | ---------------------------------------------------- |
| `text-name`  | clamp(36→52) / 1.05, −2.5% | My name, once on the home page                       |
| `text-title` | 28 / 34                    | Page titles                                          |
| `text-intro` | 21 / 32                    | The hero intro                                       |
| `text-read`  | 17 / 27                    | Body (default)                                       |
| `text-small` | 15 / 24                    | Serif captions                                       |
| `text-ui`    | 13 / 20                    | Sans UI                                              |
| `text-pixel` | 11 / 16                    | Pixel data (Departure Mono is drawn on an 11px grid) |

**Rules:** no uppercase tracked labels; no headline with a muted second line; no section numbers; headings are small (sans `label` or serif `title`). Italic is for book titles and the odd emphasis.

---

## 4 · Layout

- **Text column** `.col`: 640px. **Wide** `.col-wide`: 1040px (nav, hero, footer, galleries).
- Sections are separated by space (`mt-24 md:mt-32`), not boxes. Hairlines only between list rows.
- **Hero:** name + intro on the left, one **small photo** (≈ 160–200px) on the right. On phones the photo sits above the name at 96px.
- **Photos:** two or three of me in total. The hero photo is a 1-bit dither that turns to colour on hover; the About page shows the others in colour.

---

## 5 · Shape and depth

Radii are `sm 6` · `md 12` · `lg 20` · `xl 28`. Tiles use `lg`; small thumbnails use `md`; popovers use `md` + `shadow-pop`; chips use `sm`.

| Elevation | Recipe                              | Used for                                                         |
| --------- | ----------------------------------- | ---------------------------------------------------------------- |
| E0 · page | `paper`                             | Text, lists                                                      |
| E1 · tile | `tile`, no border                   | Objects: Now tiles, shelf preview, thumbnails, next-project link |
| E2 · pop  | `paper` + 1px `line` + `shadow-pop` | Chip popovers, photo prints, the open book                       |
| Focus     | 2px `ink` outline, 3px offset       | Everything focusable                                             |

---

## 6 · Components

| Component            | Where                                                | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navbar               | `chrome/Navbar.jsx`, `chrome/AmbientButton.jsx`      | My name left; Work · About · Library right, a red dot under the active link; after a hairline, the ambient music switch: a tiny 7×7 pixel record, grey and still when off; ink with a red label when on, a glint stepping round it a quarter-turn at a time (no rotation, so it stays crisp). Static, not sticky.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Footer               | `chrome/Footer.jsx`, `chrome/Maple.jsx`              | Tall sign-off: generative pixel art across the full column, drawn in code in the koi pond's style (fine grey strokes fading through dither, faint dotted water; the paper is the water). A Japanese maple grown by a seeded branching rule (`SEED`) stands on a dotted bank with its reflection breaking up below the waterline, a clump of reeds at the far end. Its red leaves are the only red. © and local time in pixel type, socials and Light · Dark sit below it.                                                                                                                                                                                                                                                                                                                                                                                                         |
| Koi pond             | `home/KoiPond.jsx` (in `home/Hero.jsx`)              | Generative pixel art behind the hero, drawn in code on a 3px grid across the full width (fine grey pixel strokes, forms that fade through dither, faint dotted traces; the paper is the water). Five koi (three on phones) with procedural bodies: a rope spine, a travelling wave, fanned forked tail and fins; patterns ride the body (showa, karasu, utsuri, a pale ghost, and one kohaku with red patches, the only red in the hero). Deeper koi are sparser. They steer around everything marked `data-pond-avoid` (the text and the photo), turning wide and committing to a side; a few lily pads float over them. Pointer moves ring the water; a slow pointer draws a curious koi, a fast one makes it dart; a click or tap in open water drops food they swim to and eat (taps are read from pointerdown/up, since iOS Safari sends no `click` for a tap on plain page) |
| Portrait             | `home/Hero.jsx` + `ui/Bitmap.jsx` + `ui/Develop.jsx` | Small dithered photo. On first load it **develops**: a paper canvas clears in 8px blocks, centre first, ease-out, ~850ms, once per session (the page's one orchestrated moment). Hover reveals colour through a circle that follows the pointer (no caption); on touch, a tap floods the colour out from the finger and a second tap takes it back.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Live chips           | `now/*`                                              | Words in the intro (_India_, a book, a song) that open small popovers with live details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Now                  | `now/*`                                              | Small object tiles: what I'm reading, a record player for the songs I'm on repeat with, chosen by hand in `_data/library.js` (drop the needle for a 30-second preview), my local clock                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Work list (home)     | `work/WorkList.jsx`                                  | Three projects on the home page: thumbnail · title + one line · year; hover lifts the thumbnail to colour. Project covers are pixel-ink illustrations of what each product does (ink and greys on paper, one red detail, true 320×200 pixel grid), with the name set in Newsreader top-left                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Library              | `library/*`                                          | The bookshelf: spines with head and tail bands stand on a plank (`tile-2`, one per row); the last book leans on its neighbour (9°, pivoting on its foot). Run the cursor, or a pressed finger sideways, along the spines and they rise; books open into their real covers (`public/books`, sizes in `_data/covers.json`; the spine's cloth flies out and the cover prints onto it as it lands) with a kept quote. A pixel candle with the logo's flame stands at the end of the shelf: tap it to blow it out (a thread of smoke rises a pixel row at a time) or relight it                                                                                                                                                                                                                                                                                                        |
| Résumé actions       | `work/ResumeActions.jsx`                             | Top of Work: Résumé (opens the Google Drive copy in a new tab) + copy-email (pixel "copied"). Once scrolled past, a compact pill with both stays at the bottom of the screen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Work ledger          | `work/Ledger.jsx`                                    | Experience is always open with its architecture diagram inline; projects expand in place (height + fade, 320ms out / 240ms in); figures in bullets set in ink                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Skill focus          | `work/SkillsBoard.jsx`, `work/skillFocus.jsx`        | Hover a skill: roles/projects that used it stay bright, the rest fade to 30%. Hover a row: its skills light up. On touch, a tap pins either one and a second tap lets go (the architecture diagram's boxes work the same way)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Architecture diagram | `work/diagrams/*`                                    | Pick a flow (red pixel marks the active one); a red square travels hop by hop (440ms/hop, ease-out, 300ms rest), inking its path red behind it, and red viewfinder corners snap onto the box it reaches (180ms). Pixel squares show the steps and jump to one; hover a box for its job; ← → step, Space replays. Narrow screens scroll sideways and follow the request. Reduced motion: whole path inked, steps listed                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| GitHub activity      | `work/proof/*`                                       | 1-bit contribution grid (dither density = activity, busiest day red), recent repos, and an npm terminal that types the install command. Data: `npm run sync:github` → `app/_data/github.json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

---

**States.** Every control uses the same tokens for each state:

| Control                       | Default                 | Hover                              | Pressed                 | Focus                        | Disabled    |
| ----------------------------- | ----------------------- | ---------------------------------- | ----------------------- | ---------------------------- | ----------- |
| Text link / nav               | `soft`                  | `ink`, 160ms                       | —                       | outline                      | —           |
| Inline link (`.ink-link`)     | ink, `line-2` underline | underline → currentColor           | —                       | outline                      | —           |
| Chip                          | `tile` + `line` border  | `paper` ground, popover opens      | popover toggles (touch) | popover opens, outline       | —           |
| Round control (record player) | `paper` + `line-2` ring | `tile-2`                           | scale .95, 90ms         | outline                      | 40% opacity |
| Row (work, list)              | transparent             | `tile` ground, thumbnail to colour | —                       | outline, thumbnail to colour | —           |

**Icons.** Lucide at 1.5 stroke, 12–16px, only where they carry meaning: the external-link arrow, back arrow, lock (private repo), play/pause/next. No decorative icons; glyphs inside objects (sun, moon, book, equaliser) are drawn in CSS/SVG to match the pixel style.

---

## 7 · Motion

**Snappy and small.** Motion answers the user; text doesn't animate in.

| Duration | ms  | Use                                                         |
| -------- | --- | ----------------------------------------------------------- |
| `press`  | 90  | Press                                                       |
| `quick`  | 160 | Hover                                                       |
| `base`   | 240 | Popovers, toggles                                           |
| `slow`   | 420 | Object state changes (a record spinning up, a book opening) |

Easing: `standard (.2,0,0,1)` for state, `out (.16,1,.3,1)` for appear, `in (.4,0,1,1)` for leave.

| Motion                             | Timing (measured where noted)                                                                                                                                                                                                                                                                                                                                                                                               | Reduced motion                            |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Photo develop                      | 8px blocks clear centre-first, ease-out, ~850ms, once per session (measured: 100→0% in 860ms)                                                                                                                                                                                                                                                                                                                               | Skipped; photo shown                      |
| Name swap                          | Hover (or tap) "Sarthak" in the home h1: its letters flip up and away from the end (20ms stagger) while the line closes up behind them, the eik wordmark rises letter by letter (60ms stagger, drop ease), and the red flame lands last on the i with a small spring (~0.7s in all). Leaving plays it back: flame lifts off, eik sinks, then the line opens and the name returns left to right                              | Instant swap                              |
| Greeting flip                      | Home h1: "Hey" flips (rotateX, 220ms, flip ease) through नमस्ते · Hola · Salut · Ciao · やあ and back to Hey, 300ms per word after a 450ms settle (~2.4s). The rest of the line glides as each word's width changes. Once per page load; screen readers only hear "Hey"                                                                                                                                                       | "Hey", static                             |
| Chip popover                       | 180ms out, 100ms in (measured: fully visible at 130ms)                                                                                                                                                                                                                                                                                                                                                                      | Instant                                   |
| Colour reveal on photos/thumbnails | 240ms                                                                                                                                                                                                                                                                                                                                                                                                                       | Instant                                   |
| Tonearm / record                   | spring (k 260, c 28); record spins at ~33 rpm while playing                                                                                                                                                                                                                                                                                                                                                                 | Arm moves instantly; no spin              |
| Shelf lift / book open             | 240ms lift; layout morph for the open book                                                                                                                                                                                                                                                                                                                                                                                  | Instant                                   |
| Koi pond                           | Stepped at 20 frames a second. The pond inks in over ~1.2s in five steps; koi cruise ~20px/s, swim to food at ~55px/s, dart from a fast pointer. Ripples are dotted rings that thin as they grow. Pauses off screen and in hidden tabs                                                                                                                                                                                      | One still frame (koi settled, two rings)  |
| Maple                              | Stepped at 20 frames a second. The first time the footer comes into view the maple grows itself, trunk first, branch by branch (~2s), then its leaves ink in. It sways in a slow wind, the reeds bend with it. Every 4–8s a red leaf lets go, turns over as it falls, lands with a dotted ring and drifts off. Hover or tap the crown to shake a leaf loose; tap the water to ring it. Pauses off screen and in hidden tabs | Fully grown, still, one leaf on the water |
| Clock colon                        | 1.2s stepped blink                                                                                                                                                                                                                                                                                                                                                                                                          | Static                                    |
| Logo flame                         | Three pixel frames, stepped (never tweened) on an uneven 2.6s loop: rest · lean · rest · lean · rest · duck · rest. The shelf candle uses the same frames; blown out, its smoke rises six pixel rows over 1.3s and thins away                                                                                                                                                                                               | Frame 0, still; no smoke                  | Springs only for physical objects. Allowed loops: a spinning record while playing, the equaliser bars, the pixel-clock colon, the logo flame (and the shelf candle), the hero koi pond, the footer maple. Everything respects `prefers-reduced-motion`. |

---

## 8 · Illustration

One style everywhere: 1-bit dither with at most one red element. Illustrations are spot pieces on `paper` or inside a `tile`, contain no text, and use ink plus at most one red element.

---

## 9 · Sound

Off by default. The ambient pad's switch is in the header (the tiny record); it's synthesised (Web Audio), with no files, and pauses when the tab is hidden. Turning it on also turns on the small UI sounds.

**Song previews** (`_lib/player.js`): the record player and the "listening to" chip play a 30-second preview of the song shown, found by title and artist through Apple's public iTunes Search API (no key). One plays at a time; while it plays, the ambient record steps aside and comes back after. The song itself opens on Apple Music.

---

## 10 · Credits

Departure Mono © Tobias Fried (MIT). Interaction ideas and UI sounds are adapted from Bencho (MIT). Motion rules follow [Web Animation Best Practices](https://gist.github.com/uxderrick/07b81ca63932865ef1a7dc94fbe07838).
