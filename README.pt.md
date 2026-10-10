# PublishOnce — Agent Skills

[English](./README.md) · [日本語](./README.ja.md) · [Español](./README.es.md) · [简体中文](./README.zh.md) · [한국어](./README.ko.md) · **Português** · [Français](./README.fr.md) · [Deutsch](./README.de.md)

Uma skill para que agentes de IA (Claude Code e outros) **publiquem e agendem vídeos no YouTube, TikTok, Instagram, Facebook e LinkedIn de uma só vez**. Ela usa a API pública do [PublishOnce](https://publishonce.app) por meio de uma CLI sem dependências (`scripts/publishonce.js`).

> **Escopo atual**: somente publicações de vídeo. Publicações só de texto ou só de imagem, e X, Threads, Pinterest e Bluesky, ainda não são suportados (previstos). O que está disponível em cada rede depende da revisão da API dessa rede.

## Instalação

Recomendado: usar a [CLI de skills](https://www.npmjs.com/package/skills).

```bash
npx skills add tokun02/publishonce-agent-skills
```

Adicione `-a claude-code` (por exemplo) para escolher um agente.

### Instalação manual

Clone o repositório e coloque `skills/publishonce` na pasta de skills do seu agente (exemplo: Claude Code).

```bash
git clone https://github.com/tokun02/publishonce-agent-skills.git
ln -s "$(pwd)/publishonce-agent-skills/skills/publishonce" ~/.claude/skills/publishonce
```

Qualquer agente que execute comandos de shell pode usá-la: peça que leia `skills/publishonce/SKILL.md` e execute `scripts/publishonce.js`.

## Configuração

1. Crie uma conta em [publishonce.app](https://publishonce.app) e conecte as redes em que deseja publicar.
2. Crie uma chave de API em [Configurações → Chaves de API](https://publishonce.app/settings/api) (`po_live_…` é real; `po_test_…` é de teste e não publica nada).
3. Peça ao agente para salvar a chave ou execute:

```bash
./skills/publishonce/scripts/publishonce.js setup --key po_live_xxxxxxxx --global
```

A chave é salva em `~/.config/publishonce/config.json` (ou use a variável de ambiente `PUBLISHONCE_API_KEY`). Nunca cole a chave em um chat ou em um commit.

## O que ela faz

- Envia um vídeo e **publica em várias redes de uma vez**
- **Agenda** publicações (até 30 dias)
- Salva um **rascunho** dentro do PublishOnce para publicar depois
- Envia um vídeo para os **rascunhos do app do TikTok** ou para um **rascunho de Página do Facebook**
- Consulta o status e as URLs públicas
- Legenda por rede, nível de privacidade do TikTok, declaração «feito para crianças» do YouTube, rótulos de conteúdo gerado por IA

## Uso

Peça ao agente em linguagem natural, em qualquer idioma.

> Agende este vídeo para amanhã às 18h no YouTube e no TikTok. A legenda é «Conheça nosso novo produto».

O agente confirma as contas e o conteúdo e publica **somente depois da sua aprovação** (nunca publica sem aprovação).

## Redes compatíveis

| Rede | Vídeo | Observações |
|---|---|---|
| YouTube | sim (Shorts) | Até a revisão da API do YouTube terminar, os vídeos publicados pela API ficam privados |
| TikTok | sim | É preciso informar a privacidade. Também pode enviar aos rascunhos do app |
| Instagram | sim (Reels) | Somente público |
| Facebook | sim (vídeo de Página) | Somente público. Também pode salvar um rascunho de Página |
| LinkedIn | sim | Somente público |

## Requisitos

- Node.js 18 ou superior
- Um agente que execute comandos de shell
- Uma conta do PublishOnce e uma chave de API

## API e MCP

- Documentação pública: https://publishonce.app/docs
- Consulte-a para a API REST (`/api/v1`) e o servidor MCP.

## Links

- Serviço: https://publishonce.app
- Contato: publishonce.app@gmail.com
- Licença: [MIT](./LICENSE)

> As traduções deste README foram feitas com auxílio de tradução automática e não foram revisadas por falantes nativos. As versões em inglês e japonês são a referência.
