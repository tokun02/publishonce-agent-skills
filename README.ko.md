# PublishOnce — Agent Skills

[English](./README.md) · [日本語](./README.ja.md) · [Español](./README.es.md) · [简体中文](./README.zh.md) · **한국어** · [Português](./README.pt.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md)

AI 에이전트(Claude Code 등)가 **YouTube, TikTok, Instagram, Facebook, LinkedIn에 영상을 한 번에 게시하고 예약**할 수 있게 하는 스킬입니다. 의존성이 없는 CLI(`scripts/publishonce.js`)로 [PublishOnce](https://publishonce.app)의 공개 API를 호출합니다.

> **현재 범위**: 영상 게시만 지원합니다. 텍스트만, 이미지만 게시하는 기능과 X, Threads, Pinterest, Bluesky는 아직 지원하지 않습니다(예정). 각 플랫폼에서 쓸 수 있는 범위는 해당 플랫폼의 API 심사 상황에 따라 달라집니다.

## 설치

[skills CLI](https://www.npmjs.com/package/skills) 사용을 권장합니다.

```bash
npx skills add tokun02/publishonce-agent-skills
```

특정 에이전트만 지정하려면 `-a claude-code`(예시)를 붙입니다.

### 수동 설치

저장소를 클론하고 `skills/publishonce`를 에이전트의 스킬 폴더에 둡니다(예: Claude Code).

```bash
git clone https://github.com/tokun02/publishonce-agent-skills.git
ln -s "$(pwd)/publishonce-agent-skills/skills/publishonce" ~/.claude/skills/publishonce
```

셸 명령을 실행할 수 있는 에이전트라면 사용할 수 있습니다. `skills/publishonce/SKILL.md`를 읽게 하고 `scripts/publishonce.js`를 실행하게 하세요.

## 설정

1. [publishonce.app](https://publishonce.app)에서 계정을 만들고 게시할 SNS를 연결합니다.
2. [설정 → API 키](https://publishonce.app/settings/api)에서 API 키를 만듭니다(`po_live_…`는 실제, `po_test_…`는 테스트용으로 아무것도 게시되지 않습니다).
3. 에이전트에게 키 저장을 부탁하거나 다음을 실행합니다.

```bash
./skills/publishonce/scripts/publishonce.js setup --key po_live_xxxxxxxx --global
```

키는 `~/.config/publishonce/config.json`에 저장됩니다(환경 변수 `PUBLISHONCE_API_KEY`도 사용 가능). 키를 채팅이나 커밋에 붙여 넣지 마세요.

## 할 수 있는 것

- 영상 업로드와 **여러 SNS에 동시 게시**
- **예약 게시**(최대 30일 후)
- PublishOnce 안에 **임시 저장**하고 나중에 게시
- **TikTok 앱 임시 저장함**이나 **Facebook 페이지 초안**으로 전송
- 게시 상태와 공개 URL 확인
- SNS별 설명, TikTok 공개 범위, YouTube '아동용' 신고, AI 생성 라벨

## 사용 방법

어떤 언어로든 자연스러운 말로 에이전트에게 부탁하세요.

> 이 영상을 내일 오후 6시에 YouTube와 TikTok에 예약 게시해 줘. 설명은 '신제품 소개'야.

에이전트는 계정과 내용을 확인하고 **당신이 승인한 뒤에만** 게시합니다(승인 없이는 게시하지 않습니다).

## 지원 플랫폼

| SNS | 영상 | 비고 |
|---|---|---|
| YouTube | 가능(Shorts) | YouTube API 심사가 끝날 때까지 API로 게시한 영상은 비공개가 됩니다 |
| TikTok | 가능 | 공개 범위 지정이 필수. 앱 임시 저장함으로도 보낼 수 있습니다 |
| Instagram | 가능(Reels) | 공개만 가능 |
| Facebook | 가능(페이지 영상) | 공개만 가능. 페이지 초안으로도 저장할 수 있습니다 |
| LinkedIn | 가능 | 공개만 가능 |

## 필요한 것

- Node.js 18 이상
- 셸 명령을 실행할 수 있는 에이전트
- PublishOnce 계정과 API 키

## API 및 MCP

- 공개 문서: https://publishonce.app/docs
- REST API(`/api/v1`)와 MCP 서버는 문서를 참고하세요.

## 링크

- 서비스: https://publishonce.app
- 문의: publishonce.app@gmail.com
- 라이선스: [MIT](./LICENSE)

> 이 README의 번역은 기계 번역의 도움을 받았으며 원어민의 검수를 받지 않았습니다. 영어판과 일본어판이 기준입니다.
