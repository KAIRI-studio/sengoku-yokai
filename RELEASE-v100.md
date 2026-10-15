# Ver.1.0.0 — Five-stage campaign

- Five sequential stages with persistent unlocks and rewards: 120 / 160 / 200 / 250 / 320 coins.
- New warriors: Shingen, Hideyoshi, Ieyasu, Masamune, Motonari, Yoshihiro, Hanzo, Kanbei, Toshiie, Naomasa.
- Roster: 5 Legend, 7 Rare, 4 Normal including the permanent Ashigaru.
- Gacha: 15 warriors; category rates 10% Legend / 35% Rare / 55% Normal. Equal probability within each category. 100 coins per pull; duplicates return 30 coins.
- New yokai: blue oni, crow tengu, small spider, giant kappa, oni captain, earth spider and Shuten Doji. Existing tengu is the third boss.
- New combat roles: long-range archery, guard, weakening, boss splash and summoned reinforcements. Manual specials remain range-gated.
- Save key remains `sengoku-yokai-progress-v070`; existing coins, owned warriors and formation are preserved. Old victories unlock stage 2.
- Verification: roster/rates, migration, persistence, stage locking, reward values, skill range/guard and automated campaign battles. The expanded formation can clear all five stages; the starter formation clears stages 1–3 under automated play.

## Original art

Created with the built-in image generation tool. 17 transparent sprite sheets, 10 derived portrait crops and 4 battlefield backgrounds are in `assets/*-v100.webp`.

Sprite prompt direction: original pop/simple chibi Sengoku game art; bold dark outlines, flat color, about 2.5 heads tall, full body and complete weapon; exactly four columns by two rows; top row four walking poses, bottom row windup/preparation/attack/idle; transparent background; warriors facing right, yokai facing left; no lettering or fine texture. Character identifiers: red/white-maned war-fan Shingen; golden sunburst Hideyoshi; green heavy-armored Ieyasu; navy crescent and eye-patch Masamune; green/ivory archer Motonari; purple heavy-sword Yoshihiro; indigo ninja Hanzo; black/gold war-fan Kanbei; gold/red long-spear Toshiie; crimson fast-spear Naomasa. Yokai: blue club oni, black crow fan-user, round purple spider, giant green kappa, red armored oni captain, purple/orange earth spider, purple-haired red demon Shuten.

Background direction: original wide 16:9 pop Japanese fantasy battlefield, clean shapes and simple lighting, friendly castle at left and enemy gate at right; bottom 38% clear sandy battle lane, no units/UI/text; themes mountain pass, lush tengu forest, glowing cavern and red sunset demon castle.

Mechanical processing: alpha bounding-box/component extraction and common-baseline packing, preserving full weapons; resized WebP backgrounds and upper-body portrait crops. Source sprite generation includes eight poses; Shuten's two overlapping lower poses use its complete windup/idle frames to avoid neighboring art contamination.
