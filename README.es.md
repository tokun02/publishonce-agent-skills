# PublishOnce — Agent Skills

[English](./README.md) · [日本語](./README.ja.md) · **Español** · [简体中文](./README.zh.md) · [한국어](./README.ko.md) · [Português](./README.pt.md) · [Français](./README.fr.md) · [Deutsch](./README.de.md)

Una skill para que los agentes de IA (Claude Code y otros) **publiquen y programen vídeos en YouTube, TikTok, Instagram, Facebook y LinkedIn de una sola vez**. Usa la API pública de [PublishOnce](https://publishonce.app) mediante una CLI sin dependencias (`scripts/publishonce.js`).

> **Alcance actual**: solo publicaciones de vídeo. Aún no se admiten publicaciones solo de texto o solo de imagen, ni X, Threads, Pinterest y Bluesky (previstos). Lo disponible en cada red depende de la revisión de la API de esa red.

## Instalación

Recomendado: usar la [CLI de skills](https://www.npmjs.com/package/skills).

```bash
npx skills add tokun02/publishonce-agent-skills
```

Añade `-a claude-code` (por ejemplo) para elegir un agente.

### Instalación manual

Clona el repositorio y coloca `skills/publishonce` en la carpeta de skills de tu agente (ejemplo: Claude Code).

```bash
git clone https://github.com/tokun02/publishonce-agent-skills.git
ln -s "$(pwd)/publishonce-agent-skills/skills/publishonce" ~/.claude/skills/publishonce
```

Cualquier agente que pueda ejecutar comandos de shell puede usarla: que lea `skills/publishonce/SKILL.md` y ejecute `scripts/publishonce.js`.

## Configuración

1. Crea una cuenta en [publishonce.app](https://publishonce.app) y conecta las redes en las que quieres publicar.
2. Crea una clave de API en [Ajustes → Claves de API](https://publishonce.app/settings/api) (`po_live_…` es real; `po_test_…` es de prueba y no publica nada).
3. Pide al agente que guarde la clave, o ejecuta:

```bash
./skills/publishonce/scripts/publishonce.js setup --key po_live_xxxxxxxx --global
```

La clave se guarda en `~/.config/publishonce/config.json` (o usa la variable de entorno `PUBLISHONCE_API_KEY`). No pegues nunca la clave en un chat ni en un commit.

## Qué puede hacer

- Subir un vídeo y **publicarlo en varias redes a la vez**
- **Programar** publicaciones (hasta 30 días)
- Guardar un **borrador** dentro de PublishOnce y publicarlo más tarde
- Enviar un vídeo a los **borradores de la app de TikTok** o a un **borrador de página de Facebook**
- Consultar el estado y las URL públicas
- Descripción por red, nivel de privacidad de TikTok, declaración «para niños» de YouTube, etiquetas de contenido generado por IA

## Uso

Pídelo al agente con lenguaje natural, en cualquier idioma.

> Programa este vídeo para mañana a las 18:00 en YouTube y TikTok. La descripción es «Presentamos nuestro nuevo producto».

El agente confirma las cuentas y el contenido y publica **solo después de tu aprobación** (nunca publica sin aprobación).

## Redes compatibles

| Red | Vídeo | Notas |
|---|---|---|
| YouTube | sí (Shorts) | Hasta que termine la revisión de la API de YouTube, los vídeos publicados por API quedan en privado |
| TikTok | sí | Hay que indicar la privacidad. También puede enviar a los borradores de la app |
| Instagram | sí (Reels) | Solo público |
| Facebook | sí (vídeo de página) | Solo público. También puede guardar un borrador de página |
| LinkedIn | sí | Solo público |

## Requisitos

- Node.js 18 o superior
- Un agente que pueda ejecutar comandos de shell
- Una cuenta de PublishOnce y una clave de API

## API y MCP

- Documentación pública: https://publishonce.app/docs
- Consúltala para la API REST (`/api/v1`) y el servidor MCP.

## Enlaces

- Servicio: https://publishonce.app
- Contacto: publishonce.app@gmail.com
- Licencia: [MIT](./LICENSE)

> Las traducciones de este README se prepararon con ayuda automática y no han sido revisadas por hablantes nativos. Las versiones en inglés y japonés son la referencia.
