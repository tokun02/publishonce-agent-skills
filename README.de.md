# PublishOnce — Agent Skills

[English](./README.md) · [日本語](./README.ja.md) · [Español](./README.es.md) · [简体中文](./README.zh.md) · [한국어](./README.ko.md) · [Português](./README.pt.md) · [Français](./README.fr.md) · **Deutsch**

Eine Skill, mit der KI-Agenten (Claude Code und andere) **Videos in einem Schritt auf YouTube, TikTok, Instagram, Facebook und LinkedIn veröffentlichen und planen** können. Sie ruft die öffentliche API von [PublishOnce](https://publishonce.app) über eine abhängigkeitsfreie CLI (`scripts/publishonce.js`) auf.

> **Aktueller Umfang**: nur Video-Beiträge. Reine Text- oder reine Bildbeiträge sowie X, Threads, Pinterest und Bluesky werden noch nicht unterstützt (geplant). Was in den einzelnen Netzwerken verfügbar ist, hängt von der API-Prüfung des jeweiligen Netzwerks ab.

## Installation

Empfohlen: die [skills-CLI](https://www.npmjs.com/package/skills) verwenden.

```bash
npx skills add tokun02/publishonce-agent-skills
```

Mit `-a claude-code` (Beispiel) wählen Sie einen bestimmten Agenten.

### Manuelle Installation

Klonen Sie das Repository und legen Sie `skills/publishonce` im Skills-Ordner Ihres Agenten ab (Beispiel: Claude Code).

```bash
git clone https://github.com/tokun02/publishonce-agent-skills.git
ln -s "$(pwd)/publishonce-agent-skills/skills/publishonce" ~/.claude/skills/publishonce
```

Jeder Agent, der Shell-Befehle ausführen kann, kann sie nutzen: Er soll `skills/publishonce/SKILL.md` lesen und `scripts/publishonce.js` ausführen.

## Einrichtung

1. Erstellen Sie ein Konto auf [publishonce.app](https://publishonce.app) und verbinden Sie die Netzwerke, auf denen Sie veröffentlichen möchten.
2. Erstellen Sie einen API-Schlüssel unter [Einstellungen → API-Schlüssel](https://publishonce.app/settings/api) (`po_live_…` ist echt; `po_test_…` ist zum Testen und veröffentlicht nichts).
3. Bitten Sie den Agenten, den Schlüssel zu speichern, oder führen Sie aus:

```bash
./skills/publishonce/scripts/publishonce.js setup --key po_live_xxxxxxxx --global
```

Der Schlüssel wird in `~/.config/publishonce/config.json` gespeichert (oder setzen Sie die Umgebungsvariable `PUBLISHONCE_API_KEY`). Fügen Sie den Schlüssel niemals in einen Chat oder Commit ein.

## Was sie kann

- Ein Video hochladen und **auf mehreren Netzwerken gleichzeitig veröffentlichen**
- Beiträge **planen** (bis zu 30 Tage im Voraus)
- Einen **Entwurf** in PublishOnce speichern und später veröffentlichen
- Ein Video in die **Entwürfe der TikTok-App** oder als **Entwurf einer Facebook-Seite** senden
- Status und öffentliche URLs abfragen
- Beschreibung pro Netzwerk, TikTok-Sichtbarkeit, YouTube-Angabe „für Kinder“, KI-Kennzeichnung

## Verwendung

Bitten Sie den Agenten einfach in natürlicher Sprache, in jeder Sprache.

> Plane dieses Video für morgen um 18 Uhr auf YouTube und TikTok. Die Beschreibung lautet „Unser neues Produkt“.

Der Agent bestätigt Konten und Inhalt und veröffentlicht **erst nach Ihrer Freigabe** (er veröffentlicht nie ohne Freigabe).

## Unterstützte Netzwerke

| Netzwerk | Video | Hinweise |
|---|---|---|
| YouTube | ja (Shorts) | Bis die API-Prüfung von YouTube abgeschlossen ist, sind per API veröffentlichte Videos privat |
| TikTok | ja | Eine Sichtbarkeit muss angegeben werden. Kann auch an die App-Entwürfe senden |
| Instagram | ja (Reels) | Nur öffentlich |
| Facebook | ja (Seitenvideo) | Nur öffentlich. Kann auch einen Seitenentwurf speichern |
| LinkedIn | ja | Nur öffentlich |

## Voraussetzungen

- Node.js 18 oder neuer
- Ein Agent, der Shell-Befehle ausführen kann
- Ein PublishOnce-Konto und ein API-Schlüssel

## API und MCP

- Öffentliche Dokumentation: https://publishonce.app/docs
- Dort finden Sie die REST-API (`/api/v1`) und den MCP-Server.

## Links

- Dienst: https://publishonce.app
- Kontakt: publishonce.app@gmail.com
- Lizenz: [MIT](./LICENSE)

> Die Übersetzungen dieser README wurden mit maschineller Hilfe erstellt und nicht von Muttersprachlern geprüft. Maßgeblich sind die englische und die japanische Fassung.
