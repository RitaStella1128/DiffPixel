# Phase 0 — プロジェクト調査(インベントリ)

調査日: 2026-07-02 / ブランチ: `redesign/instrument-philosophy`

## 1. プロダクト定義

抽出元: `README.md`, `manifest.json` + `_locales/{en,ja}/messages.json`, `STORE_LISTING.md`, `docs/llms.txt`, 既存 LP (`docs/index.html`), `CHANGELOG.md`

| 項目 | 内容 |
|---|---|
| プロダクト名 | DiffPixel(Chrome / Microsoft Edge 拡張機能、Manifest V3、v1.0.7) |
| 対象ユーザー | ビジュアル QA を行うフロントエンド開発者・Web デザイナー(実装とデザインカンプの照合作業者) |
| 解決する課題 | 「ほぼ合っているが微妙にズレている」実装の検証。ブラウザ・デザインツール・画像ビューア間の往復をなくし、実装ページ上で参照画像と直接比較する |
| トーン(業種的性格) | 開発者ツール / 計測器的な精密さ。誇張のない実務的トーン。「1px のズレが、見える」が中心テーゼ |
| 価格・条件 | 無料、アカウント不要、完全ローカル動作(画像・設定を外部送信しない、アナリティクスなし) |
| 言語 | 英語 + 日本語(拡張 UI・サイトとも両言語) |

主要機能(README / llms.txt / ストア文言から抽出、7 件):

1. ローカル参照画像のオーバーレイ(ファイル選択 / ドラッグ&ドロップ / ペースト)
2. 複数レイヤー管理(表示 / ロック / 反転 / 一括削除)
3. 8 種のブレンドモード(Difference 等)による差分可視化
4. 不透明度・X/Y 位置・スケールのピクセル単位調整
5. ピクセルグリッド表示(間隔調整可)
6. サイト単位のローカル設定保存・パネル自動復元
7. キーボードショートカット、ライト / ダークパネルテーマ、EN/JA UI

## 2. 技術スタック

- フレームワーク: **なし(素の HTML + CSS + JS)**。ビルド工程なし。
- CSS 手法: プレーン CSS + CSS 変数トークン(`docs/base.css` に集約)。
- パッケージマネージャ: なし(`package.json` 不在)。npm 依存ゼロ。
- デプロイ: GitHub Pages(`docs/` がサイトルート。`https://ritastella1128.github.io/DiffPixel/`)。CI なし。
- ランタイム制約: 静的配信のみ。ローカル確認は `.claude/launch.json` の `docs-site`(python3 http.server :4173)。
- フォント: Syne / JetBrains Mono を `docs/fonts/*.woff2` で自己ホスト(Latin サブセット、`font-display: swap`)。Noto Sans JP は Google Fonts CDN(CJK サブセット配信)。

## 3. 既存サービスサイト

**存在する。** `docs/` 配下、3 ページ + リダイレクタ:

| ページ | 役割 |
|---|---|
| `index.html` | LP。Hero(diff スライダー)/ Workflow(3 ステップ sticky)/ Capabilities / Privacy / Closing CTA / Footer。EN/JA を `[data-lang-panel]` で切替 |
| `manual.html` | 操作マニュアル(6 章のエディトリアル構成) |
| `privacy.html` | プライバシーポリシー(EN/JA 同一ページ) |
| `privacy_ja.html` | `privacy.html#ja` への meta refresh リダイレクタ |

補助: `sitemap.xml`, `llms.txt`, JSON-LD(WebSite / WebPage / SoftwareApplication)。

コンポーネント / JS:

- `base.css` — トークン、@font-face、計測グリッド背景、ヘッダー / フッター / ボタン、シグネチャ部品(`.drift-title`, `.hud-meta`, `.diff-seam`, `.snap-in`)
- `home.css` / `editorial.css` — ページ固有レイアウト
- `index.js` — 言語切替、diff スライダー、workflow sticky 状態、ヘッダースクロール
- `editorial.js` — マニュアル / プライバシーの言語切替・章ナビ
- `motion.js` — IntersectionObserver による drift-title / snap-in 入場(現状 `index.html` のみ読込)

既存デザイントークン: 背景 `#080910`、面 `#11131d`、テキスト `#f4f6fb`、アクセント cyan `#00d7ff`、副色 pink `#ff456d`(note 用)。Display: Syne 700–800 / Mono: JetBrains Mono / JA: Noto Sans JP。角丸 0(直角)、罫線 `#2b3042`。

既存アニメーション: drift-title(ゴーストレイヤーが正位置にスナップ)、snap-in 入場、workflow フレームの clip-path 切替、diff スライダー(clip-path)。スムーズスクロールは CSS `scroll-behavior: smooth` のみ。テキスト分割・スタッガー・Lenis/GSAP は未導入。

画像アセット: 実プロダクトのスクリーンショット `home-add/align/difference.webp`(1440×900)、`hero-panel.png`、`step-1/2.png`、`diff-result.png`、アイコン各種。ダミー画像なし。

## 4. 制約

- CI / Lint / a11y 検査 / パフォーマンスバジェット: **なし**(リポジトリに設定ファイル不在)。手動 QA 記録が `design-qa.md` と `audit/` に存在。
- ブランドガイドライン: 明文化されたものは**なし**。事実上のブランド資産 = 拡張アイコン(`icons/`)+ 既存サイトの cyan `#00d7ff` アクセント + Syne ワードマーク。
- **拡張機能本体は `docs/` 内のファイルを一切参照しない**(grep で確認。参照は GitHub Pages の公開 URL のみ)。`docs/` はサイト専用であり、変更してよい。逆に `background/`, `content/`, `_locales/`, `manifest.json`, `icons/` は本体資産のため変更禁止(サイトはアイコン PNG を読み取り参照するのみ)。
- 未コミットの作業ツリー: 本ブランチには「Instrument Philosophy」再設計(`design-qa.md` に QA 記録あり、final result: passed)が未コミットで存在する。本作業はこの作業ツリーを「既存サイト」として扱う。

## 5. 不明項目

- 対象ブラウザの明示指定: 不明 → 判断規則 3(Chrome/Safari/Firefox/Edge 直近 2 メジャー)を適用。
- 実績・導入数などの信頼要素: 抽出不能(ストア公開済みだがレビュー数等の検証可能なデータなし)→ 捏造せず、技術的裏付け(ローカル動作・権限の最小性・OSS)のみ使用。
