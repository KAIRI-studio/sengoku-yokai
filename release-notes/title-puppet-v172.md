# Nobunaga: original-art proportions and constrained forward salute (v172)

## Files and scope

- Preview: `tests/title-puppet-preview.html` (also `tests/title-puppet-check-v171.html`)
- Renderer: `tests/title-puppet-v172.mjs`
- Shared rig math: `tests/title-salute-rig-v172.mjs`
- Regression checks: `tests/title-salute-v172.test.mjs`
- Original: `assets/standing-nobunaga-v111.webp`
- Fill beneath the moving arm/blade: `assets/title-nobunaga-underarm-v171.webp`
- Matched arm, hand and katana: `assets/title-nobunaga-arm-v171.webp`
- Assets created with built-in image generation, then mechanically encoded as WebP quality 96 with alpha retained.
- Main game title, service worker and saved progress are unchanged.

## Proportions and rendering

The original image is used directly outside two localized arm/blade masks. The complete head/ponytail/neck region remains original pixels rather than an independently scaled head. Original torso/leg proportions and foot baseline are retained. Generated fill is clipped only to the area under the moving arm and removed blade. The original pauldron remains fixed over the sleeve attachment; hidden black sleeve material fills its socket. Upper-arm and forearm artwork overlap at the elbow band. The hand, handle, guard and blade are one painted forearm part, with no independent weapon rotation.

The movement is a restrained forward katana salute; it does not attempt a fist-above-the-head cheer or full-body acting. The shoulder pivot is at the sleeve socket, not in the chest. Shoulder rotation ranges from +2 to -66 degrees; local elbow adjustment extends the source artwork's existing flexion by up to 15 degrees, without changing its bending side. Source-calibrated anatomical flexion stays about 4–19 degrees. The head/body/feet do not wobble, scale, or rotate.

## Review

The browser comparison shows the exact original on the left and the animated character on the right at the same overall scale and foot baseline. Inspected rest, two raise intermediates, held salute, and return. Large-view control allows inspection of joints and grip. Four numerical regression checks sample the full cycle for elbow direction, connected bone length, blade-ground clearance, and approximate eye-region clearance. Visual inspection remains necessary for artwork/occlusion quality.

## Fill asset prompt

Use case: precise-object-edit. Asset type: hidden background fill layer for original Nobunaga 2D puppet. This is a STRICT OBJECT REMOVAL edit of the supplied original 1248x1248 character, NOT a redesign. Keep canvas size/composition, exact original face/head size, hair/ponytail, cape, torso armor, legs, boots, other arm, colors, outlines, and all positions completely unchanged. Remove ONLY the sword-side arm below its fixed shoulder pauldron (viewer-left arm from under the gold shoulder armor down to the gripping hand), AND remove the ENTIRE katana including pommel, handle, guard, blade. Keep the shoulder pauldron IN ITS ORIGINAL POSITION on the body; paint the hidden red cape/black torso armor behind the removed arm and the legs behind the removed blade coherently. The other small fist at viewer-right stays. Do not invent another hand or replace removed arm. This will be used only as a patch beneath moving original pixels: alignment is critical. No changes to proportions, no bigger head, no shorter legs, no changes to facial expression, no camera/zoom changes. Full original planted character inside same square canvas, true transparent background, no shadows/glow/background.

## Arm asset prompt

Use case: background-extraction. Asset type: faithful transparent cutout of ORIGINAL sword-side arm plus held katana for a 2-joint 2D rig. Extract ONLY Nobunaga's viewer-left arm (his sword arm), from its shoulder armor cap down through the black upper sleeve, gold elbow band, forearm bracer, fingers firmly gripping the katana, and the COMPLETE katana including handle, gold guard, entire long silver blade. Preserve the supplied original's EXACT hand grip, arm pose, limb widths and lengths, armor colors, thick outlines, and sword proportions. Do NOT redraw another arm design or change pose. Remove ALL face, neck, torso, cape, legs, boots, other arm and any background from around and between the arm and weapon. No red cape or black body armor fragments should remain behind the arm or blade. Paint no additional items. Keep the extracted arm/sword at the same size and relative positions within the square 1248x1248 original composition (shoulder around580,610; elbow around525,695; fist around465,840; katana tip around1200,1140). This is ONE bent arm holding ONE sword in the original lowered stance, not a whole character. True transparent background with alpha zero outside the outlined arm-and-sword silhouette, no glow/halo/shadow, no labels.

