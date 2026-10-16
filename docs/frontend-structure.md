# Frontend Structure Contract

## Scope and ownership

GitHub profile README rendered as HTML/Markdown and six SVG images. Static artwork lives in `assets/`; `scripts/generate-profile.js` owns the generated Adventurer Log. No client JavaScript, framework, external fonts, or CSS build step.

## Naming

Preserve the established asset-local classes: `.panel`, `.title`, `.name`, `.body`, `.label`, `.value`, and `.meta` describe roles within one SVG. Each asset owns its embedded stylesheet; classes never style another image or the README. This isolated scope is the intentional exception to global BEM naming.

## Layout and styling

- Use 1000-unit-wide full-width sections and equal 490-unit Quest Log / Inventory panels as two adjacent 49%-width pictures. This avoids GitHub table borders around the artwork.
- Desktop Hero uses illustration / identity / contact sidebar columns. Use the supplied V2.1 reference as visual authority.
- Keep 18–28 units of inset, thin stepped borders, the supplied navy palette, mint states, purple quests and cyan inventory accents.
- Use local system monospace for readable copy and vector pixel lettering for the player name; never fetch fonts inside SVG.
- Desktop body copy is 15–17 units. Supply separately composed mobile SVGs through supported HTML picture/source elements, rather than magnifying every desktop section.
- Keep both Quest Log / Inventory columns on mobile, with simpler, larger inventory slots and equal image heights.
- Use generated pixel-art scenes, preserve their prompts/provenance, and embed optimized images inside self-contained SVGs.
- No invented progress percentages or contribution cells. Keep actual snapshot dates and explicit unavailable/stale states.
- SVG presentation attributes are appropriate for drawing geometry. Put recurring text roles in the embedded stylesheet.

## GitHub constraints

- Put actionable links in README HTML/Markdown, or wrap a single-destination image in an anchor. Links inside SVG images are not interactive.
- Give every README image meaningful alt text and every SVG a title/description.
- No JavaScript or custom CSS in README. The layout uses standard inline pictures, percentage image widths and picture/source media selection; each image remains independently readable.
- Metric layout changes must reach the generator and checked-in SVG. Label scheduled data as a dated snapshot.

## Verification

Run `npm run build`, `npm test`, `npm run generate` when network access is available, and `git diff --check`. Inspect GitHub-sanitized HTML at desktop, tablet, and mobile widths on light and dark host backgrounds. Validate SVG text bounds, equal column heights, native links, mobile source selection and file sizes. Confirm the published profile separately after pushing.

This document governs frontend structure and naming when multiple skills apply.
