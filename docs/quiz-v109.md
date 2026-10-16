# 社会クイズ（Ver.1.0.9）

ホームとガチャ画面から開始。やさしい24問（地図・くらし）／ふつう24問（地理・産業・歴史・政治）。コース内から重複なしの5問を選び、選択肢の順番も毎回変更。直前の5問は次の同コース出題から除外する。

1問正解で20こばん、5問で最大100。間違えても減らず、制限時間なし。正誤と短い解説を表示する。何度でも挑戦でき、結果からガチャへ進める。

既存の保存キーを維持し、回答と報酬を同じ保存処理で記録する。途中で閉じても次の未回答問題から再開。ラウンドIDと回答数で古い回答・連打による二重加算を防ぐ。記録領域を利用できないブラウザでは保存不能を表示する。クライアント内ゲームのため、改造防止や端末間同期を提供するものではない。

問題文・選択肢・解説は本ゲーム向けに作成。小学校の社会で扱う基礎的内容を選定したもので、教科書準拠や学年別の完全な出題範囲を保証するものではない。漢字に読みを併記し、難易度はテーマで分ける。

編集時に参照した公的資料：
- 国土地理院「方位」 https://www.gsi.go.jp/KIDS/KIDS03.html
- 国土地理院「地図記号」 https://www.gsi.go.jp/KIDS/KIDS05.html
- 農林水産省「お米」 https://www.maff.go.jp/j/kids/kodomo_kasumi/2026/juku/content/kome.html
- 国土交通省 信濃川河川事務所「信濃川のデータ」 https://www.hrr.mlit.go.jp/shinano/shinanogawa_info/naruhodo/data.html
- 国土交通省 琵琶湖河川事務所 https://www.kkr.mlit.go.jp/biwako/index.html
- 参議院キッズページ「国会のしごと」 https://www.sangiin.go.jp/japanese/kids/html/shikumi/shigoto.html
- 参議院キッズページ「国のしくみ」 https://www.sangiin.go.jp/japanese/kids/html/shikumi/index.html

検証：`node --test tests/quiz-v109.test.mjs`
