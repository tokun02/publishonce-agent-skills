---
name: publishonce
description: >
  Use PublishOnce to post, schedule and draft videos on YouTube (Shorts), TikTok, Instagram (Reels), Facebook and LinkedIn from one request.
  Use it when the user asks (in any language, e.g. "post this video", "schedule it for tomorrow at 6pm", "post to YouTube and TikTok", "send it to my TikTok drafts",
  "動画を投稿して", "SNSに予約投稿して", "投稿の状況を教えて", "publicar un vídeo", "视频发布", "영상 업로드", "poster une vidéo", "Video posten") to publish a video, upload a file,
  schedule a post (up to 30 days ahead), save a draft, send a draft to TikTok or a Facebook Page, check a post's status, or list connected accounts.
  Video posts only for now: text-only and image-only posts are not supported yet.
last-updated: 2026-10-10
allowed-tools: Bash(./scripts/publishonce.js:*)
---

# PublishOnce: post a video to several social networks at once

This skill uses the public API of PublishOnce (https://publishonce.app) through a CLI (`./scripts/publishonce.js`). Every command prints JSON.

**Always answer the user in the user's own language.** CLI messages are in English (or Japanese if `PUBLISHONCE_LANG=ja`); translate them for the user.

A Japanese version of this file is in `SKILL.ja.md` (same content).

## What is supported (honest list)

| Network | Video | Notes |
|---|---|---|
| YouTube | yes (Shorts) | **Until YouTube's API review is finished, every video posted through the API is forced to "private" by YouTube**, whatever privacy you choose |
| TikTok | yes | A privacy level is required. A video can also be sent to the creator's TikTok app drafts |
| Instagram | yes (Reels) | Public only. What is available depends on Meta's review status |
| Facebook | yes (Page video) | Public only. Can also be saved as a Page draft. Depends on Meta's review status |
| LinkedIn | yes | Public only |

**Text-only and image-only posts are not supported yet.** X, Threads, Pinterest and Bluesky are not supported yet either. If asked, say so.

## When the user says "draft" (check which meaning)

"Draft" has four meanings. **If it is unclear, ask the user.**

1. **A draft inside PublishOnce** (`draft: true`): nothing is sent to any network. Deleted automatically 14 days after the last update. Continue later with `posts publish`. Each plan has limits on the number and total size of drafts.
2. **A TikTok app draft** (`platform_options.tiktok.send_as_draft: true`): the video arrives in the creator's TikTok app inbox; privacy and caption are chosen in the TikTok app. **No public URL is returned. Max 5 per 24 hours.** The first time, the user must enable it in PublishOnce settings ("Enable sending drafts to TikTok", which reconnects TikTok with an extra permission).
3. **A Facebook Page draft** (`platform_options.facebook.send_as_draft: true`): saved as an unpublished draft on the Page; publishing is done on Facebook. No public URL.
4. **A scheduled post** (`schedule_at`): PublishOnce posts at that time. This is not a draft.

**YouTube, Instagram and LinkedIn have no drafts of their own** (use 1, a draft inside PublishOnce, or a schedule).

## Checking for skill updates

If `last-updated` is more than 30 days old, tell the user the skill may be out of date and that `npx skills add tokun02/publishonce-agent-skills` updates it.

## Setup

1. Create an account at https://publishonce.app and connect the networks (Settings).
2. Create an API key at https://publishonce.app/settings/api: `po_live_…` (real) or `po_test_…` (test: **nothing is posted; it only looks successful**).
3. Save the key:
   ```bash
   ./scripts/publishonce.js setup --key po_live_xxxxxxxx --global
   ```
   Without `--global` it is saved in `.publishonce/config.json` of the current folder. The environment variable `PUBLISHONCE_API_KEY` also works.

**Key lookup order**: env `PUBLISHONCE_API_KEY` > `./.publishonce/config.json` > `~/.config/publishonce/config.json`

**Check**: `./scripts/publishonce.js config show` (the key is masked. **Never print the key on screen or in logs.**)

## CLI commands

Output is JSON. Success: `{"ok": true, ...}`. Failure: `{"ok": false, "error": {...}}` with exit code 1.

### Connected accounts
```bash
./scripts/publishonce.js connections [--platform youtube]
```
Always run this before posting to confirm **which account** will be used. The `id` is used in `connection_ids` when several accounts are connected for one network. If `status` is `expired`, the account must be reconnected.

### Upload a video
```bash
./scripts/publishonce.js media upload ./video.mp4
# => { "ok": true, "data": { "video_path": "orgs/.../video.mp4", ... } }
```
- Formats: MP4, MOV, WEBM. Keep it under 3 minutes. The size limit depends on the plan (up to 1 GB). Instagram: up to 300 MB. Facebook and LinkedIn: up to 500 MB.
- If the video is already at a public HTTPS URL, skip the upload and pass `video_url`.
- Use the returned `video_path` when creating the post.

### Posts
```bash
./scripts/publishonce.js posts create --data '<JSON>'          # post, schedule or save a draft
./scripts/publishonce.js posts create --data-file post.json    # pass long captions through a file
./scripts/publishonce.js posts list [--status completed] [--limit 20] [--cursor <c>]
./scripts/publishonce.js posts get <id>
./scripts/publishonce.js posts publish <id> [--data '{"schedule_at":"..."}']   # move a draft to posting or scheduling
./scripts/publishonce.js posts delete <id>                      # delete a draft (drafts only)
```

## Creating a post

### Approval before posting (required)

**Do not run `posts create` (other than a draft) until the user has clearly approved the final plan.** The final plan includes all of:

- the video (file name)
- the networks and the **account names**
- the full caption and the title
- now or scheduled (if scheduled: date, time and time zone)
- per-network settings (TikTok privacy, YouTube "made for kids", and so on)

A bare network name, an answer to some other question, or agreement earlier in the conversation is not approval. **Exception**: the user names the exact accounts and says "post it now".

Creating a draft (`draft: true`) sends nothing to any network, so no approval is needed.

### Data format

```json
{
  "video_path": "orgs/.../video.mp4",
  "caption": "Caption shared by all networks (max 4000 characters)",
  "title": "Title for YouTube (max 200 characters, optional)",
  "platforms": ["youtube", "tiktok"],
  "schedule_at": "2026-10-20T09:00:00Z",
  "caption_overrides": { "tiktok": "A caption only for TikTok" },
  "connection_ids": { "youtube": "<connection id>" },
  "platform_options": { },
  "custom_id": "Your own identifier (max 100 characters)",
  "draft": false
}
```

| Field | Required | Description |
|---|---|---|
| `video_path` or `video_url` | yes (exactly one) | The uploaded video's path, or a public HTTPS URL |
| `caption` | yes (may be empty for drafts) | Shared by all networks. Max 4000 characters |
| `platforms` | yes (may be empty for drafts) | `youtube` `tiktok` `instagram` `facebook` `linkedin` |
| `title` | optional | YouTube title. Defaults to the start of the caption |
| `schedule_at` | optional | ISO 8601 (UTC). **More than 2 minutes from now and within 30 days.** Omit to post now. Not allowed for drafts |
| `caption_overrides` | optional | A different caption per network |
| `connection_ids` | optional | Choose the account when several are connected for one network |
| `platform_options` | required for TikTok | See "Per-network options" |
| `draft` | optional | `true` saves a draft inside PublishOnce |

### Per-network options (`platform_options`)

**TikTok (required whenever TikTok is a target)**
- `privacy_level` (**no default: ask the user**): `PUBLIC_TO_EVERYONE` / `MUTUAL_FOLLOW_FRIENDS` / `FOLLOWER_OF_CREATOR` / `SELF_ONLY`. **A private account cannot choose "everyone"** (`SELF_ONLY` etc.). Until TikTok's own audit passes, a post may not actually become public even with "everyone".
- `allow_comment` / `allow_duet` / `allow_stitch`: all off (`false`) by default.
- `commercial_content`: disclosure of commercial content. When `true`, one of `brand_organic` (own brand) or `brand_content` (a third party's brand) is required. `brand_content` cannot be combined with `SELF_ONLY`.
- `is_aigc`: `true` if the video is AI-generated or AI-edited.
- `send_as_draft: true`: send to the TikTok app drafts. **Do not give `privacy_level` etc. with it** (that is an error).

**YouTube**
- `privacy`: `public` (default) / `unlisted` / `private`. **Until YouTube's API review is finished, every choice ends up private.**
- `made_for_kids`: whether the video is made for kids (a declaration to YouTube). **Set it; ask the user.** If omitted, the channel default is used.
- `ai_generated`: `true` if the video is AI-generated or AI-edited.

**Instagram**: `ai_generated` (`true` for AI-generated or AI-edited video). The audience cannot be chosen.

**Facebook**: `send_as_draft: true` saves a Page draft. The audience cannot be chosen.

### Examples

Post a video to YouTube and TikTok now:
```bash
./scripts/publishonce.js media upload ./promo.mp4
./scripts/publishonce.js posts create --data '{
  "video_path": "orgs/.../video.mp4",
  "caption": "Meet our new product #launch",
  "title": "Meet our new product",
  "platforms": ["youtube", "tiktok"],
  "platform_options": {
    "youtube": { "privacy": "public", "made_for_kids": false },
    "tiktok": { "privacy_level": "PUBLIC_TO_EVERYONE" }
  }
}'
```

Schedule (convert to UTC; 18:00 in Japan is 09:00 UTC):
```bash
./scripts/publishonce.js posts create --data '{"video_path":"orgs/.../video.mp4","caption":"Evening post","platforms":["instagram"],"schedule_at":"2026-10-20T09:00:00Z"}'
```

Save a draft inside PublishOnce:
```bash
./scripts/publishonce.js posts create --data '{"video_path":"orgs/.../video.mp4","caption":"Decide later","platforms":["youtube"],"draft":true}'
./scripts/publishonce.js posts publish <draft id>      # later: only now does it count toward the post quota
```

Send to the TikTok app drafts:
```bash
./scripts/publishonce.js posts create --data '{"video_path":"orgs/.../video.mp4","caption":"Draft","platforms":["tiktok"],"platform_options":{"tiktok":{"send_as_draft":true}}}'
```

## Checking a post's status

The response of `posts create` contains an `id`. After posting now, check each network with `posts get <id>`.

- Overall `status`: `draft` / `scheduled` / `publishing` / `completed` / `failed` / `partial` (only some succeeded)
- Per network `targets[].status`: `pending` / `publishing` / `completed` / `failed`
- On success, `post_url` (the public URL; not returned for TikTok or Facebook draft sends). On failure, `error_message`

While `publishing`, check every few seconds (up to a few minutes). **A scheduled post needs no polling until its time.**

## Cancelling and deleting

- **Drafts**: `posts delete <id>` removes them (the uploaded video too).
- **Scheduled or published posts cannot be cancelled through the API** (`not_a_draft`). Point the user to the PublishOnce calendar.

## Recommended workflow

1. Clarify the intent (post now, schedule or draft; which kind of "draft").
2. Run `connections` and choose the accounts (ask the user if there are several).
3. Prepare the content (video, caption, title, per-network settings).
4. **Show the final plan and get the user's approval.**
5. Upload the video with `media upload`.
6. Create the post with `posts create`.
7. Check the result with `posts get` and tell the user the public URL or the error.

## Rules

- **Never post without approval** (see "Approval before posting").
- **Confirm the account every time.**
- **Do not guess TikTok privacy or YouTube "made for kids": ask the user.**
- For AI-made videos, ask the user whether to set `is_aigc` / `ai_generated` to `true`.
- Confirm the user's time zone and convert times to UTC.
- Do not post the same video or content twice (after a failure, look at `posts get` before retrying).
- When a limit is reached the API returns an error (plan monthly quota or daily limit: 402/403; rate limit: 429). Wait, then retry.
- Use a `po_test_` key for experiments (nothing is posted).
- **Never put the API key in output, logs or commits.**

## Guidelines for automation

Even when automated:
- Do not post repetitive or bulk content. Follow each network's terms and PublishOnce's terms.
- No automated replies and no engagement farming.
- Keep a human in the loop before publishing (approval of the final plan).
- Do not blindly re-run failed posts; networks may restrict the account.
