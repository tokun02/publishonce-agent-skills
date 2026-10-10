# PublishOnce — Agent Skills

[English](./README.md) · **日本語** · [Español](./README.es.md) · [简体中文](./README.zh.md) · [한국어](./README.ko.md) · [Português](./README.pt.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md)

AI エージェント（Claude Code など）から、**動画を、YouTube・TikTok・Instagram・Facebook・LinkedIn へ、まとめて投稿・予約投稿**するためのスキルです。[PublishOnce](https://publishonce.app) の公開 API を、ゼロ依存の CLI（`scripts/publishonce.js`）で呼び出します。

> **いまの対応範囲**: 動画の投稿のみです。テキストだけ・画像だけの投稿、X・Threads・Pinterest・Bluesky は、まだ対応していません（順次、対応予定）。Instagram・Facebook・TikTok・YouTube の各社の審査の状況で、使える範囲が変わります。

## インストール

推奨: [skills CLI](https://www.npmjs.com/package/skills) を使います。

```bash
npx skills add tokun02/publishonce-agent-skills
```

エージェントを指定する場合は、`-a claude-code` のように付けます。

### 手動でインストール

このリポジトリをクローンして、`skills/publishonce` を、エージェントのスキルのフォルダに置きます（例: Claude Code）。

```bash
git clone https://github.com/tokun02/publishonce-agent-skills.git
ln -s "$(pwd)/publishonce-agent-skills/skills/publishonce" ~/.claude/skills/publishonce
```

シェルのコマンドを実行できるエージェントなら、`skills/publishonce/SKILL.md` を読ませて、`scripts/publishonce.js` を実行させるだけで使えます。

## セットアップ

1. [publishonce.app](https://publishonce.app) でアカウントを作り、投稿したい SNS を連携します。
2. [設定 → API キー](https://publishonce.app/settings/api) で、API キーを発行します（`po_live_…` は本番、`po_test_…` は試験用で、何も投稿されません）。
3. エージェントに、キーを保存するよう頼むか、次を実行します。

```bash
./skills/publishonce/scripts/publishonce.js setup --key po_live_xxxxxxxx --global
```

キーは、`~/.config/publishonce/config.json` に保存されます（環境変数 `PUBLISHONCE_API_KEY` でも指定できます）。キーを、チャットやコミットに貼らないでください。

## できること

- 動画のアップロードと、複数の SNS への**一括投稿**
- **予約投稿**（30日先まで）
- PublishOnce の中の**下書き**の保存と、あとからの投稿
- **TikTok アプリの下書き**・**Facebook ページの下書き**への送信
- 投稿の状況・公開 URL の確認
- SNS ごとのキャプション、TikTok の公開範囲、YouTube の子ども向けの申告、AI 生成のラベル

## 使い方

エージェントに、自然な言葉で頼みます。

> この動画を、YouTube と TikTok に、明日の18時に予約投稿して。キャプションは「新商品のご紹介です」。

エージェントは、投稿先のアカウントと内容を確認して、**あなたが承認してから**、投稿します（承認なしに、投稿しません）。

## 対応プラットフォーム

| SNS | 動画 | 備考 |
|---|---|---|
| YouTube | ○（ショート） | YouTube の API の審査が終わるまでは、API から投稿した動画は、非公開になります |
| TikTok | ○ | 公開範囲の指定が必須。アプリの下書きにも送れます |
| Instagram | ○（リール） | 公開のみ |
| Facebook | ○（ページの動画） | 公開のみ。ページの下書きにも保存できます |
| LinkedIn | ○ | 公開のみ |

## 必要なもの

- Node.js 18 以上
- シェルのコマンドを実行できるエージェント
- PublishOnce のアカウントと API キー

## API・MCP

- 公開ドキュメント: https://publishonce.app/docs
- REST API（`/api/v1`）と、MCP サーバーの案内は、公開ドキュメントを参照してください。

## リンク

- サービス: https://publishonce.app
- お問い合わせ: publishonce.app@gmail.com
- ライセンス: [MIT](./LICENSE)

> このREADMEは、英語版・日本語版が基準です。ほかの言語の版は、機械翻訳を使って作成しており、母語の方の確認は、まだ済んでいません。
