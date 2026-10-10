# PublishOnce — Agent Skills

[English](./README.md) · [日本語](./README.ja.md) · [Español](./README.es.md) · [简体中文](./README.zh.md) · [한국어](./README.ko.md) · [Português](./README.pt.md) · **Français** · [Deutsch](./README.de.md)

Une skill qui permet aux agents d'IA (Claude Code et autres) de **publier et programmer des vidéos sur YouTube, TikTok, Instagram, Facebook et LinkedIn en une seule fois**. Elle appelle l'API publique de [PublishOnce](https://publishonce.app) via une CLI sans dépendances (`scripts/publishonce.js`).

> **Périmètre actuel** : publications vidéo uniquement. Les publications texte seul ou image seule, ainsi que X, Threads, Pinterest et Bluesky, ne sont pas encore prises en charge (prévu). Ce qui est disponible sur chaque réseau dépend de la validation de l'API de ce réseau.

## Installation

Recommandé : utiliser la [CLI skills](https://www.npmjs.com/package/skills).

```bash
npx skills add tokun02/publishonce-agent-skills
```

Ajoutez `-a claude-code` (par exemple) pour cibler un agent.

### Installation manuelle

Clonez le dépôt et placez `skills/publishonce` dans le dossier de skills de votre agent (exemple : Claude Code).

```bash
git clone https://github.com/tokun02/publishonce-agent-skills.git
ln -s "$(pwd)/publishonce-agent-skills/skills/publishonce" ~/.claude/skills/publishonce
```

Tout agent capable d'exécuter des commandes shell peut l'utiliser : demandez-lui de lire `skills/publishonce/SKILL.md` et d'exécuter `scripts/publishonce.js`.

## Configuration

1. Créez un compte sur [publishonce.app](https://publishonce.app) et connectez les réseaux sur lesquels publier.
2. Créez une clé d'API dans [Paramètres → Clés d'API](https://publishonce.app/settings/api) (`po_live_…` est réelle ; `po_test_…` sert aux essais et ne publie rien).
3. Demandez à l'agent d'enregistrer la clé, ou exécutez :

```bash
./skills/publishonce/scripts/publishonce.js setup --key po_live_xxxxxxxx --global
```

La clé est enregistrée dans `~/.config/publishonce/config.json` (ou utilisez la variable d'environnement `PUBLISHONCE_API_KEY`). Ne collez jamais la clé dans un chat ou un commit.

## Ce que la skill peut faire

- Téléverser une vidéo et la **publier sur plusieurs réseaux à la fois**
- **Programmer** des publications (jusqu'à 30 jours)
- Enregistrer un **brouillon** dans PublishOnce et le publier plus tard
- Envoyer une vidéo dans les **brouillons de l'app TikTok** ou en **brouillon de Page Facebook**
- Consulter l'état et les URL publiques
- Légende par réseau, niveau de confidentialité TikTok, déclaration « contenu pour enfants » de YouTube, étiquettes de contenu généré par IA

## Utilisation

Demandez simplement à l'agent, en langage naturel et dans la langue de votre choix.

> Programme cette vidéo pour demain à 18 h sur YouTube et TikTok. La légende est « Découvrez notre nouveau produit ».

L'agent confirme les comptes et le contenu, puis publie **uniquement après votre accord** (il ne publie jamais sans accord).

## Réseaux pris en charge

| Réseau | Vidéo | Remarques |
|---|---|---|
| YouTube | oui (Shorts) | Tant que la validation de l'API YouTube n'est pas terminée, les vidéos publiées par API sont privées |
| TikTok | oui | Un niveau de confidentialité est obligatoire. Peut aussi envoyer aux brouillons de l'app |
| Instagram | oui (Reels) | Public uniquement |
| Facebook | oui (vidéo de Page) | Public uniquement. Peut aussi enregistrer un brouillon de Page |
| LinkedIn | oui | Public uniquement |

## Prérequis

- Node.js 18 ou plus récent
- Un agent capable d'exécuter des commandes shell
- Un compte PublishOnce et une clé d'API

## API et MCP

- Documentation publique : https://publishonce.app/docs
- Consultez-la pour l'API REST (`/api/v1`) et le serveur MCP.

## Liens

- Service : https://publishonce.app
- Contact : publishonce.app@gmail.com
- Licence : [MIT](./LICENSE)

> Les traductions de ce README ont été réalisées avec une aide automatique et n'ont pas été relues par des locuteurs natifs. Les versions anglaise et japonaise font foi.
