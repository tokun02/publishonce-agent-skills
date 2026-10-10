# Changelog

## 0.2.0 — 2026-10-10

- 多言語対応。`SKILL.md` を英語の正本にして（利用者の言語で返答する指示つき）、日本語版を `SKILL.ja.md` に。
- README を8言語（英語・日本語・スペイン語・中国語・韓国語・ポルトガル語・フランス語・ドイツ語）に。
- CLI のメッセージを、英語（既定）と日本語に。`PUBLISHONCE_LANG=ja` で切り替え。

## 0.1.0 — 2026-10-10

- 最初の公開。`skills/publishonce`（`SKILL.md` と、ゼロ依存の CLI `scripts/publishonce.js`）。
- コマンド: `setup`、`config show`、`connections`、`media upload`、`posts create / list / get / publish / delete`。
- 動画の一括投稿、予約投稿、PublishOnce の中の下書き、TikTok アプリの下書き・Facebook ページの下書きへの送信。
- 投稿の前の「最終の計画の承認」を、スキルの必須の手順にした。
- 対応は、動画の投稿のみ（テキストだけ・画像だけの投稿は、まだ）。
