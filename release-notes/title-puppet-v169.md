# Nobunaga joint-animation prototype (v169)

This is an isolated preview; it does not change the active game title, game version, saves, or service worker.

- Preview: `tests/title-puppet-preview.html`
- Renderer: `tests/title-puppet-v169.mjs`
- Atlas: `assets/title-nobunaga-parts-v169.webp`
- Creation: built-in image generation, transparent PNG; mechanically encoded as WebP (quality 96, alpha retained).
- Shoulder/elbow/wrist use hierarchical rigid-part transforms. Feet and torso remain planted. Hair and cape use their own pivots. Two mouth expressions are selected.
- Transparent alpha islands are extracted once on loading to avoid neighboring part pixels from the irregular atlas layout.
- The earlier cel preview remains at `tests/title-cheer-preview.html` for comparison.

## Final asset prompt

Use case: precise-object-edit. Asset type: layered 2D puppet atlas for real shoulder/elbow/wrist animation in a Japanese game. Edit target/reference: the attached black-and-gold chibi Nobunaga. Preserve precisely his face, red eyes, hair, thick black outline, flat black armor with gold trim, red scarf/cape, boots, and proportions. Produce DETACHED SEPARATE PARTS, NOT assembled characters and NOT animation frames. A square transparent PNG, exactly 3 columns x 3 rows of equal-sized cells, 9 isolated cutouts, one per cell, generous transparent gutters (10% within each cell). No part may cross its own cell. All pieces are front three-quarter facing viewer-right, matching original perspective. Fully paint areas normally hidden behind other pieces so they overlap without holes.
Row1 col1: ONLY torso plus both legs/boots in the original wide planted stance, including neck/scarf, black/gold chest and skirt armor, belt, trousers; REMOVE both arms, head, ponytail and cape. Intact complete torso underneath missing arms.
Row1 col2: ONLY complete head with all front/side hair and ear, NO ponytail, calm confident CLOSED smile. Clean lower jaw.
Row1 col3: EXACT SAME head as col2, precisely identical size, outer silhouette, eyes and angle; ONLY mouth changes to big joyful open victory shout. NO ponytail.
Row2 col1: ONLY sword-side UPPER ARM, gold-trimmed black shoulder pauldron at top, black short sleeve down to rounded elbow at bottom. Oriented vertically down, with enough covered joint material for overlapping.
Row2 col2: ONLY sword-side FOREARM with black/gold bracer and closed gripping bare fist. Elbow at top, hand at bottom. NO upper arm and NO weapon. Fits with upper arm from row2 col1.
Row2 col3: ONLY the OTHER complete arm, bent at elbow, black/gold armor, small clenched bare fist in confident waist-height pose.
Row3 col1: ONLY the flowing red CAPE, original dark-red folds and two broad tails pointing to viewer-left, neckline attachment at its upper-right. Paint the entire cape with no character in front.
Row3 col2: ONLY original thick black PONYTAIL tied with small gold band at its lower-right attachment, flowing to upper-left. NO face or main head.
Row3 col3: ONLY original katana with gold circular guard, dark wrapped handle on left and long silver curved blade extending to right; detached weapon on slight down-right diagonal. Entire sword including handle pommel and tip, no hand.
Keep every part recognizable and consistent with the same original character. Strict spatial assignment. No annotations, labels, border, guides, shadows, background, or extra objects. True transparent background. Not a contact sheet of full characters.

