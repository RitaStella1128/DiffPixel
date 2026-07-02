# Phase 4 — 最終報告

作業日: 2026-07-02 / ブランチ: `redesign/instrument-philosophy`

## 作業モードと根拠

**モード B(根本的再設計)**。既存サービスサイト(`docs/` 3 ページ + リダイレクタ、EN/JA)が存在し、情報構造(ページ構成・検証可能な文言)は再利用可能なため、情報を継承して視覚・体験層を刷新した。詳細: [01-diagnosis.md](01-diagnosis.md)

## 採用デザイン方針

**案 1「REGISTER — 校正された計測器」**(3 案採点で 22/25、次点 17)。サイト全体を「ズレを検出して正位置にスナップする計測器」として振る舞わせ、中心テーゼ「1px のズレが、見える」をモーション言語(版ズレ → スナップ)に変換する。採点表・トークン定義: [02-design-direction.md](02-design-direction.md)

## 実装した層

### 3-1 情報設計
- 構成(継承): ヒーロー(実セッションの Overlay/Difference 比較スライダー)→ ワークフロー 3 ステップ → 機能(8 コントロール)→ プライバシー(課題の裏返しとしての信頼要素)→ CTA → フッター。
- 信頼要素は検証可能な事実のみ(ローカル動作・無料・アカウント不要・アップロードなし)。実績数値は抽出不能のため不使用(捏造なし)。
- CTA 導線: ヘッダー CTA をモバイルでも常時表示に変更(従来は 700px 未満で非表示)→ 任意スクロール位置から 1 操作で到達。

### 3-2 タイポグラフィ
- 型スケール・行間・字間を CSS 変数化(`--fs-hero: clamp(4rem, 7.6vw, 8rem)`、`--fs-h2/--fs-h3/--fs-lead`、`--lh-*`、`--ls-*`)。
- 日本語見出し・本文に `font-feature-settings: "palt"` を適用(判断記録: 02 参照)。
- 文字分割時の日本語行頭・行末禁則(、。ー」等)を自前実装(検証中に発見した破綻を修正)。

### 3-3 モーション(新規実装の中核)
- **Lenis スムーズスクロール**: GSAP ticker と raf 同期、`ScrollTrigger.update` 連携。`prefers-reduced-motion: reduce` 時は初期化しない(ライブラリ自体をダウンロードしない)。アンカーリンクは Lenis 経由(スキップリンクはネイティブ挙動を維持)。
- **スクロール連動リビール**: GSAP + ScrollTrigger(自己ホスト、動的読込)。見出しは文字単位の「版ズレ → スナップ」スタッガー、セクション要素は batch stagger、製品フレームに scrub パララックス。
- **テキスト分割**: 自前スプリッタ(Intl.Segmenter、単語/CJK 文字単位 + 禁則)。原文は `aria-label` で保持し、分割スパンは `aria-hidden` ラッパ内。
- **マイクロインタラクション**: リンク下線描画(scaleX)、ボタン背景スイープ(scaleX)+ 矢印ナッジ、カード hover 色相遷移 — すべて `:hover` と `:focus-visible` に同等定義。
- **安全設計**: transform/opacity のみアニメーション。will-change 不使用。隠し状態は `html.has-motion` 配下にのみ存在し、JS 無効 / reduce / ライブラリ読込失敗(catch + 4 秒タイマー)のすべてで全文可読にフォールバック。言語切替時は非アクティブパネルを静的完成状態に確定。

### 3-4 質感
- 採用 4 種: SVG feTurbulence による微細グレインオーバーレイ(全ページ固定)/ ヒーロー背景の多段 radial グラデーション(cyan + pink)/ 罫線エディトリアル分割(diff-seam・計測グリッド、継承強化)/ clip-path 断面リビール(ワークフローフレーム、継承)。
- 影・角丸・ボーダーをトークン化(`--radius: 0`、`--border-w`、`--shadow-panel`)。

### 3-6 アクセシビリティ / 3-7 パフォーマンス
- Lighthouse Accessibility 100(3 ページ)、実使用コントラスト全数 AA 以上、ランドマーク・alt・skip link 完備、装飾要素 `aria-hidden`。
- Lighthouse Performance 98–100(モバイル)、LCP 1.6–2.3s、CLS ≤ 0.005。施策と計測条件: [03-verification.md](03-verification.md)

## 条件付き層の採否

| 層 | 採否 | 根拠 |
|---|---|---|
| WebGL/Three.js ヒーロー | **不採用** | プロダクトは 2D ピクセル計測ツールであり 3D 訴求ではない。スタックはビルドレス静的サイトで導入コスト(保守・フォールバック二重化・~600KB)が便益を上回る。実セッションの比較スライダーの方がテーゼを直接証明する |
| 横スクロールセクション | **不採用** | 系列構造(ワークフロー 3 ステップ)は既存の sticky 積層 + スクロール連動切替が既に担っており、横スクロール化は視差なくアクセシビリティコストのみ追加 |
| ページ遷移演出 | **採用(最小)** | マルチページ構成のため、宣言的な cross-document View Transitions(0.3s フェード)を `prefers-reduced-motion: no-preference` 限定で追加。非対応ブラウザでは自動的に無効(JS・遅延なし) |
| プリローダー | **不採用** | 初回表示は LCP 1.7s と十分速く、遮蔽はテーゼ(即座に差分が見える)に反する |

## 仮定一覧

1. 未コミットの作業ツリー(前回再設計)を「既存サイト」のベースラインとして扱った(作業ツリー = 配信されうる最新状態のため)。
2. 対象ブラウザ = Chrome/Safari/Firefox/Edge 直近 2 メジャー(判断規則 3)。このため CSS scroll-driven animations ではなく GSAP + ScrollTrigger を採用(Firefox 安定版の未対応)。
3. ブランド資産 = 既存 cyan `#00d7ff` + 拡張アイコン + Syne ワードマークとみなし、新規の主張色は追加しない(判断規則 2)。
4. Noto Sans JP は Google Fonts CDN のサブセット配信を継続(CJK 全自己ホストは非現実的、既存の文書化済みトレードオフを踏襲)。非同期読込化で render-blocking は解消。
5. GSAP / ScrollTrigger / Lenis は無料ライセンス配布物を `docs/vendor/` に自己ホスト(外部有料サービス・API キーなし、CDN ランタイム依存なし)。
6. `?motion=force` クエリフラグを QA 用に恒久実装(reduce エミュレート環境でモーションパスを検証するため。通常ユーザーには影響なし)。
7. Lighthouse 計測は keep-alive 静的サーバを本番(GitHub Pages)近似とみなした(python http.server の接続特性はアーティファクトとして記録)。

## 未達項目と残課題

- スクリーンリーダー実機・200%/400% ズーム・Windows High Contrast は未検証(検証環境なし)。
- モーション有効パスの実機目視(プレビューが reduce 固定のため computed style + force フラグで代替検証)。
- CSS/JS は未 minify(ビルドレス方針の保守性優先。Lighthouse 減点なし、gzip は GitHub Pages 側で適用)。
- フォールバックフォントのメトリクス調整(size-adjust)は未実装(既存トレードオフ踏襲。CLS 実測 ≤ 0.005 のため影響軽微)。

## 変更ファイル一覧(本作業分)

| ファイル | 変更 |
|---|---|
| `docs/base.css` | トークン拡張(型/モーション/形状)、グレイン、下線描画・ボタンスイープ、モーションプリステート、smooth-on/View Transitions、レガシー .snap-in 削除 |
| `docs/home.css` | ヒーローグラデーション、型トークン適用、カード hover、モバイル CTA 常時表示、workflow-hud コントラスト修正 |
| `docs/editorial.css` | モバイル CTA 常時表示 |
| `docs/motion.js` | 全面書き換え(Lenis + GSAP 動的読込、文字分割 + 禁則、リビール、パララックス、縮退/失敗フォールバック) |
| `docs/index.js` | 言語切替スクロールの Lenis 対応 |
| `docs/index.html` | srcset/sizes + 応答画像 preload、フォント非同期化、キャッシュバスター更新 |
| `docs/manual.html` / `docs/privacy.html` / `docs/privacy_ja.html` | フォント非同期化、キャッシュバスター更新 |
| `docs/vendor/{gsap,ScrollTrigger,lenis}.min.js` | 新規(自己ホスト) |
| `docs/home-{add,align,difference}-720.webp` | 新規(720w 縮小版) |
| `docs/site-redesign/00〜04-*.md` | 本プロトコルの記録文書 |

(前回セッション由来の未コミット変更 — `axis-rigid.css`/`site.js` 削除、`fonts/` 自己ホスト等 — は `design-qa.md` に記録済みのままブランチに同居)
