# Animation frame isolation, v1.1.67

The shared atlas rectangles included disconnected fragments from neighboring poses. Yoshihiro's walking frames contained thin slivers; attack frames also included a neighboring cape and sword. Similar contamination appeared in other allied and enemy atlases.

## Scope

- Audited 26 characters × 8 frames = 208 production frames.
- Added reviewed exclusions to 44 frames across 17 characters, including one-pixel remnants.
- Kept all original atlas files unchanged. Main body rectangles, anchors, feet, scale and facing remain identical to `motion-meta-v100.json`.
- Preserved intentional cross-cell weapon/foot extensions and restored the original pixels across their seven/eight-pixel crop gaps.
- Each frame is copied to a private transparent canvas with two pixels of padding and cached by source image, metadata and frame. The battlefield scales that canvas rather than sampling a crowded atlas rectangle.
- Exclusions are disjoint scanline windows; they never erase retained component cores. Unlike overlapping even-odd clipping rectangles, they cannot accidentally reveal a previously excluded fragment.

## Validation

- All 208 frames rendered using the production `sprite-frames-v183.mjs` helper and visually reviewed.
- Pixel regression compares the original retained rendering with the corrected rendering; every pixel outside reviewed exclusions remains identical.
- Known Yoshihiro remnants are explicitly tested for alpha zero.
- A synthetic adjacent-color atlas verifies that fractional scaling cannot sample a neighboring frame.
- Full 125-test suite passed. Gameplay, balance, progress storage and audio are unchanged.

The browser inspection page is `tests/sprite-frames-v183.html`; it uses the same frame renderer as the game and does not touch saved progress.
