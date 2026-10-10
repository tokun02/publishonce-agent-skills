# このリポジトリの保守のルール

## SKILL.md
- 変更したら、`last-updated` を、変更した日付にする。
- `allowed-tools` は、変えない（`Bash(./scripts/publishonce.js:*)` のみ）。
- 500行以内に収める。
- **実際に動くコマンドの例だけ**を載せる。対応していない機能（テキストだけ・画像だけの投稿、X・Threads など）を、「できる」と書かない。
- PublishOnce の API の仕様（https://publishonce.app/docs）と食い違わないようにする。

## scripts/publishonce.js
- 外部の依存を、使わない（Node.js 18 以上の、組み込みの `fetch` だけ）。
- すべてのコマンドの出力は、JSON にする。
- **API キーを、ログ・出力に、決して出さない**（`config show` も、伏せて表示する）。

## README.md
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
