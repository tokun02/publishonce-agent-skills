# PublishOnce — Agent Skills

[English](./README.md) · [日本語](./README.ja.md) · [Español](./README.es.md) · **简体中文** · [한국어](./README.ko.md) · [Português](./README.pt.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md)

这是一个让 AI 智能体（Claude Code 等）**一次性把视频发布、定时发布到 YouTube、TikTok、Instagram、Facebook 和 LinkedIn** 的技能。它通过零依赖的命令行工具（`scripts/publishonce.js`）调用 [PublishOnce](https://publishonce.app) 的公开 API。

> **目前的范围**：仅支持视频发布。暂不支持纯文字、纯图片发布，也不支持 X、Threads、Pinterest 和 Bluesky（计划支持）。各平台可用的范围取决于该平台自己的 API 审核。

## 安装

推荐使用 [skills CLI](https://www.npmjs.com/package/skills)。

```bash
npx skills add tokun02/publishonce-agent-skills
```

加上 `-a claude-code`（示例）可指定某个智能体。

### 手动安装

克隆本仓库，把 `skills/publishonce` 放到智能体的技能文件夹中（示例：Claude Code）。

```bash
git clone https://github.com/tokun02/publishonce-agent-skills.git
ln -s "$(pwd)/publishonce-agent-skills/skills/publishonce" ~/.claude/skills/publishonce
```

只要能执行 shell 命令的智能体都能使用：让它阅读 `skills/publishonce/SKILL.md` 并运行 `scripts/publishonce.js`。

## 设置

1. 在 [publishonce.app](https://publishonce.app) 创建账号，并连接要发布的社交平台。
2. 在[设置 → API 密钥](https://publishonce.app/settings/api)中创建 API 密钥（`po_live_…` 为正式，`po_test_…` 为测试，不会实际发布）。
3. 让智能体保存密钥，或运行：

```bash
./skills/publishonce/scripts/publishonce.js setup --key po_live_xxxxxxxx --global
```

密钥保存在 `~/.config/publishonce/config.json`（也可使用环境变量 `PUBLISHONCE_API_KEY`）。请勿把密钥粘贴到聊天或提交记录中。

## 功能

- 上传视频并**同时发布到多个平台**
- **定时发布**（最长 30 天后）
- 在 PublishOnce 内保存**草稿**，稍后再发布
- 把视频发送到 **TikTok 应用草稿**或 **Facebook 主页草稿**
- 查看发布状态和公开链接
- 各平台单独的文案、TikTok 可见范围、YouTube「面向儿童」声明、AI 生成标签

## 用法

用自然语言（任何语言）告诉智能体即可。

> 把这个视频定在明天 18:00 发布到 YouTube 和 TikTok，文案是「新产品介绍」。

智能体会确认账号和内容，**在你批准之后**才会发布（未经批准绝不发布）。

## 支持的平台

| 平台 | 视频 | 备注 |
|---|---|---|
| YouTube | 支持（Shorts） | 在 YouTube 的 API 审核完成之前，通过 API 发布的视频为私享 |
| TikTok | 支持 | 必须指定可见范围。也可发送到应用草稿 |
| Instagram | 支持（Reels） | 仅公开 |
| Facebook | 支持（主页视频） | 仅公开。也可保存为主页草稿 |
| LinkedIn | 支持 | 仅公开 |

## 要求

- Node.js 18 或更高版本
- 能执行 shell 命令的智能体
- PublishOnce 账号和 API 密钥

## API 与 MCP

- 公开文档：https://publishonce.app/docs
- REST API（`/api/v1`）和 MCP 服务器请参阅该文档。

## 链接

- 服务：https://publishonce.app
- 联系：publishonce.app@gmail.com
- 许可证：[MIT](./LICENSE)

> 本 README 的翻译借助机器翻译完成，尚未经过母语者审校。以英文和日文版本为准。
