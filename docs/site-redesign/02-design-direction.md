# Phase 2 — デザイン方針(3 案生成と採点)

## 案 1: REGISTER — 校正された計測器

- **定義**: サイト全体を「ズレを検出して正位置にスナップする計測器」として振る舞わせる。既存の Instrument 言語(計測グリッド・罫線・HUD)を継承し、モーションと質感で「1px のズレが、見える」という中心テーゼを体験そのものに変換する。
- **カラー**: 基調 cyan `#00d7ff` / 背景 `#080910` / テキスト `#f4f6fb` / 補助テキスト `#a7afc4` / アクセント(警告・差分)pink `#ff456d`。計 5 色。
- **タイポグラフィ**: Display = Syne(自己ホスト woff2 / Latin サブセット)、UI ラベル = JetBrains Mono、日本語 = Noto Sans JP(Google Fonts の CJK サブセット配信)。すべて無料。
- **レイアウト原理**: グリッド基調(計測グリッドを可視化した罫線エディトリアル)。
- **モーション言語**: 「版ズレ → スナップ」。文字は色収差を帯びて misregister した状態から `cubic-bezier(.16,1,.3,1)`(snap)で正位置に整列する。基準デュレーション 0.7s、スタッガー 0.02s/文字。Lenis の慣性 + ScrollTrigger 入場。

## 案 2: GRAPH PAPER — 製図台の上

- **定義**: 方眼紙・製図台のメタファーによるライトエディトリアル。紙の上でデザインカンプを検図する体験。
- **カラー**: 基調 vermilion `#e8452c` / 背景(紙)`#f5f3ec` / テキスト `#17191f` / 補助 `#5c6066` / 方眼線 `#d8d4c8`。
- **タイポグラフィ**: Display = Fraunces、ラベル = IBM Plex Mono、日本語 = Zen Kaku Gothic New(いずれも Google Fonts、無料)。
- **レイアウト原理**: エディトリアル型(余白広めの誌面組み、朱書きの校正記号モチーフ)。
- **モーション言語**: 紙めくり的な clip-path リビール + 朱線の描画。ease-out-quart、0.8s。

## 案 3: MISREGISTER — 印刷の版ズレ

- **定義**: 印刷の版ズレ(misregistration)を主役にしたブルータリズム。RGB チャンネル分離した超大型タイポグラフィが衝突するポスター的構成。
- **カラー**: 基調 acid `#c8ff00` / 背景 `#0a0a0a` / テキスト `#f2f2f2` / 版ズレ用 magenta `#ff2fd2` / cyan `#00e5ff`。
- **タイポグラフィ**: Display = Archivo Black、ラベル = Space Mono、日本語 = Shippori Antique(無料)。
- **レイアウト原理**: 脱グリッド浮遊型(要素の重なり・対角流れ・グリッド破り)。
- **モーション言語**: 常時ゆらぐ色収差 + 荒いカット的トランジション。steps() 混在、0.4s。

## 採点(各 5 点満点)

| 基準 | 案1 REGISTER | 案2 GRAPH PAPER | 案3 MISREGISTER |
|---|---|---|---|
| (a) 対象ユーザー・業種トーン整合 | **5** 開発者ツール/計測器トーンに直結 | 4 検図メタファーは適合するが柔らかすぎる | 3 ポスター的で実務ツールの信頼感を損なう |
| (b) 情報伝達の明瞭さ | **4** 装飾は罫線と余白で情報を阻害しない | **5** 紙面組みは最も読みやすい | 2 常時ノイズが理解を阻害 |
| (c) 既存ブランド資産整合 | **5** 既存 cyan・アイコン・ダークな製品 UI スクリーンショットと完全整合 | 2 ダークな製品画像が紙面上で浮く。アクセント色も置換になる | 3 ダーク基調は合うが acid/magenta は新規の主張色(判断規則 2 に抵触) |
| (d) 実装・保守コスト | **5** 既存資産(トークン・部品・QA 済レイアウト)を継承 | 2 全ページの視覚層を書き直し | 2 同左 + 演出の保守コスト大 |
| (e) 既視感の回避 | 3 ダーク開発者 LP は定番構文(独自部品で補う) | 4 | **5** |
| **合計** | **22** | 17 | 15 |

## 採用: 案 1「REGISTER」

採用理由: 合計最高。(e) の弱点は、テーゼ直結のシグネチャモーション(文字単位の版ズレ→スナップ整列、drift-title ゴースト)とグレイン質感の導入で汎用ダーク LP と差別化して補う。判断規則 2(既存ブランド色をアクセントとして継承し新規の主張色を追加しない)にも唯一適合する。

## 採用トークン(CSS 変数、`docs/base.css` に定義)

```css
/* 色(継承) */
--bg:#080910; --surface:#11131d; --surface-2:#191c29;
--line:#2b3042; --line-strong:#454c66;
--text:#f4f6fb; --muted:#a7afc4; --quiet:#737d98;
--cyan:#00d7ff; --cyan-soft:#123342; --pink:#ff456d; --ink:#031319;

/* タイポグラフィ(新規にトークン化) */
--display:"Syne",…; --mono:"JetBrains Mono",…; --body:system-ui,…;
--fs-hero:clamp(4rem, 7.6vw, 8rem);      /* 見出しはビューポート連動 */
--fs-h2:clamp(3.5rem, 8vw, 7.875rem);
--fs-h3:clamp(2.75rem, 5vw, 4.875rem);
--fs-lead:clamp(1.0625rem, 1.4vw, 1.3125rem);
--lh-display:.86; --lh-h2:.88; --lh-body:1.7;
--ls-display:-.06em; --ls-mono:.08em;
/* 日本語: html[lang=ja] で palt 適用(見出し・本文とも。判断は 3-2 参照) */

/* モーション */
--ease-snap:cubic-bezier(.16,1,.3,1);
--ease-out:cubic-bezier(.25,.8,.3,1);
--dur-fast:.15s; --dur-base:.6s; --dur-slow:.9s;

/* 形状・質感 */
--radius:0px;                  /* 計測器 = 直角。全コンポーネント共通 */
--border-w:1px;
--shadow-panel:0 24px 80px rgba(0,0,0,.5);
--grain-opacity:.05;           /* SVG feTurbulence グレイン */
```

- 見出しの `font-feature-settings: "palt"`: **適用する**(既存実装を維持)。Noto Sans JP はプロポーショナルメトリクスの品質が高く、ディスプレイサイズの JA 見出しではベタ組みの字間が明確に緩んで見えるため。判断根拠として記録。
- 実装優先順(3-3-1): 対象ブラウザ規則(Chrome/Safari/Firefox/Edge 直近 2 メジャー)では Firefox の CSS scroll-driven animations が安定版で未達のため、スクロール連動リビールは **GSAP + ScrollTrigger**(自己ホスト、動的読込)で実装し、Lenis と raf 同期する。
