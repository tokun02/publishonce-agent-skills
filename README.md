# PublishOnce — Agent Skills

**English** · [日本語](./README.ja.md) · [Español](./README.es.md) · [简体中文](./README.zh.md) · [한국어](./README.ko.md) · [Português](./README.pt.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md)

A skill that lets AI agents (Claude Code and others) **post and schedule videos to YouTube, TikTok, Instagram, Facebook and LinkedIn in one go**. It calls the public API of [PublishOnce](https://publishonce.app) through a zero-dependency CLI (`scripts/publishonce.js`).

> **Current scope**: video posts only. Text-only and image-only posts, and X, Threads, Pinterest and Bluesky, are not supported yet (planned). What is available on each network depends on that network's own API review.

## Install

Recommended: use the [skills CLI](https://www.npmjs.com/package/skills).

```bash
npx skills add tokun02/publishonce-agent-skills
```

Add `-a claude-code` (for example) to target one agent.

### Manual install

Clone this repository and put `skills/publishonce` in your agent's skills folder (example: Claude Code).

```bash
git clone https://github.com/tokun02/publishonce-agent-skills.git
ln -s "$(pwd)/publishonce-agent-skills/skills/publishonce" ~/.claude/skills/publishonce
```

Any agent that can run shell commands can use it: have it read `skills/publishonce/SKILL.md` and run `scripts/publishonce.js`.

## Setup

1. Create an account at [publishonce.app](https://publishonce.app) and connect the networks you want to post to.
2. Create an API key in [Settings → API keys](https://publishonce.app/settings/api) (`po_live_…` is real; `po_test_…` is for testing and posts nothing).
3. Ask the agent to save the key, or run:

```bash
./skills/publishonce/scripts/publishonce.js setup --key po_live_xxxxxxxx --global
```

The key is stored in `~/.config/publishonce/config.json` (or set the environment variable `PUBLISHONCE_API_KEY`). Never paste the key into a chat or a commit.

## What it can do

- Upload a video and **post it to several networks at once**
- **Schedule** posts (up to 30 days ahead)
- Save a **draft** inside PublishOnce and post it later
- Send a video to the **TikTok app drafts** or a **Facebook Page draft**
- Check post status and public URLs
- Per-network captions, TikTok privacy level, YouTube "made for kids" declaration, AI-generated labels

## Usage

Just ask the agent in plain language, in any language.

> Schedule this video for tomorrow at 6pm on YouTube and TikTok. The caption is "Meet our new product".

The agent confirms the accounts and the content, and posts **only after you approve** (it never posts without approval).

## Supported networks

| Network | Video | Notes |
|---|---|---|
| YouTube | yes (Shorts) | Until YouTube's API review is finished, videos posted through the API are private |
| TikTok | yes | A privacy level is required. Can also send to the app drafts |
| Instagram | yes (Reels) | Public only |
| Facebook | yes (Page video) | Public only. Can also save a Page draft |
| LinkedIn | yes | Public only |

## Requirements

- Node.js 18 or later
- An agent that can run shell commands
- A PublishOnce account and an API key

## API and MCP

- Public documentation: https://publishonce.app/docs
- See it for the REST API (`/api/v1`) and the MCP server.

## Links

- Service: https://publishonce.app
- Contact: publishonce.app@gmail.com
- License: [MIT](./LICENSE)

> The translations of this README were prepared with machine assistance and have not been reviewed by native speakers. The English and Japanese versions are the reference.
