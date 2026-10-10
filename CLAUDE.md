# このリポジトリの保守のルール

## SKILL.md（英語が正本）と SKILL.ja.md（日本語版）
- **SKILL.md は英語**（エージェントが読む正本）。**SKILL.ja.md は、その日本語版**。**内容を、必ず同じに保つ**（片方を直したら、もう片方も直す）。
- 利用者への返答は、利用者の言語で行うよう、SKILL.md に書いてある。この指示を消さない。
- 変更したら、`last-updated` を、変更した日付にする。
- `allowed-tools` は、変えない（`Bash(./scripts/publishonce.js:*)` のみ）。
- 500行以内に収める。
- **実際に動くコマンドの例だけ**を載せる。対応していない機能（テキストだけ・画像だけの投稿、X・Threads など）を、「できる」と書かない。
- PublishOnce の API の仕様（https://publishonce.app/docs）と食い違わないようにする。

## scripts/publishonce.js
- 外部の依存を、使わない（Node.js 18 以上の、組み込みの `fetch` だけ）。
- すべてのコマンドの出力は、JSON にする。
- メッセージは、英語（既定）と日本語（`PUBLISHONCE_LANG=ja`、または、日本語のロケール）。新しいメッセージは、両方に足す。
- **API キーを、ログ・出力に、決して出さない**（`config show` も、伏せて表示する）。

## README（8言語）
- `README.md`（英語）・`README.ja.md`・`README.es.md`・`README.zh.md`・`README.ko.md`・`README.pt.md`・`README.fr.md`・`README.de.md`。**内容を、8つで、そろえる**（対応状況の表・インストール・注意書き）。
- 英語・日本語が基準。ほかは、機械翻訳を使ったもので、母語の方の確認は、まだ。
- 対応状況の表は、SKILL.md と同じ内容にする。
- インストールの手順は、実際に動くものだけを書く。

## コミットメッセージ
- 日本語で、変更の内容が分かるように書く。

## 試験
SKILL.md を変えたら、次の3つを確かめる。
1. 投稿するアカウントの確認と、承認の流れが、守られること。
2. コマンドの例が、実際の形式（`posts create --data '<JSON>'` など）と合っていること。
3. 推奨の手順に、抜けがないこと。

CLI を変えたら、`po_test_` のキーで、`connections`・`media upload`・`posts create`（試験）・`posts get` を実行して、確かめる。
