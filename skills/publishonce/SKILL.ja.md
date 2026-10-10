<!-- 日本語版（参考）。エージェントが読むのは SKILL.md（英語）です。内容は SKILL.md と同じに保つこと。最終更新: 2026-10-10 -->

# PublishOnce: 動画を複数のSNSへまとめて投稿

PublishOnce（https://publishonce.app）の公開 API を、CLI（`./scripts/publishonce.js`）から使う。出力は、すべて JSON。

## 対応状況（正直な一覧）

| SNS | 動画 | 備考 |
|---|---|---|
| YouTube | ○（ショート） | **YouTube の API の審査が終わるまでは、API から投稿した動画は、YouTube の仕様で、すべて「非公開」になる**。公開範囲を選んでも同じ |
| TikTok | ○ | 公開範囲の指定が必須。アプリの下書き（受信箱）にも送れる |
| Instagram | ○（リール） | 公開のみ。Meta の審査の状況で、使える範囲が変わる |
| Facebook | ○（ページの動画） | 公開のみ。ページの下書きにも保存できる。Meta の審査の状況で、使える範囲が変わる |
| LinkedIn | ○ | 公開のみ |

**テキストだけ・画像だけの投稿は、まだできない。** X・Threads・Pinterest・Bluesky も、まだ対応していない。依頼されたら、できないと伝える。

## 「下書き」と言われたら（意味を確かめる）

「下書き」には、4つの意味がある。**あいまいなときは、必ず、ユーザーに聞く。**

1. **PublishOnce の中の下書き**（`draft: true`）: SNS には、何も送らない。最後の更新から14日で自動削除。`posts publish` で、あとから投稿・予約に進める。プランごとに、保存できる件数・容量の上限がある。
2. **TikTok アプリの下書き**（`platform_options.tiktok.send_as_draft: true`）: TikTok アプリの受信箱に届く。公開範囲・キャプションは、TikTok アプリで選ぶ。**公開URLは得られない。24時間に5件まで。** 初回は、PublishOnce の設定画面で、TikTok の「下書き送信を有効にする（再連携）」が必要。
3. **Facebook ページの下書き**（`platform_options.facebook.send_as_draft: true`）: ページの未公開の下書きとして保存される。公開は、Facebook 側で行う。公開URLは得られない。
4. **予約投稿**（`schedule_at`）: 指定の時刻に、PublishOnce が投稿する。下書きではない。

**YouTube・Instagram・LinkedIn には、SNS 側の下書きの仕組みがない。**（1 の PublishOnce の中の下書きか、予約を使う。）

## スキルの更新の確認

`last-updated` が30日より前なら、「スキルが古いかもしれない」とユーザーに伝え、`npx skills add tokun02/publishonce-agent-skills` で更新できると案内する。

## セットアップ

1. https://publishonce.app でアカウントを作り、投稿したい SNS を連携する（設定画面）。
2. https://publishonce.app/settings/api で、API キーを発行する。`po_live_…`（本番）と `po_test_…`（試験。**何も投稿されず、成功したように見えるだけ**）がある。
3. キーを保存する:
   ```bash
   ./scripts/publishonce.js setup --key po_live_xxxxxxxx --global
   ```
   `--global` なしだと、現在のフォルダの `.publishonce/config.json` に保存する。環境変数 `PUBLISHONCE_API_KEY` でも指定できる。

**キーの優先順位**: 環境変数 `PUBLISHONCE_API_KEY` > `./.publishonce/config.json` > `~/.config/publishonce/config.json`

**確認**: `./scripts/publishonce.js config show`（キーは、伏せて表示される。**キーを、画面やログに出さない**）

## CLI コマンド

出力は JSON。成功は `{"ok": true, ...}`、失敗は `{"ok": false, "error": {...}}`（終了コード1）。

### 連携済みのアカウント
```bash
./scripts/publishonce.js connections [--platform youtube]
```
投稿の前に、必ず実行して、**どのアカウントに投稿するか**を確認する。`id` は、複数のアカウントを連携しているときの `connection_ids` に使う。`status` が `expired` なら、再連携が必要。

### 動画のアップロード
```bash
./scripts/publishonce.js media upload ./video.mp4
# => { "ok": true, "data": { "video_path": "orgs/.../video.mp4", ... } }
```
- 形式は MP4・MOV・WEBM。長さは3分未満が目安。サイズ上限は、プランで違う（最大1GB）。Instagram は300MBまで、Facebook・LinkedIn は500MBまで。
- 動画が、すでに公開された HTTPS の URL にあるときは、アップロードせずに、`video_url` で指定できる。
- 返ってきた `video_path` を、投稿の作成に使う。

### 投稿
```bash
./scripts/publishonce.js posts create --data '<JSON>'          # 投稿・予約・下書きの作成
./scripts/publishonce.js posts create --data-file post.json    # 長いキャプションは、ファイルで渡す
./scripts/publishonce.js posts list [--status completed] [--limit 20] [--cursor <c>]
./scripts/publishonce.js posts get <id>
./scripts/publishonce.js posts publish <id> [--data '{"schedule_at":"..."}']   # 下書きを、投稿・予約に進める
./scripts/publishonce.js posts delete <id>                      # 下書きの削除（下書きだけ）
```

## 投稿を作る

### 投稿の前の「承認」（必須）

**ユーザーが、最終の計画を、はっきり承認するまで、`posts create`（下書き以外）を実行しない。** 最終の計画は、次をすべて含む:

- 投稿する動画（ファイル名）
- 投稿先の SNS と、**アカウント名**
- キャプション（全文）・タイトル
- 今すぐか、予約か（予約なら、日時と時間帯）
- SNS ごとの設定（TikTok の公開範囲、YouTube の子ども向けかどうか、など）

SNS の名前だけの返事、別の質問への答え、前の会話での同意は、承認とみなさない。**例外**: ユーザーが、アカウントを具体的に挙げて、「今すぐ投稿して」と言ったとき。

下書き（`draft: true`）の作成は、SNS に何も送らないので、承認は不要。

### データの形

```json
{
  "video_path": "orgs/.../video.mp4",
  "caption": "全SNS共通のキャプション（最大4000字）",
  "title": "YouTube用のタイトル（最大200字・任意）",
  "platforms": ["youtube", "tiktok"],
  "schedule_at": "2026-10-20T09:00:00Z",
  "caption_overrides": { "tiktok": "TikTok用のキャプション" },
  "connection_ids": { "youtube": "<connectionのid>" },
  "platform_options": { },
  "custom_id": "任意の識別子（最大100字）",
  "draft": false
}
```

| 項目 | 必須 | 説明 |
|---|---|---|
| `video_path` または `video_url` | ○（どちらか一方） | アップロードした動画のパス、または、公開された HTTPS の URL |
| `caption` | ○（下書きでは、空でもよい） | 全 SNS 共通。最大4000字 |
| `platforms` | ○（下書きでは、空でもよい） | `youtube` `tiktok` `instagram` `facebook` `linkedin` |
| `title` | 任意 | YouTube のタイトル。省略すると、キャプションの先頭 |
| `schedule_at` | 任意 | ISO 8601（UTC）。**いまから2分より先、30日より前**。省略すると、すぐ投稿。下書きでは、指定できない |
| `caption_overrides` | 任意 | SNS ごとのキャプション |
| `connection_ids` | 任意 | 同じ SNS に、複数のアカウントを連携しているとき、アカウントを指定する |
| `platform_options` | TikTok は必須 | 下の「SNS ごとの設定」 |
| `draft` | 任意 | `true` で、PublishOnce の中の下書きとして保存 |

### SNS ごとの設定（`platform_options`）

**TikTok（TikTok へ投稿するときは、必須）**
- `privacy_level`（**既定値はない。ユーザーに聞く**）: `PUBLIC_TO_EVERYONE`（全員）／`MUTUAL_FOLLOW_FRIENDS`（友達）／`FOLLOWER_OF_CREATOR`（フォロワー）／`SELF_ONLY`（自分のみ）。**非公開アカウントでは、「全員」は選べない**（`SELF_ONLY` など）。TikTok の審査の状況で、「全員」でも、実際には公開されないことがある。
- `allow_comment` / `allow_duet` / `allow_stitch`: 既定は、すべてオフ（`false`）。
- `commercial_content`: 商用コンテンツの開示。`true` のときは、`brand_organic`（自分のブランド）か `brand_content`（第三者のブランド）の、どちらかが必要。`brand_content` は、`SELF_ONLY` とは組み合わせられない。
- `is_aigc`: AIで生成・加工した動画なら `true`。
- `send_as_draft: true`: TikTok アプリの下書きに送る。**この場合、`privacy_level` などは指定しない**（同時に指定すると、エラー）。

**YouTube**
- `privacy`: `public`（既定）／`unlisted`／`private`。**YouTube の API の審査が終わるまでは、どれを選んでも、非公開になる。**
- `made_for_kids`: 子ども向けの動画か（YouTube への申告）。**指定する。ユーザーに聞く。** 省略すると、チャンネルの既定になる。
- `ai_generated`: AIで生成・加工した動画なら `true`。

**Instagram**: `ai_generated`（AIで生成・加工した動画なら `true`）。公開範囲は選べない。

**Facebook**: `send_as_draft: true` で、ページの下書きに保存する。公開範囲は選べない。

### 例

動画を、YouTube と TikTok に、今すぐ投稿する:
```bash
./scripts/publishonce.js media upload ./promo.mp4
./scripts/publishonce.js posts create --data '{
  "video_path": "orgs/.../video.mp4",
  "caption": "新商品のご紹介です #新商品",
  "title": "新商品のご紹介",
  "platforms": ["youtube", "tiktok"],
  "platform_options": {
    "youtube": { "privacy": "public", "made_for_kids": false },
    "tiktok": { "privacy_level": "PUBLIC_TO_EVERYONE" }
  }
}'
```

予約投稿（日時は、UTC に直す。日本時間 18:00 は、UTC 09:00）:
```bash
./scripts/publishonce.js posts create --data '{"video_path":"orgs/.../video.mp4","caption":"夕方の投稿","platforms":["instagram"],"schedule_at":"2026-10-20T09:00:00Z"}'
```

PublishOnce の中に、下書きとして保存する:
```bash
./scripts/publishonce.js posts create --data '{"video_path":"orgs/.../video.mp4","caption":"あとで決める","platforms":["youtube"],"draft":true}'
./scripts/publishonce.js posts publish <下書きのid>      # あとで、投稿に進める（ここで初めて、投稿数に数えられる）
```

TikTok アプリの下書きに送る:
```bash
./scripts/publishonce.js posts create --data '{"video_path":"orgs/.../video.mp4","caption":"下書き","platforms":["tiktok"],"platform_options":{"tiktok":{"send_as_draft":true}}}'
```

## 投稿の状況の確認

`posts create` の応答に、`id` がある。すぐ投稿したときは、`posts get <id>` で、各 SNS の状況を確かめる。

- 投稿全体の `status`: `draft` / `scheduled` / `publishing` / `completed` / `failed` / `partial`（一部だけ成功）
- SNS ごとの `targets[].status`: `pending` / `publishing` / `completed` / `failed`
- 成功したら `post_url`（公開URL。TikTok・Facebook の下書き送信では、出ない）。失敗したら `error_message`

`publishing` のあいだは、数秒おきに（最大で数分）確認する。**予約投稿は、時刻まで確認する必要がない。**

## 取り消し・削除

- **下書き**: `posts delete <id>` で消せる（アップロードした動画も消える）。
- **予約済み・投稿済みの投稿は、API からは、取り消せない**（`not_a_draft`）。PublishOnce の画面（カレンダー）から、行うよう案内する。

## 推奨の手順

1. 依頼の意図を確かめる（投稿か、予約か、下書きか。「下書き」の意味）。
2. `connections` で、投稿先のアカウントを選ぶ（アカウントが複数なら、ユーザーに聞く）。
3. 内容を用意する（動画・キャプション・タイトル・SNS ごとの設定）。
4. **最終の計画を、ユーザーに見せて、承認をもらう。**
5. `media upload` で動画をアップロードする。
6. `posts create` で投稿を作る。
7. `posts get` で、結果を確認して、公開URL か、エラーを伝える。

## 守ること

- **承認なしに、投稿しない**（上の「投稿の前の承認」）。
- **投稿するアカウントを、毎回、確認する。**
- **TikTok の公開範囲と、YouTube の子ども向けかどうかは、推測せず、ユーザーに聞く。**
- AIで作った動画は、`is_aigc` / `ai_generated` を `true` にするよう、ユーザーに確認する。
- 時刻は、ユーザーの時間帯を確かめて、UTC に直す。
- 同じ動画・同じ内容を、二重に投稿しない（失敗したときは、`posts get` で状況を見てから、やり直す）。
- 上限に達すると、エラーになる（プランの月間枠・1日の上限は、403/402）。レート制限は、429。待ってから、やり直す。
- 試験には `po_test_` のキーを使う（何も投稿されない）。
- **API キーを、画面・ログ・コミットに出さない。**

## 自動運用の指針

自動で動かすときも、次を守る。
- 同じ内容の繰り返し・大量の投稿をしない。各 SNS の利用規約と、PublishOnce の利用規約に従う。
- 自動の返信・いいねの水増しは、しない。
- 公開の前に、人の目での確認を入れる（最終の計画の承認）。
- 失敗した投稿を、むやみに再実行しない。SNS の側で、アカウントが制限されるおそれがある。
