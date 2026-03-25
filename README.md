# site_minpaku_arg

都会向け民泊宿サイトを装った Web探索型ARG の静的サイトです。GitHub にそのままアップロードでき、Cloudflare Pages でそのままデプロイできます。

## Cloudflare Pages 設定
- Framework preset: None
- Build command: なし
- Build output directory: なし
- Root directory: リポジトリのルート

## 仕様
- 診断結果は必ず `stay_01` に収束
- `result.html` の宿画像に手が写っている版を使用
- `detail.html?id=stay_01&mode=favorite` で通常表示
- URL の `mode=favorite` を `mode=trap` に変更すると意味反転
- 次の3段階を経ると `詳細ログを見る` が出現
  1. 診断結果画像から詳細へ進む
  2. 詳細ページの赤字注意事項を見る
  3. `mode=trap` に切り替える
- 真相ページは `archive/target_stay_01.html`

探索状態は `localStorage` に保存しています。リセットしたい場合はヘッダーの「探索をリセット」を押してください。

## ダミー画像一覧
- logo_240x80.png
- favicon_32x32.png
- hero_main_1440x900.png
- img_stay01_1200x800.png
- img_stay02_1200x800.png
- img_stay03_1200x800.png
- img_result_stay01_1200x800.png
- img_result_stay01_hand_1200x800.png
- img_thumb_stay01_600x400.png
- img_thumb_stay02_600x400.png
- img_thumb_stay03_600x400.png
- img_room_01_1200x800.png
- img_meal_01_1200x800.png
- img_access_01_1200x800.png
- img_noise_1920x1080.png
- img_overlay_dark_1920x1080.png
- img_archive_bg_1920x1080.png

## 差し替えやすい箇所
- 宿データ: `data/stays.json`
- レビュー文言: `data/reviews.json`
- 診断設問: `data/diagnosis.json`
- 検索結果一覧: `data/search-index.json`
- 画像差し替え: `assets/images/`

## フッター表記
- ©ぺいぽぴー
- ※このWebサイトの内容はフィクションであり、実在の人物・団体とは一切関係がありません。


## 追加修正
- 宿データを3件から6件へ拡張
- stay_04 / stay_05 / stay_06 を追加
- search-index.json も6件化
- 診断結果の固定収束先は stay_01 のまま維持


## 追加演出
- 違和感クリック時に、画面全体の砂嵐オーバーレイを表示
- 中央に「サイトが改変されました。」を血文字風で表示
- オーバーレイはクリックで終了し、その後に次の処理へ進行
- 既存サイトへ再利用しやすいよう `runSiteAlteredOverlay()` を共通関数として追加

## R2 オブジェクトバケット対応
この版では、画像を R2 オブジェクトバケットから読み込めるように修正しています。

### 追加ファイル
- `assets/js/config.js`
- `R2_BUCKET_STRUCTURE.md`

### 使い方
1. R2 バケットに以下のような構成でファイルを配置します。
   - `site_minpaku_arg/assets/images/...`
   - `site_minpaku_arg/data/...`

2. `assets/js/config.js` の `R2_PUBLIC_BASE` を設定します。
   例:
   - `https://assets.example.com/site_minpaku_arg`
   - `https://pub-xxxxxxxx.r2.dev/site_minpaku_arg`

3. 画像だけ R2 に置く場合
   - `R2_PUBLIC_BASE` を設定
   - `USE_R2_FOR_DATA: false`

4. JSON も R2 に置く場合
   - `R2_PUBLIC_BASE` を設定
   - `USE_R2_FOR_DATA: true`

### 読み込み仕様
- 静的なロゴ・ファビコン・ヒーロー画像は `data-r2-src` / `data-r2-href` で切り替え
- 動的な宿画像・サムネイル・ギャラリー画像は `assetUrl()` 経由で切り替え
- JSON は `dataUrl()` 経由で切り替え

### 主な修正箇所
- `index.html`
- `result.html`
- `detail.html`
- `search.html`
- `archive/target_stay_01.html`
- `assets/js/diagnosis.js`
- `assets/js/result.js`
- `assets/js/detail.js`
- `assets/js/search.js`

### 注意
- 画像だけを R2 に置く場合は CORS を気にせず運用しやすいです。
- JSON も別ドメインの R2 から `fetch()` する場合は、R2 側の CORS 設定も確認してください。
