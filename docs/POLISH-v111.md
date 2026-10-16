# Ver.1.1.1 visual polish

- Sixteen separate transparent full-body menu illustrations replace enlarged animation cells in home, formation and gacha results. Each asset is 1254×1254; all headwear, weapons and feet remain visible. Card portrait crops are unchanged.
- Shared cream/forest/gold UI treatment for buttons, battle card frames and resource panels. HP green, special yellow, deployment blue remain distinct. Larger labels sit beside bars rather than inside the fill.
- Formation statistics and helper labels enlarged; roster cost duplication replaced by skill availability; selected detail keeps full costs and statistics. Opaque detail panels improve readability over background.
- Nobunaga joins quiz introduction, questions, feedback and result. Three coins animate into the earned-koban area after a correct answer; respects reduced-motion preference. Viewing source information again does not replay the award.
- All 48 sets of distractors reviewed to replace unrelated joke answers with related terms. Two prompts clarified. Canonical correct choices, question IDs and source-page metadata retained so current rounds and saves remain valid.

Validation: `node --test tests/quiz-v111.test.mjs` (10 cases). Existing owned roster, team, coin balance, clear progress and current v110 quiz sessions are retained.

Illustration generation: built-in image_gen, one identity-preserving call per character. Source sprite sheets are reference images; original battle sprites are unchanged. Asset mapping/dimensions/alpha bounds are in standing-assets-v111.json.

## Final prompt set

Common prompt: one high-resolution, transparent, full-body menu standing illustration of the same referenced character; one figure only, planted confident idle pose, three-quarter facing right, 2.5-head chibi proportions, clean thick black outlines, simple pop colors, restrained cel shading, no floor/shadow/background/text/frame/effects; preserve face, colors, costume and weapons; keep headwear, weapon tips and both feet within the image with clear padding; square 1024 or larger.

Identity constraints by reference:
- ashigaru: conical black/gold hat, cream headcloth, blue armor, brown spear.
- nobunaga: black high ponytail, gold tie, black/gold armor, red cape and waist belt, silver katana.
- yukimura: brown spiky hair, red headband with six gold circles, red/gold armor, red spear.
- kenshin: white hood and scarf, amber eyes, blue/gold armor, white trousers, katana.
- mitsuhide: silver hair and armor, purple eyes, blue flower head ornament, blue cloth, katana.
- kazutoyo: green/gold crescent helmet, green/cream armor, brown spear.
- shingen: older white-bearded man, red/gold horned helmet, white mane, four-diamond crest and command fan.
- hideyoshi: gold sunburst helmet, gold armor, white/gold cape, flower-topped staff.
- ieyasu: stocky mustached man, green/gold helmet and armor, white waist knot, spear.
- masamune: navy/gold armor and crescent helmet, right-eye patch, two lowered katana.
- motonari: green/ivory tall helmet with three dots, green eyes and hair, bow and quiver.
- yoshihiro: mature black beard/topknot, charcoal/gold armor, purple cloth/rope, large curved sword.
- hanzo: navy tied hair, purple eyes, indigo mask/scarf and ninja clothing, lowered short sword.
- kanbei: black/gold strategist helmet and coat, white collar, black fan with gold flower.
- toshiie: tall pointed gold helmet, red/orange/gold armor, long spear.
- naomasa: red/gold horned helmet with six circles, red armor/scarf, short spear.
