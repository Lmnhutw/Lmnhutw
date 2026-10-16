---
name: Pixel RPG Profile
description: Vincent's compact GitHub RPG character screen and terminal quest journal.
colors:
  background: "#080D16"
  panel: "#0D1522"
  surface: "#121D2D"
  text: "#E6EDF7"
  secondary: "#8FAAC7"
  mint: "#59F5BE"
  purple: "#A970FF"
  cyan: "#69BFFF"
  border: "#29445C"
  contribution-low: "#164936"
  contribution-medium: "#217655"
  contribution-high: "#32AD7A"
typography:
  base:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "15px"
  title:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "20px"
    fontWeight: 700
  heading:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "28px"
    fontWeight: 700
  body:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "16px"
  secondary:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "14px"
  label:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "13px"
  meta:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "11px"
  state:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "13px"
  value:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "27px"
    fontWeight: 700
  mobile:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "26px"
  mobile-label:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "23px"
  mobile-meta:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "21px"
  mobile-pair-copy:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "28px"
  mobile-pair-meta:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
    fontSize: "27px"
rounded:
  slot: "3px"
spacing:
  compact-gap: "8px"
  gap: "12px"
  mobile-inset: "20px"
  paired-panel-inset: "24px"
  full-panel-inset: "26px"
components:
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
  inventory-slot:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.slot}"
    height: "46px"
  inventory-slot-mobile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.mobile-pair-copy}"
    rounded: "{rounded.slot}"
    width: "300px"
    height: "36px"
  quest-tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.meta}"
    rounded: "{rounded.slot}"
    height: "30px"
  repository-action-visual:
    backgroundColor: "{colors.background}"
    textColor: "{colors.mint}"
    typography: "{typography.state}"
    width: "162px"
    height: "32px"
  metric-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.slot}"
    width: "110px"
    height: "88px"
---

# Design System: Pixel RPG Profile

## Overview

**Creative North Star: "Retro Pixel Art × Cyberpunk Terminal × RPG Quest Interface"**

Retro Pixel Art × Cyberpunk Terminal × RPG Quest Interface. A personal RPG character screen combines deep navy terminal panels with detailed, cozy pixel scenes. Mint marks actions and state, purple identifies quests, and cyan organizes inventory and system information.

The shipped surface is a GitHub profile README composed of self-contained SVG images and native Markdown/HTML links. Its density, crisp geometry and locally rendered monospace copy support the room scenes and moonlit cat ending. The Hero embeds the user-supplied vincent_character.gif unchanged; there is no website runtime or scripted interaction.

**Key Characteristics:**

- Compact terminal density with clear project and player-name emphasis.
- Original generated pixel rooms and a moonlit forest with a cat.
- Thin clipped-corner frames, inset slots and restrained semantic accents.
- Separately composed mobile images with the project/inventory pair preserved.

The normative values above are extracted from scripts/svg.js, scripts/build-board.js, scripts/generate-profile.js and their checked-in assets. SVG pixels are intrinsic drawing units and scale with the image; they are not guaranteed CSS pixels in GitHub. The direction is confirmed by PRODUCT.md and docs/profile-design.md; structure and maintenance remain in docs/frontend-structure.md and docs/maintaining-profile.md.

## Colors

Deep navy layers keep the illustrated scenes atmospheric while the three bright accents make the board scannable. The frontmatter owns exact values; this section assigns their roles. Sidecar swatch ramps are synthesized display metadata, not additional shipping tokens or substitutes for the discrete contribution palette.

### Primary

- **Terminal Mint** (mint): state labels, repository-action outlines, the featured-row indicator and the strongest contribution level.

### Secondary

- **Quest Purple** (purple): Current Quest and Quest Log framing and titles.

### Tertiary

- **Inventory Cyan** (cyan): inventory framing, technology labels, project-icon strokes and system separators.
- **Contribution Greens** (contribution-low, contribution-medium, contribution-high): three intermediate real-activity levels between an empty surface cell and Terminal Mint. This is a discrete data palette, not a general accent ramp.

### Neutral

- **Midnight Canvas** (background): opaque image background, independent of GitHub's host theme.
- **Deep Navy Panel** (panel): the outer framed interface layer.
- **Raised Navy Slot** (surface): inventory, metric and tag interiors; empty contribution cells.
- **Moonlit Foreground** (text): body copy, numbers and the pixel name.
- **Steel Blue Copy** (secondary): metadata and supporting text.
- **Slate Frame** (border): subtle inner outlines and row separators.

**The Semantic Accent Rule.** Use mint for actions and states, purple for quests, and cyan for inventory and system information.

## Typography

**Body and labels:** the local monospace stack in the frontmatter. All roles inherit this stack from the SVG text rule. No font file is loaded. **Player name:** original five-column by seven-row vector bitmap glyphs, not a typeface. The name uses six-unit pixels on desktop and five-unit pixels on mobile; crispEdges preserves the geometry.

The hierarchy pairs readable terminal copy with a single unmistakable pixel identity. The shared SVG roles are base, section title, project heading, body, secondary copy, label, metadata, state and metric value. Bold is explicitly used for section titles, project headings and metric values; other roles inherit SVG's normal weight. Baseline positions and line breaks are composed manually; there is no shared CSS line-height or tracking token.

Mobile full-width assets use the mobile copy, label and metadata roles. The two narrow mobile panels override copy/labels with mobile-pair-copy and metadata with mobile-pair-meta so both images retain equal widths without copying desktop density. Individual project names can wrap to two SVG text lines. The featured mobile description has a local 24-unit fit adjustment; it is not a reusable type role.

**The Local Lettering Rule.** Keep the player name as original vector bitmap glyphs and all readable SVG copy in the local monospace stack; do not fetch fonts.

## Layout

The README stacks inline picture elements and ordinary link rows. Desktop full-width images have 1000-unit viewBoxes. The Hero is 1000 × 388, with the room on the left, identity in the middle and a secondary contact/system sidebar on the right. Current Quest is 1000 × 286. The compact header is 1000 × 46; Adventurer Log is 1000 × 214; the footer is 1000 × 220.

Quest Log and Inventory each use 490 × 430 desktop viewBoxes and adjacent image widths of 49%. Their mobile versions both use 340 × 920 and retain the same two-column relationship. They are not stacked into an oversized single-column treatment.

At max-width: 600px, each picture selects its separately composed mobile SVG. Full-width mobile viewBoxes are 600 units wide: header height 64, Hero 750, Current Quest 440, Adventurer Log 440 and footer 260. The mobile Hero places room and identity above copy and two groups of contact/system details. Mobile activity metrics form a two-by-two group above the calendar.

Insets follow the recorded mobile, paired-panel and full-panel values, with compact and regular gaps reused in inventory layouts. Desktop technology slots are 106 or 140 units wide and 46 high, depending on category count; mobile slots are one column inside the inventory image, with 38-unit row steps. These are SVG composition measurements, not a responsive CSS grid.

## Elevation & Depth

The interface uses flat tonal layering and thin SVG strokes rather than reusable drop shadows, blur, gradients or glass surfaces. Frames have an accent outer stroke and a quieter inner border at 0.55 stroke opacity. The footer's dialogue panel overlays the art using the canvas fill at 0.95 desktop / 0.96 mobile opacity. Atmospheric light and depth live inside the authored pixel artwork. Official logo artwork may retain its own shading; that does not establish an interface-shadow system. There are no motion or transition tokens in the implementation.

**The Tonal Frame Rule.** Separate panels through dark tonal layers and thin borders; scene lighting belongs to the artwork, not a reusable panel shadow.

## Shapes

Outer frames use straight segments with clipped nine-unit corners: the shared path starts at (12, 3), turns to (width − 3, 12) and mirrors around the panel. Thin right-angle corner brackets and an inset rectangular outline reinforce the terminal-window form. Frames are drawn geometry, not a rounded rectangle. Slots use the small recorded corner radius; the repository-action visual is square. The rounded backing behind the Next.js logo is an icon-specific contrast aid, not a panel-radius rule.

Project icons are original cyan stroke drawings with two-unit strokes and miter joins. Technology marks are official Devicon SVGs embedded into the containing image. The Hero embeds the user-supplied animated GIF with image/gif MIME and meet fitting so the character is not cropped. The Current Quest and footer embed generated PNG scenes; keep their crisp edges and prompt/provenance metadata when maintaining them.

## Components

### System header and native links

A slim terminal strip uses left-aligned system text, centered desktop destination names and a mint state marker. The mobile source shortens this arrangement. ONLINE is a decorative label. Actual navigation and contact links are native README anchors; GitHub controls their host styling and keyboard focus. The SVG has no hover, focus or click behavior of its own.

### Framed panels and inventory slots

Panels combine the clipped frame, tonal background and context accent. Slots share the surface fill, border, small radius and local text roles. Inventory slots pair embedded official logos with text; mobile uses larger marks and simpler wrapping. Keep distinct per-category slots and the four category groups.

### Quest rows and technology tags

Quest rows pair original project geometry, a bold project name, supporting copy and presentation-priority metadata. The first desktop row has a subtle filled selection and mint left stroke. MAIN, FEATURED and SIDE are static priority labels. Technology tags use inset slots with centered metadata text; they are not interactive chips.

### Repository action

The mint-outlined VIEW REPOSITORY visual belongs to the featured quest image. Its native wrapping README anchor makes the complete image actionable. The other project destinations are separate real links below the pair of panels. Do not infer individual clickable hit areas from SVG labels. Unknown Portfolio remains unlinked.

### Adventurer Log

Four inset metric tiles use bold values and metadata labels. Calendar cells step through surface, the three contribution greens and mint for real intensity levels zero through four. Desktop cells are six units on an eight-unit step; mobile cells are eight units on a ten-unit step. Dates and cached/unavailable copy stay visible according to the generator; unavailable data draws no pretend activity.

### Pixel scenes and journal dialogue

The Hero room establishes identity, the Current Quest workspace supports the featured project and the moonlit cat footer closes the board. The footer dialogue uses an opaque-enough navy overlay rather than text directly on busy pixels. Desktop uses a small speech-tail path; mobile uses a rectangular overlay and separately arranged copy.

## Do's and Don'ts

### Do:

- **Do** preserve the compact three-column desktop Hero and two equal project/inventory pictures.
- **Do** compose mobile SVG variants at the established source breakpoint instead of shrinking every desktop text block.
- **Do** embed artwork and logos inside SVGs, preserve PNG provenance, and keep small original project icons as geometry.
- **Do** provide meaningful image alt text, SVG titles/descriptions and actual README links for destinations.
- **Do** retain real activity values, dated snapshots and explicit cached or unavailable states.

### Don't:

- **Don't** replace the chosen pixel RPG world with a generic SaaS dashboard or oversized single-column interface.
- **Don't** introduce heavy glassmorphism, excessive gradients or oversized interface shadows.
- **Don't** rely on JavaScript, custom README CSS, external fonts or clickable targets inside an SVG image.
- **Don't** invent progress percentages, contribution activity, missing URLs or interaction states.
