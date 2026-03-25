# R2_BUCKET_STRUCTURE

推奨構成は以下です。

site_minpaku_arg/
  assets/
    images/
      ...画像ファイル
  data/
    diagnosis.json
    reviews.json
    search-index.json
    stays.json

## 推奨公開URL
- 本番: `https://assets.example.com/site_minpaku_arg/...`
- 開発: `https://pub-xxxxxxxx.r2.dev/site_minpaku_arg/...`

## このサイトで想定している読み込み方
- 画像: R2 から読み込み
- JSON: 初期設定では Pages 側から読み込み
- `assets/js/config.js` の `USE_R2_FOR_DATA` を `true` にすると JSON も R2 から読み込み

## 実際のオブジェクトキー候補
- site_minpaku_arg/assets/images/favicon_32x32.png
- site_minpaku_arg/assets/images/hero_main_1440x900.png
- site_minpaku_arg/assets/images/img_access_01_1200x800.png
- site_minpaku_arg/assets/images/img_archive_bg_1920x1080.png
- site_minpaku_arg/assets/images/img_meal_01_1200x800.png
- site_minpaku_arg/assets/images/img_noise_1920x1080.png
- site_minpaku_arg/assets/images/img_overlay_dark_1920x1080.png
- site_minpaku_arg/assets/images/img_result_stay01_1200x800.png
- site_minpaku_arg/assets/images/img_result_stay01_hand_1200x800.png
- site_minpaku_arg/assets/images/img_room_01_1200x800.png
- site_minpaku_arg/assets/images/img_stay01_1200x800.png
- site_minpaku_arg/assets/images/img_stay02_1200x800.png
- site_minpaku_arg/assets/images/img_stay03_1200x800.png
- site_minpaku_arg/assets/images/img_stay04_1200x800.png
- site_minpaku_arg/assets/images/img_stay05_1200x800.png
- site_minpaku_arg/assets/images/img_stay06_1200x800.png
- site_minpaku_arg/assets/images/img_thumb_stay01_600x400.png
- site_minpaku_arg/assets/images/img_thumb_stay02_600x400.png
- site_minpaku_arg/assets/images/img_thumb_stay03_600x400.png
- site_minpaku_arg/assets/images/img_thumb_stay04_600x400.png
- site_minpaku_arg/assets/images/img_thumb_stay05_600x400.png
- site_minpaku_arg/assets/images/img_thumb_stay06_600x400.png
- site_minpaku_arg/assets/images/logo_240x80.png
- site_minpaku_arg/data/diagnosis.json
- site_minpaku_arg/data/reviews.json
- site_minpaku_arg/data/search-index.json
- site_minpaku_arg/data/stays.json