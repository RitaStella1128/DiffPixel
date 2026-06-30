# DiffPixel トップページ監査

- 実施日: 2026-06-30
- 対象: `docs/index.html` 英語・日本語トップページ、`docs/manual.html`英語版、`docs/privacy.html`英語版
- 監査モード: UX + アクセシビリティの複合監査
- 基準: 添付された「Awwwards受賞級Webサイトを生む設計哲学」
- 主なユーザーゴール: DiffPixelの価値を短時間で理解し、比較方法とプライバシーを確認したうえでChromeへ追加する
- 撮影環境: Codex in-app Browser、1440 × 900 / 390 × 844

## 総評

中心思想「1pxのズレが、見える。」が、コピー、実製品画像、差分スライダー、限定色、単一CTAへ一貫して反映されている。表層的なAwwwards風ではなく、製品固有の比較行為をHeroの操作へ翻訳できている点が最大の強みである。

一方、モバイル日本語の巨大見出しは語中で分断される。英語版ではさらに、トップのPrivacyマーク、Manual、Privacy Policyがモバイル幅に収まらず、文章と画像の右側が欠ける。Reduced Motion環境でもデスクトップの固定画像とスクロール連動状態が残り、静的な理解へ十分に切り替わっていない。これらは装飾上の微調整ではなく、中心思想の「精密さ」と実装品質を一致させるための優先修正項目である。

## 画面別監査

### Step 01 — Hero / 製品価値の認識

- 証拠: [01-hero-desktop.jpg](./01-hero-desktop.jpg)、[09-hero-mobile.jpg](./09-hero-mobile.jpg)
- 健全性: 良好
- 強み:
  - 一文で価値を説明でき、最初の視線が見出し → 実画面 → CTAへ自然に移る。
  - 実画面2枚の比較スライダーが、説明文より先に製品価値を証明している。
  - CTAはChrome追加へ絞られ、`無料 / 登録不要 / ローカル動作`は小さなメタ情報へ圧縮されている。
  - モバイルでも見出し、CTA、比較画面が順序を保ち、横スクロールは発生しない。
- リスク:
  - モバイルではヘッダーから`デモ / 使い方`が消えるため、再訪時にワークフローへ直接移動できない。
  - 外部Google Fontsへ依存し、Noto Sans JPを6ウェイト読み込む指定は、初回表示のフォント切替と転送量を増やす可能性がある。

### Step 02 — Workflow / 価値の理解

- 証拠: [02-workflow-desktop.jpg](./02-workflow-desktop.jpg)、[03-workflow-step-desktop.jpg](./03-workflow-step-desktop.jpg)、[10-workflow-mobile.jpg](./10-workflow-mobile.jpg)
- 健全性: 要改善
- 強み:
  - `追加 → 整列 → 差分`が製品の実際の作業順と一致する。
  - デスクトップでは一つの製品画面と一つの説明が対応し、状態変化に意味がある。
  - モバイルは固定表示を廃止し、各説明と対応画像を縦積みに再編集している。
- リスク:
  - 監査環境は`prefers-reduced-motion: reduce`だったが、IntersectionObserverと固定画像領域は有効なままだった。動きの時間は短縮されても、スクロール駆動の状態変化自体は残る。
  - デスクトップの章見出しは最初の画面をほぼ占有し、最初の具体的な操作状態が次画面まで現れない。
  - モバイルのワークフロー見出しも約62pxで、説明開始までの距離が長い。

### Step 03 — Capabilities / 機能の把握

- 証拠: [04-capabilities-desktop.jpg](./04-capabilities-desktop.jpg)、[05-capabilities-meta-desktop.jpg](./05-capabilities-meta-desktop.jpg)、[14-capabilities-mobile.jpg](./14-capabilities-mobile.jpg)
- 健全性: 要改善
- 強み:
  - カードを並べず、一枚の製品画面と8項目のメタデータに機能を圧縮できている。
  - 実画面の容量は小さく、視覚密度に対して表示負荷が低い。
- リスク:
  - デスクトップの最初の画面では8項目が画面外にあり、見出しと機能メタ情報の関係が一度切れる。
  - 中間スクロールでは巨大見出しの上部だけが固定ヘッダーの下に残り、意図しない切れ方に見える。
  - モバイルで「パネル」が「パネ / ル」に分割される。日本語の意味単位より文字サイズが優先されている。

### Step 04 — Privacy / 信頼形成

- 証拠: [06-privacy-desktop.jpg](./06-privacy-desktop.jpg)、[15-privacy-mobile.jpg](./15-privacy-mobile.jpg)
- 健全性: 概ね良好、モバイル要改善
- 強み:
  - `LOCAL / ONLY`、日本語コピー、3つの事実が同じ主張を異なる情報密度で補強する。
  - 作品より前に営業をせず、製品理解後に安心材料を置く順序が適切。
  - Privacyページへの導線がある。
- リスク:
  - モバイルで「あなた」が行をまたいで分断されるなど、日本語として不自然な改行が発生する。
  - Privacyリンクの表示高は約17pxで、タップ対象として小さい。

### Step 05 — 最終CTA / 行動

- 証拠: [07-contact-desktop.jpg](./07-contact-desktop.jpg)、[11-contact-mobile.jpg](./11-contact-mobile.jpg)
- 健全性: 良好
- 強み:
  - 製品説明と信頼形成の後にCTAを再提示しており、Hero CTAの単純な重複ではない。
  - 文言が短く、次の行動が一つに限定されている。
- リスク:
  - モバイルでは`closing`の68svhとFooterの46svhが連続し、CTA後の空白が長い。余韻より待ち時間として感じられる可能性がある。

### Step 06 — Footer / 体験の締め

- 証拠: [08-footer-desktop.jpg](./08-footer-desktop.jpg)、[12-footer-mobile.jpg](./12-footer-mobile.jpg)
- 健全性: 良好
- 強み:
  - `DiffPixel`は左右を切らず、下端だけを浅く見切るため誤読しにくい。
  - Manual、Privacy、GitHub、バージョン情報を小さなメタ情報へ退避できている。
- リスク:
  - Footerリンクの表示高は約19pxで、タッチ対象として小さい。
  - モバイルではCTAとワードマーク間の空白が大きく、リンク群の発見が遅れる。

### Step 07 — Language / Interaction / Robustness

- 証拠: [13-language-switch-desktop.jpg](./13-language-switch-desktop.jpg)
- 健全性: 要改善
- 確認できた強み:
  - JA → EN切替時にWorkflow位置を維持した。`scrollY 794 → 799`で、URL、`lang`、タイトルも正しく更新された。
  - 見出し階層は`h1 → h2 → h3`で、重複IDはなかった。
  - 画像はすべて読み込み済みで、意味を持つモバイル画像には代替テキストがある。
  - 主要色の背景`#080910`に対するコントラスト比は、本文18.38:1、補助文9.06:1、quiet 4.84:1、cyan 11.51:1だった。
  - デスクトップとモバイルで横方向のオーバーフローはなかった。
  - コンソールのwarning / errorはなかった。
- リスク:
  - 比較スライダーはShift + 右矢印で`50 → 60`へ変化したが、通常の右矢印では`50`のままだった。1px相当の通常操作が実ブラウザで再現しないため、入力処理を明示実装する必要がある。
  - `aria-valuetext`は日本語表示でも`50 percent`形式になる。
  - 言語ボタンは42 × 38px、Privacyリンクは約123 × 17px、Footerリンクは約46〜65 × 19pxで、タッチ対象として小さい。
  - ページ先頭にスキップリンクがないため、キーボード利用者は固定ヘッダーの操作を毎回通過する。

### Step 08 — English Home / 英語トップページ

- 証拠: [16-hero-english-desktop.jpg](./16-hero-english-desktop.jpg)、[17-workflow-english-desktop.jpg](./17-workflow-english-desktop.jpg)、[18-capabilities-english-desktop.jpg](./18-capabilities-english-desktop.jpg)、[19-privacy-english-desktop.jpg](./19-privacy-english-desktop.jpg)、[20-hero-english-mobile.jpg](./20-hero-english-mobile.jpg)、[21-capabilities-english-mobile.jpg](./21-capabilities-english-mobile.jpg)、[22-privacy-english-mobile.jpg](./22-privacy-english-mobile.jpg)
- 健全性: デスクトップ良好、モバイル要改善
- 強み:
  - 英語でも`See the pixel that drifted.`を中心に、Hero、Workflow、Capabilities、Privacyの情報階層が日本語版と一致する。
  - Syneは製品の精密さよりも強い個性を与えるが、本文には使われず、短い見出しに限定されている。
  - 390pxでもHeroとCapabilitiesは横スクロールを発生させず、CTAと実画面へ到達できる。
- リスク:
  - 英語見出しは横幅の広いSyneを70px前後で使うため、Heroが5行、Privacyが4行になる。読めるが、意味の切り替わりより書体の存在感が勝ちやすい。
  - モバイルPrivacyの`LOCAL`が右端で切れ、`LOCA`に見える状態がある。ブランド演出ではなく誤読につながるクリップである。
  - 英語版でもPrivacyリンクの操作高は小さい。

### Step 09 — English Manual / 英語マニュアル

- 証拠: [23-manual-english-desktop.jpg](./23-manual-english-desktop.jpg)、[25-manual-english-mobile.jpg](./25-manual-english-mobile.jpg)
- 健全性: デスクトップ良好、モバイル不良
- 強み:
  - デスクトップでは見出し、製品画面、章メタ情報の関係が明確で、トップページのアートディレクションを維持している。
  - Hero後に章ナビがあり、長いマニュアルの現在地を把握しやすい。
- リスク:
  - 390px表示でページの`scrollWidth`は671pxまで広がった。
  - Hero内の子要素が最小内容幅で657pxまで拡張し、見出し、本文、メタ情報、製品画像が右側で欠ける。
  - 横スクロールは`body { overflow-x: hidden; }`で隠されるため、欠けた内容へユーザーが到達できない。
  - 章ナビは横スクロール可能だが、その存在がページ全体の欠けと視覚的に区別しにくい。

### Step 10 — English Privacy Policy / 英語プライバシーポリシー

- 証拠: [24-policy-english-desktop.jpg](./24-policy-english-desktop.jpg)、[26-policy-english-mobile.jpg](./26-policy-english-mobile.jpg)
- 健全性: デスクトップ良好、モバイル不良
- 強み:
  - デスクトップでは`Nothing leaves your device.`と`LOCAL / ONLY`が信頼形成を短く明確に担う。
  - ポリシーを長文から始めず、要点 → 章ナビ → 詳細の順にしている。
- リスク:
  - 390px表示でページの`scrollWidth`は486pxだった。Hero内の見出しと本文は437px、本文章は396pxまで拡張する。
  - 見出しと本文の右側が欠け、プライバシー情報を完全に読めない。
  - 主因は1カラム化したCSS Gridのトラックと子要素に`min-width: 0`がなく、Syne見出しなどの最小内容幅がシェル幅を押し広げることにある。

## アクセシビリティ上の確認限界

- スクリーンリーダーによる実際の読み上げ順と発音は未検証。
- 200% / 400%ズーム、Windows High Contrast、音声入力、スイッチコントロールは未検証。
- 色覚特性別の見え方はトークンのコントラスト計算のみで、実機確認はしていない。
- Chrome Web Storeへの遷移後の体験は監査対象外。
- WCAG適合を保証する監査ではない。

## 優先順位

1. P0: 英語Manual / Privacy Policyのモバイル横幅崩れを解消する。
2. P0: 英語トップの`LOCAL`がモバイルで切れないようにする。
3. P0: モバイル日本語見出しの語中改行を解消する。
4. P0: Reduced Motion時はWorkflowを静的な縦積みに切り替える。
5. P1: スライダーの通常矢印キーを明示処理し、`aria-valuetext`を言語別にする。
6. P1: 小さいリンクと言語ボタンの操作領域を広げる。
7. P2: Capabilitiesの見出し・画像・8項目を同じ画面状態で結びつける。
8. P2: モバイルの最終CTAからFooterまでの余白を短縮する。
9. P3: フォントのウェイト数と配信方法を整理する。
