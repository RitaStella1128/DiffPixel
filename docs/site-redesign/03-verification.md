# Phase 4 — 自己検証記録

検証日: 2026-07-02 / 環境: ローカル静的サーバ(`python3 -m http.server 4173` = 開発用、`npx serve :4175` = keep-alive 計測用)、Chromium ベースのプレビュー(`prefers-reduced-motion: reduce` を常時エミュレート。モーション有効パスは QA フラグ `?motion=force` で検証)

| # | 項目 | 結果 | 根拠 |
|---|---|---|---|
| 1 | ビルドが警告なしで成功する | **pass(対象外に近い)** | ビルド工程なし(素の静的サイト)。代替検証: `node -c` で全 JS 構文 OK、全 HTML でタグ収支・重複 ID なし、全ローカル参照(css/js/画像/フォント/srcset)の実在を機械確認 |
| 2 | アプリ本体のルート・機能に影響がない | **pass** | 変更は `docs/`(+ 記録文書)のみ。`git status` で `manifest.json` / `background/` / `content/` / `_locales/` / `icons/` に変更なし。拡張本体は `docs/` 内ファイルを参照しない(Phase 0 で grep 確認)。既存自動テストは存在しない |
| 3 | モバイル 375px・タブレット 768px・デスクトップで崩れなし | **pass** | 各幅で `scrollWidth === clientWidth`(横オーバーフローなし)を実測。375px で EN/JA ヒーロー・ワークフロー・フッターをスクリーンショット確認。日本語見出しの行頭禁則(「、」等)は分割スパン化で一度破綻 → 禁則グルーピングを実装して解消を確認 |
| 4 | prefers-reduced-motion 時に全コンテンツ可読 | **pass** | プレビューは reduce を常時エミュレート。既定状態で 3 ページとも `opacity:0` 残留 0 件・`has-motion` 不付与・Lenis 非初期化を実測。加えて隠し状態は全て `html.has-motion`(JS がモーション許可時のみ付与)配下にのみ定義され、GSAP 読込失敗時の `settleAll()` フォールバック+4 秒セーフティタイマーで解除される |
| 5 | キーボードのみで全 CTA に到達可能 | **pass** | スキップリンクが先頭フォーカス。可視フォーカス対象 14 要素すべて `focus()` 受理(fail 0)。フォーカス順序 = DOM 順序 = 視覚順序(並べ替えなし)。ヘッダー CTA はモバイル幅でも常時表示(任意スクロール位置から 1 操作)。`:focus-visible` スタイルは全インタラクティブ要素に定義(ボタンスイープ・下線描画は hover と同等) |
| 6 | コントラスト比の全数確認 | **pass** | 実使用の全組合せを計算で確認: text/bg 18.4、muted/bg 9.1、quiet/bg 4.8、cyan/bg 11.5、ink/cyan(btn) 11.0、ink/text(btn hover) 17.5、text/surface 17.1、muted/surface 8.4、quiet/surface 4.5、cyan/surface 10.7、pink/surface 5.6、cyan/surface-2(kbd) 9.8 — すべて AA(4.5:1)以上。当初 fail だった workflow-hud 非アクティブ状態(opacity .45 → 1.83:1)は `--quiet` 全不透明(4.8:1)に修正。Lighthouse a11y の color-contrast 監査も 0 件 |
| 7 | JS 無効環境で主要コンテンツと CTA が表示される | **pass(構造検証)** | 隠し状態はすべて `html.has-motion`(JS 付与)にキー。HTML 静的状態で EN パネルが `class="active"`・CTA 表示。フォント CSS には `<noscript>` フォールバックあり。既定 `opacity:0` の唯一の残存(レガシー `.snap-in`)は未使用だったため削除。残る `opacity:0` は装飾オーバーレイ(diff-range 透明スライダー、workflow 積層フレーム)のみで情報損失なし |
| 8 | プレースホルダ文言・ダミー画像が残存しない | **pass** | `lorem/ipsum/placeholder/ここにテキスト/dummy/TODO/FIXME` を全サイトファイルで grep → 0 件。画像はすべて実プロダクトのスクリーンショット由来 |
| 9 | console にエラーが出ない | **pass** | Home(EN/JA・モーション有効/縮退)・Manual・Privacy で console 出力 0 件(warning 含む) |

## パフォーマンス実測(Lighthouse、モバイルエミュレーション)

keep-alive 静的サーバ(本番 GitHub Pages に近い接続特性)に対する計測:

| ページ | Performance | Accessibility | LCP | CLS | TBT |
|---|---|---|---|---|---|
| Home | **100** | **100** | 1.7s | 0.004 | 0ms |
| Manual | 98 | 100 | 2.3s | 0.002 | 0ms |
| Privacy | 100 | 100 | 1.6s | 0.005 | 0ms |

目標(LCP < 2.5s / CLS < 0.1 / モバイル Performance 85+)をすべて達成。

補足: `python3 -m http.server`(リクエスト毎に TCP 接続を張り直す開発サーバ)に対する計測では接続オーバーヘッドのシミュレーション増幅により Performance 59〜60 となる。これはサーバ特性のアーティファクトであり、本番相当の keep-alive 配信では上表のとおり。判断根拠として記録する。

主なパフォーマンス施策: Google Fonts CSS の非同期化(preload + media swap + noscript)、未使用ウェイト(500)の削除、ヒーロー/製品画像の 720w 縮小版生成 + `srcset/sizes`(preload も `imagesrcset` 化)、アニメーションライブラリの動的読込(モーション許可時のみ、reduce 環境では一切ダウンロードしない)、transform/opacity 限定のアニメーション、全画像の width/height 指定(CLS ≈ 0)。

## 検証環境の限界(残ギャップ)

- モーション有効パス(Lenis 慣性・文字スタッガー)は `?motion=force` フラグ+computed style 検証とスクリーンショットで確認したが、reduce 非エミュレートの実機ブラウザでの目視は未実施。
- スクリーンリーダー実機(VoiceOver 等)の読み上げは未検証。分割見出しは `aria-label`(原文)+ `aria-hidden` ラッパで構造上は原文が読まれる設計。
- Firefox/Safari 実機での Lenis / View Transitions の確認は未実施(View Transitions は非対応環境で単に無効化される宣言的機能)。
