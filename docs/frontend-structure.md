# Frontend Structure Contract

## Scope and ownership

GitHub profile README rendered as HTML/Markdown and six SVG images. Static artwork lives in `assets/`; `scripts/generate-profile.js` owns the generated Adventurer Log. No client JavaScript, framework, external fonts, or CSS build step.

## Naming

Preserve the established asset-local classes: `.panel`, `.title`, `.name`, `.body`, `.label`, `.value`, and `.meta` describe roles within one SVG. Each asset owns its embedded stylesheet; classes never style another image or the README. This isolated scope is the intentional exception to global BEM naming.

## Layout and styling

- Use a 1000-unit-wide viewBox and single-column, full-width README images.
- Keep at least 34 units of horizontal inset, thin borders, navy surfaces, violet quest accents, green states, and blue inventory accents.
- Use system sans-serif for names/body copy and system monospace for metadata. Body copy is at least 34 units. Smaller metadata must not carry essential content alone.
- Keep the pixel character as the visual anchor. Do not add fake availability, progress bars, or activity metrics.
- SVG presentation attributes are appropriate for drawing geometry. Put recurring text roles in the embedded stylesheet.

## GitHub constraints

- Put actionable links in README HTML/Markdown, or wrap a single-destination image in an anchor. Links inside SVG images are not interactive.
- Give every README image meaningful alt text and every SVG a title/description.
- Do not depend on README CSS, scripts, media queries, or two-column tables for mobile layout.
- Metric layout changes must reach the generator and checked-in SVG. Label scheduled data as a dated snapshot.

## Verification

Run `npm test`, `npm run generate` when network access is available, and `git diff --check`. Inspect desktop, tablet, and mobile compositions on light and dark host backgrounds. The local preview approximates GitHub; confirm the published profile separately after pushing.

This document governs frontend structure and naming when multiple skills apply.
