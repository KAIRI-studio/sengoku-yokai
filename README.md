# せんごく ようかい 合戦 — Ver.1.1.8

小学3〜6年生向けの、社会クイズと戦国武将・妖怪の横スクロール合戦ゲーム。スマートフォンは横向き。通常攻撃は自動、必殺技は手動。PWA対応。

## 社会クイズ

- 「小学3・4年生の もんだい」「小学5・6年生の もんだい」の2コース。各24問、1回5問。
- 両コースとも、漢字は小学3年生までの簡単なものに絞り、専門用語・歴史上の人名はひらがなで表示。
- 1問正解で20こばん。文部科学省の学習指導要領解説を参考にした独自問題。公式の試験問題ではない。参照先は各問で確認可能。
- 既存のこばん、編成、クリア状況、クイズ途中の記録を保持。

## CASTOR掲載時の表記

紹介カードやゲーム一覧には **「小学3年生〜6年生向け」** と明記する。現時点ではCASTORへの新規掲載は行っていない。

## 開発・確認

`python3 -m http.server 8000` で起動。`node --test tests/quiz-v113.test.mjs tests/faithful-v054.test.mjs` で検証。

タイトル背景は固定。カーソル追従と背景全体の移動を廃止。雲を背景から分離した透過スプライトとしてCanvasで描画し、速度の異なる雲を空だけに流す。ロゴの浮遊幅は約1.4cqw、周期4.8秒。動きを減らす設定に対応し、非表示のときは描画を停止する。

雲なし背景と雲スプライトは、組み込み画像生成で既存タイトル画像を参考に制作。プロンプトの要旨：元の構図とキャラクターを保持して雲だけを除去／同じ画風のアイボリー色の雲を単体透過画像として作成。素材：`assets/title-scene-v114.webp`、`assets/title-cloud-v114.png`。

## Ver.1.1.5 の仕上げ

- 「でれるよ！」「ひっさつ」の画像は維持。カード内のレアリティ・顔・名前・状態表示・コスト/ゲージを分離。
- 一時停止ボタンを独立SVGに変更し、素材集の周囲が混入する問題を解消。
- 幅900px以下は文字の最低サイズを設定し、編成一覧を3列に変更。クイズは案内役の余白をなくして本文を拡大。
- 初回合戦の3ステップ案内中は戦闘を停止。出撃する顔への案内を表示し、一時停止画面から再確認可能。
- タイトルでは戦闘画像を読み込まず、選択した編成・ステージの敵・召喚される敵だけを出陣時に読み込む。失敗時は再試行できる。
- PWAの事前保存を約17MiBから約1MiBの基本部分へ縮小。使った画像を随時保存し、以前の画像キャッシュを引き継ぐ。
- 全解放設定とゲーム進行の保存キーは維持。BGM・効果音は未対応。

スマホ表示の確認用：`tests/responsive-preview.html`（844×390のiframe）。

## Ver.1.1.8

「でれるよ！」「ひっさつ」は、組み込み画像生成で横長の専用イラスト文字へ作り直した。元の青・金／赤・金を保ち、背の高い飾りを外して枠いっぱいに配置。プロンプト要旨：正確な日本語一行、幅5:高さ1の浅い表示枠、文字主体、透過背景、余白2%以内。素材：`assets/deploy-lettering-v118.webp`、`assets/skill-lettering-v118.webp`。

出撃後の専用枠は必殺技ゲージとして使用し、発動可能になるとイラスト文字に切り替える。下段にはHPバーのみを表示。必殺技のない出撃済み武将は「こうげき中」を表示する。

タイトルの主要案内と操作文字を14〜20px、ゲーム中の主な操作・本文も優先して拡大。雲の速度は従来の1.5倍。全解放設定を維持し、BGM・効果音は未対応。

必殺技オート：戦闘上部および一時停止メニューでON/OFF切替。初回はOFF。設定は進行データと別のキーで保存。ONでは敵の射程・満タン・生存・カットイン中の条件をエンジンで確認し、1人ずつ自動発動する。手動タップも継続して利用可能。

味方18体の出撃上限に達したとき、未出撃カードに「これ以上 でれない」を表示。味方が減ると通常表示へ戻る。

## v1.1.9
自動出撃は初期OFF・設定保存。武将→あしがるの順で巡回し、次の候補のおこめを確保。待ち時間・味方18体上限・単独武将・カットイン・停止中を尊重。手動操作も併用可能。戦場の味方レジェンドにCanvasで炎・火の粉・足元の光を描画（時間基準、停止中は静止）。

1.1.10: 炎を足元から連続して立ち上る形に調整し、レジェンドの全身を囲む存在感を強化。

## 1.1.11 ホームのレジェンドオーラ
承認済みの輪郭発光とゆるやかな光線をホームの選択中レジェンドに実装。のぶながは黒＋薄紫、けんしん白、ひでよし金、いえやす緑、しんげん赤。通常・レアには表示しない。画面外・非表示時停止、キャラ変更時に破棄、動きを減らす設定では静止。画像読込失敗時は通常イラストを維持。

## 1.1.12 夜の本陣
ホーム用に夜の背景 assets/basecamp-night-v122.webp を新規作成。キャラ背後と足元を紺色にし、灯籠と月を離してオーラの発光を強調。編成欄の文字色も夜背景に調整。
画像制作: built-in imagegen。最終プロンプト: Use case: lighting-weather / stylized-concept. Background-only illustration for an existing children's Japanese Sengoku game home screen. Existing daytime basecamp is the style/layout reference. Professionally art-directed night basecamp, wide 16:9, clean bold simplified 2D illustration, crisp restrained outlines, flat painted planes. Castle and wall on far left, distant hills, shrubs and open courtyard. Deep desaturated navy, indigo and muted teal. Hero zone x25%, y25–85% is quiet, dark, low contrast, no bright objects; dark slate ground. Crescent moon x72%, y15%, sparse upper-right stars. Small warm lanterns at far edges only. Welcoming magical night, no characters, people, UI, letters, watermarks or built-in aura.

## 1.1.13 小さい横画面の文字切れ修正
ステージカードは見出し・報酬・出陣ボタンの高さを確保し、残りに背景画像を収める。クリア表示を画像の右下へ移し、ステージ選択ボタンから分離。下ナビの最低42pxをコンテンツ側にも反映し、ホーム武将が編成文字へ重ならないよう高さを制限。

## 1.1.14 昼背景で映えるオーラ
昼の本陣へ戻し、キャラ背後の背景をわずかに落ち着かせた。全身の外側に各色の濃い縁を描画し、光の芯との明暗差を確保。きらめきは数を抑えて大きくし、濃い細い縁で昼にも見えるようにした。キャラ別配色と文字切れ修正を維持。

## 1.1.15 タイトルキャラの個別アニメーション
背景プレートと透過の5体を別素材にし、WebGLの細分化メッシュで足元を基準に呼吸・マント・構え・妖怪の小さな弾みを個別の周期で描画。雲・ロゴは維持。画面外停止・動きを減らす設定・WebGL非対応と素材読込失敗時の従来静止画フォールバックを実装。
新規素材: assets/title-plate-v125.webp、assets/title-characters-v125.webp。built-in imagegen 使用。
背景プロンプト: Remove only five foreground characters, weapons and their ground shadows from the existing title illustration. Seamlessly reconstruct the courtyard, buildings, river, grass and shrubs, preserving original 16:9 composition, castle, sky, banners, bridge, colors and clean cartoon style. No characters, text, UI or new objects.
キャラプロンプト: Transparent atlas of the same five reference characters: black/gold red-caped Nobunaga with raised sword; red-armored spear-wielding Yukimura; white-hooded blue Kenshin with curved sword; happy green kappa; smiling red oni with yellow hair, tiger shorts and club. Complete unoccluded bodies, reproduce poses/costumes/faces, separate each figure with transparent gutters, no background/floor/shadows/labels, crisp thick-outline flat-color art.

1.1.16: WebGLを使えない環境でもCanvasの三角形メッシュで同じ個別待機動作を描画。

1.1.17: Canvasメッシュの三角形境界を微小に重ね、アンチエイリアスによる細い継ぎ目を解消。

## 1.1.18 タイトル動作の視認性修正
スマホ縮小後にも動きが分かるよう、呼吸・マント・妖怪の弾みを約3倍へ拡大。低フレームレート時にアニメ時間が遅くなりすぎないよう経過時間の上限を調整。GPU初回描画のエラーも検出して新しいCanvasへフォールバック。

1.1.19: タイトル素材の参照先を修正し、公開中のアニメーションが実在する画像へ接続されることをテストで検証。

### v1.1.20
Title characters now use the four battle walking frames and run left to right in a separate foreground lane. Removed mesh deformation. Controls remain clear above the runners.

### v1.1.35
Compact gacha panels fit above navigation. Formation details explain roles, reach, speed, attack intervals and actual special effects. Wrong quiz answers persist by grade band and can be retried in rounds of up to five; a correct answer clears the review item. Stage clear times and counts are saved from this version onward. Existing wallet, teams, ownership, quiz progress and clears use the unchanged save key.

## Ver.1.1.65
- ガチャの右側パネルは移動せず表示。新しいCSS URLで以前のキャッシュも更新。
- 勝利時に次のステージを自動選択して保存。勝利画面から次の合戦へ直接出陣可能。
- 戦闘速度 ×1/×2。シミュレーションは60Hzを維持し、カットイン・勝利演出・画面UIは実時間で表示。
- 専用の祝勝イラストと光・紙吹雪・報酬カウントの勝利画面。
- 敵本陣のHPに応じたひび割れ・欠け・落下する破片。設定が「視差効果を減らす」の場合は静的な損傷のみ。
- 進行データの保存キー、所持キャラ、こばん、出現率は維持。音は今回の対象外。
- 検証: `node --test tests/*.test.mjs`（113件）。画像は組み込み画像生成ツールで作成。プロンプト概要：戦国のちび武将2人とかっぱが金色の城下町で勝利を祝う、文字なしの横長オリジナルイラスト。
