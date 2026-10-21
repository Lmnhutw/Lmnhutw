# Maintaining the Pixel RPG profile

The profile is generated Markdown/HTML plus self-contained SVG images. It has no client runtime, frontend framework, font service or npm dependencies. Use Node.js 22 or later.

## Update

1. Edit URLs in `profile-links.json`. Known original URLs are retained; Portfolio is deliberately `null` until supplied. Null contact/project entries do not become fake links.
2. Run `npm run generate` to refresh public GitHub metrics and the contribution calendar.
3. Run `npm run build` to rebuild the static SVG sections and README image versions.
4. Run `npm test` and `git diff --check`.

Generated SVGs and README should be changed through the scripts. The daily GitHub workflow runs the data tests before updating both activity images and their contribution cache.

Image URLs point directly to raw.githubusercontent.com and include a content hash. Rebuilding README after an image changes gives GitHub a new cache key, preventing old and new dashboard sections from appearing together. Line endings are normalized when hashing so Windows and Linux produce the same versions.

## Artwork and icons

- `assets/banner.png`: user-supplied welcome banner, displayed unchanged above the System Board header.
- `assets/vincent_character.gif`: user-supplied animated Player Profile avatar, embedded unchanged in both Hero SVGs with the GIF MIME type and fitted without cropping.
- `assets/art/developer-room.png`: previous generated Hero artwork, retained as an unused source; prompt in `docs/art-prompts/developer-room.txt`.
- `assets/art/narrative-workspace.png`: generated with built-in ImageGen; prompt in `docs/art-prompts/narrative-workspace.txt`.
- `assets/art/moonlit-forest.png`: generated with built-in ImageGen, then recomposed to keep the cat and moon visible in a shallow footer. Original/edit prompts are both in `docs/art-prompts/`.
- Every shipping PNG carries its generation prompt in PNG metadata. Images are palette-optimized with nearest-neighbor resizing to preserve pixel edges.
- `assets/icons/` contains official Devicon assets, sourced from `https://github.com/devicons/devicon`; its MIT license is included. Technology marks remain the property of their respective owners. GitHub's black fill was changed to the profile foreground for dark-background readability.
- Project icons and the player-name lettering are small original SVG geometry in `scripts/svg.js`.
- `docs/pixel-rpg-reference.png` is the user-supplied design reference, not a runtime image or a screenshot of the implemented README.

## Real data and failure behavior

Repository, star, follower and creation-date metrics come from GitHub's REST API. Repository pages are fetched completely and the latest push is calculated across the entire result.

The heatmap reads actual intensity levels from GitHub's public contribution-calendar HTML. These are contribution levels, not fabricated commit counts. The parser validates dates/levels and has focused tests. If GitHub changes that markup, refreshes fall back to the last valid `assets/github-contributions.json` snapshot and visibly show CACHED with its date. Without valid cached data, the image says Contribution data unavailable and draws no cells.

If the required metrics API fails or returns invalid data, generation exits unsuccessfully before overwriting the existing SVGs. Tokens are optional for local REST requests; the workflow uses its standard GITHUB_TOKEN.

All dates shown are UTC. ONLINE is a decorative terminal-board label, not real-time availability. The player status is Currently Building. MAIN, FEATURED and SIDE describe presentation priority.

## GitHub rendering

Each SVG embeds its raster/icon content; no external resource has to load inside an SVG. Pixel-name geometry avoids external fonts; all other text uses local monospace fallbacks.

The README uses standard `picture/source` elements, which GitHub's Markdown renderer preserves. At viewport widths up to 600px, the browser chooses separately composed mobile SVGs. The two adjacent 48%-width project/inventory pictures are centered with the user's nonbreaking-space gap and equal image heights. Their mobile copy wraps instead of being reduced to tiny desktop text. Project links and the footer preserve the user's supplied spacing and copy through rebuilds.

All actionable destinations also exist as native README anchors. SVG artwork alone cannot provide multiple clickable targets.

Validation covers GitHub-sanitized HTML, SVG text bounds/overlap, native links, mobile source selection, equal two-column geometry, and light/dark host backgrounds at 1280, 1064, 768, 375 and 320px. Local host CSS approximates GitHub; the published profile still needs a visual check after a push.
