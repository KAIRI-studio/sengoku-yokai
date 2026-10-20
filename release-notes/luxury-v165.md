# Presentation pass: restore checkpoint

Before this change: Ver.1.1.54.
Checkpoint branch: restore/pre-luxury-v1.1.54
Checkpoint commit: 03bb76fbf8af8d1fbcba6c32e6621dc8230c9338

Restore by publishing the checkpoint tree as a new commit on main, preserving history. Bump the shell cache version in sw.js and the visible version in index.html for a reliable PWA update. Keep the checkpoint entry module and stylesheet paths. Do not erase localStorage or change the existing progress key.

Changes: brief page entrances; summon charge and rarity reveal; hero-specific legend aura in recruitment; victory hold/banner and reward counter; shared control materials and contact shadows. No change to summon odds, costs, awards, combat damage, save keys, test unlocks, audio, or background ground registration.

Verification: tests/ceremony-preview.html uses the same rewardContent, particles and aura renderer as actual recruitment. It does not roll the gacha, modify saves, or award coins.
