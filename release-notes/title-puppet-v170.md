# Puppet neck / elbow / grip correction (v170)

- Preview: `tests/title-puppet-preview.html`
- Active prototype renderer: `tests/title-puppet-v170.mjs`
- New combined forearm, gripping fist, handle and blade: `assets/title-nobunaga-grip-v170.webp`
- Built-in image generation; transparent result mechanically encoded to WebP, quality 96.
- Lowered head by 14 drawing units and shifted it 20 units toward the collar center. The existing front scarf overlaps the neck.
- Elbow now flexes by about 110 degrees during the salute, with less shoulder rotation. The entire grip/weapon drawing inherits the forearm transform, with no independent wrist rotation.
- Main game title and saves are unchanged.

## Final asset prompt

Use case: precise-object-edit. Edit the attached arm-and-sword image. KEEP the firmly gripping fist, katana handle, gold guard, and entire silver sword exactly as drawn and connected. FIX ONLY the arm and unwanted background: remove the entire shoulder pauldron and upper arm at upper-left. Draw ONLY a SHORT FOREARM ABOVE the existing fist, vertically upward from its wrist (not extending diagonally upper-left). Its elbow connection should be directly above the fist at x about 430, y about 270 in the existing 1536x1024 composition. Forearm gold cuff/elbow at top, straight black-and-gold bracer down to wrist, naturally continuous with existing hand. The visible forearm is roughly 250px long and 100px wide, elbow above the hand, no shoulder pauldron. Keep the hand/sword positions absolutely unchanged; no camera changes. Remove EVERY glow/halo/drop-shadow. Everything outside the hard outlined forearm-hand-sword silhouette MUST BE fully transparent alpha zero, including all black-looking background. One continuous cutout only, no text, no labels, no other parts.

