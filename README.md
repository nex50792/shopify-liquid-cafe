# shopify-liquid-cafe

Shopify skeleton テーマをベースに、コーヒーショップのストアフロントを実装したテーマ。

Section groups、JSON テンプレート、Custom Elements、metafields を使い、テーマエディタから並び替え・値変更ができる形で、Hero、新入荷商品グリッド、焙煎所紹介、抽出ガイド、定期便コスト試算(インタラクティブ)を実装している。

## 動作確認環境

- Shopify CLI 4.3.0
- skeleton-theme
- Development Store(Shopify Partners)

## 公開 URL

- ストアフロント: https://mame-coffee-tuinlsvp.myshopify.com/
  - Development Store のため、初回アクセス時にストアパスワードの入力が必要
  - **アクセスパスワード**: `rtopre`

## 使用技術

| 項目 | 選定 | 選定理由 |
|---|---|---|
| ベーステーマ | skeleton-theme(Shopify 公式) | ヘッダー・フッター・カート等の骨格のみを持つ公式の最小スタートテーマ。セクションを自由に組める |
| テンプレート形式 | JSON テンプレート(`templates/*.json`) | テーマエディタから section の並び替え・追加・削除が可能。Shopify の現行標準 |
| セクション構成 | Blocks + Presets | 管理画面から要素追加・並び替えが可能、静的セクションより保守性が高い |
| インタラクティブ UI | Custom Elements(Web Components) | 依存ライブラリなし、テーマにネイティブに埋め込める |
| デザイントークン | CSS Variables + settings_schema | テーマエディタから色・フォント・余白を一括変更可能 |
| 商品属性 | Metafields(焙煎度・定期便割引率) | 標準テーブルにない属性を型付きで持たせる公式手法 |
| 多言語対応 | locales(en / ja) + schema locale | 翻訳キーで文言を一元管理、言語追加は差分だけで済む |
| 品質チェック | shopify theme check | Liquid 構文・未使用変数・orphaned snippet を検出 |
| 認証・デプロイ | shopify CLI(OAuth device flow) | 秘密鍵をリポジトリに持たない、公式推奨 |

## 実装した主要機能

### セクション

トップページ(`templates/index.json`)の配置は以下の 5 セクション:

| セクション | 機能 | 採用パターン |
|---|---|---|
| `hero-coffee` | ヒーロー画像 + CTA | 端末幅ごとの画像自動生成、最初の描画を優先読み込み |
| `featured-products` | 新入荷商品グリッド | 指定コレクションの連動表示、未指定時は全商品を表示 |
| `origin-story` | 焙煎所紹介(画像 + 本文、About を兼務) | リッチテキスト編集対応、画面幅に応じて 2 カラム / 1 カラム |
| `brewing-guide` | 抽出手順(順序付きリスト) | 手順番号を「01」「02」形式で自動採番 |
| `subscription-calculator` | 定期便コスト試算(JS 連動) | Web Components で実装、通貨の国際化表示に対応 |

theme editor から追加可能 / 別テンプレートで使用する予備セクション:

| セクション | 用途 | 採用パターン |
|---|---|---|
| `subscription-benefits` | 定期便メリット(要素のブロック管理) | 追加可能なブロック数の上限を設定、初期状態を preset で定義 |
| `testimonials` | お客様の声(カードグリッド) | 画像の遅延読み込み、CSS Grid で横並び |
| `newsletter-coffee` | メルマガ登録フォーム | Shopify 標準のフォーム機構、翻訳キーで文言管理 |
| `custom-section` | フリーレイアウト(ブロックを自由配置) | 2026 で追加された任意ブロックの配置方式 |

### スニペット(4 個)

- `product-card`: 商品カード。画像・タイトル・価格・セール表示・焙煎度バッジを一括描画
- `coffee-badge`: 焙煎度バッジ(浅煎り / 中煎り / 深煎り)。商品の追加属性(metafield)から値を読む
- `subscription-savings`: 定期便割引価格の計算と表示(その商品に定期便設定があるときだけ表示)
- `bundle-price`: 数量に応じたバンドル割引の階層計算(商品の追加属性から段階を読む)

### テンプレート(3 個追加)

- `templates/index.json`: トップページ(5 セクションを並べた初期構成)
- `templates/page.brewing-guide.json`: 抽出ガイドの独立ページ(手順を 5 ステップに拡張)
- `templates/page.subscription.json`: 定期便紹介ページ(メリット + 商品グリッド + お客様の声)

### Web Component(`assets/subscription-calculator.js`)

- `<subscription-calculator base-price="1800" discount="15" currency-code="JPY">` の形で HTML に埋め込み
- 入力(月あたり袋数、配送頻度)に応じて、単品購入との差額をリアルタイム計算
- 通貨表示はブラウザの国際化 API でストア通貨に合わせて自動整形
- 依存ライブラリなし(ブラウザ標準の Web Components のみ)

## リポジトリ構成

```
shopify-liquid-cafe/
├── assets/
│   ├── critical.css               # design tokens ベースの共通 CSS
│   └── subscription-calculator.js # Web Component 実装
├── config/
│   ├── settings_schema.json       # テーマ全体の設定(色/フォント/余白)
│   └── settings_data.json         # 初期値
├── layout/
│   └── theme.liquid               # skeleton 標準(改変なし)
├── locales/
│   ├── en.default.json            # UI 文言(英語)
│   ├── en.default.schema.json     # 管理画面ラベル
│   └── ja.json                    # UI 文言(日本語)
├── sections/
│   ├── hero-coffee.liquid
│   ├── featured-products.liquid
│   ├── subscription-benefits.liquid
│   ├── brewing-guide.liquid
│   ├── testimonials.liquid
│   ├── origin-story.liquid
│   ├── newsletter-coffee.liquid
│   ├── subscription-calculator.liquid
│   └── (skeleton 標準の header/footer/product 等)
├── snippets/
│   ├── css-variables.liquid       # settings → CSS variables
│   ├── product-card.liquid
│   ├── coffee-badge.liquid
│   ├── subscription-savings.liquid
│   └── bundle-price.liquid
├── templates/
│   ├── index.json                 # トップページ(5 セクション配置)
│   ├── page.brewing-guide.json    # 抽出ガイドの独立ページ用
│   ├── page.subscription.json     # 定期便紹介ページ用
│   └── (skeleton 標準の product/collection/cart 等)
├── blocks/                        # skeleton 標準(改変なし)
└── data/
    └── products.csv               # 8 商品 / 9 バリアントの初期データ
```

## 設計判断の要点

- **skeleton 選定**: 骨格のみの最小テーマで、セクションの実装を上に積む形。標準の Dawn テーマと違い、既存セクションの差し替え作業がない
- **Blocks + Presets 前提**: 静的な `<div>` 直書きではなく、schema で block/preset を定義して管理画面から並び替え可能に
- **Custom Elements 採用**: Alpine.js や Vue を持ち込まず、標準 Web API で完結。テーマの JS バンドルサイズを抑える
- **Metafields で属性拡張**: 焙煎度・定期便割引率を metafields に持たせ、商品コアと関心を分離
- **翻訳キー統一**: 日本語追加も `locales/ja.json` の差分だけで済む構造(現状 en / ja の 2 言語対応)
- **shopify theme check クリーン**: 53 ファイル 0 offenses

## 開発環境構築

```bash
# 1. Shopify CLI 導入
npm install -g @shopify/cli

# 2. デベロッパーストア作成(Shopify Partners → Development store)
#    ストア名は自由(このリポジトリでは mame-coffee-tuinlsvp を使用)

# 3. リポジトリ clone
git clone https://github.com/<user>/shopify-liquid-cafe
cd shopify-liquid-cafe

# 4. shopify にログイン
shopify auth login

# 5. Liquid の静的チェック(0 offenses になることを確認)
shopify theme check

# 6. テーマを unpublished でストアにアップ
shopify theme push --unpublished --store <your-store>.myshopify.com --theme "Mame Coffee (dev)"

# 7. 商品初期データを import
#    Admin > 商品管理 > すべての商品 > インポート > data/products.csv を選択

# 8. Admin プレビュー
#    Admin > オンラインストア > テーマ > Mame Coffee (dev) > プレビュー
```

## 参考

- Shopify Themes(公式): https://shopify.dev/docs/storefronts/themes
- Liquid リファレンス: https://shopify.dev/docs/api/liquid
- skeleton-theme: https://github.com/Shopify/skeleton-theme
- Custom Elements(MDN): https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_custom_elements
