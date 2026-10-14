# よこむき合戦 Ver.0.4.0

画像生成: built-in imagegen / reference: assets/lane-rarity-concept-v1.webp

- assets/lane-units-v040.webp: 8人の独立したキャラ素材、透明背景。原画像1774×887。SVGで各セルを表示。
- assets/lane-field-v040.webp: 戦場背景。生成PNGからWebPへ形式変換。

## キャラ生成プロンプト
Use case: stylized-concept. Asset type: transparent game sprite atlas. Reference image is art direction only: match these simple yet premium chibi Sengoku warriors and yokai, bold dark outlines, bright colors, restrained cel shading, no engraved armor details. Create a precisely evenly spaced FOUR COLUMNS by TWO ROWS sprite sheet, transparent background, 2048x1024 landscape if possible, 8 square cells, each character whole body within own cell with ample 12% padding, all feet at same relative baseline, no overlap across cells, no borders or labels or shadows or effect particles. TOP ROW left to right: 1 cheerful ashigaru spear footsoldier wearing conical dark green hat and simple green/brown armor, facing right; 2 Nobunaga black ponytail black/gold armor red cape sword, facing right; 3 Yukimura red armor red headband with six gold dots, spear, facing right; 4 Kenshin white hood blue armor sword, facing right. BOTTOM ROW left to right: 5 Mitsuhide silver armor silver helmet with small blue bellflower crest, sword, facing right; 6 cute turquoise kappa turtle shell green head dish, facing LEFT; 7 small round red oni one yellow horn tiger pants wooden club, facing LEFT; 8 large red-faced long-nosed white-bearded black-winged tengu black/yellow robe leaf fan, facing LEFT. Each cell contains exactly one separate full character. Approx2.5heads tall, strong attractive expressive faces, cool-cute professional mobile game sprites. Transparent canvas, no scenery no UI no text.

## 背景生成プロンプト
Use case: stylized-concept. Asset type: game background for a horizontal Sengoku versus yokai lane defense game. Reference image art direction only. Create landscape 16:9 clean polished 2D pop cel-shaded environment, simple large shape design and restrained single step shadow, dark brown outlines, bright aqua sky and large rounded blue mountains and rounded green trees, a few distant banners. Left extreme edge Japanese white castle with dark blue roofs and small gold accents occupying leftmost14percent. Right extreme edge a whimsical yokai possessed Japanese temple with purple banners and purple smoke occupying rightmost14percent. Both bases stand on same horizontal sandy ground baseline at88percentdown. Bottom28percent broad pale gold sandy flat fighting lane with only a few large sparse grassclumps near edges. Middle72percent horizontally wide empty usable battlefield with no units, no UI, no bars, no text. Compose bases full visible whole roofs within canvas with 8percent clear sky top. No detailed foliage, no grittytexture, no tiny rubble or fine engravings. Professional rich casualgame illustration from good shapes not excessive rendering. Do not include any characters or faces carved in buildings. No text, no watermark.

## 実装

lane-v040.html / lane-style-v040.css / lane-app-v040.mjs / lane-engine-v040.mjs。
顔カードをタップして出撃。足軽は複数、武将は各1人。通常攻撃は自動。各武将のゲージが100%になると自動で必殺技と0.95秒のカットイン。赤＋金のレジェンド、銀のレアにはCSSで動く光と星、緑のノーマルはエフェクトなし。旧版と編成セーブは維持。

検証: tests/lane-v040.test.mjs で資源、再出撃、重複制限、必殺技、カットイン中の停止、勝敗、ボス、最後まで勝てることを確認。
