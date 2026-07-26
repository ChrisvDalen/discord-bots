# Discord Bot

Node.js + discord.js bot, built in small patches per feature group.

## Setup

Requires [ffmpeg](https://ffmpeg.org) on your `PATH` for music playback (`brew install ffmpeg` on macOS).

```bash
npm install
cp .env.example .env   # fill in DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID
npm run deploy-commands # registers slash commands
npm start
```

`youtube-dl-exec` is a direct dependency because `discord-player-youtubei` imports it
without declaring it — without it the bot fails to start at all. Its postinstall
downloads a `yt-dlp` binary; on a restricted network use
`npm install --ignore-scripts`, which still lets the bot boot and only gives up the
yt-dlp fallback path.

## Tests

```bash
npm test   # node --test, no framework
```

## Structure

- `src/index.js` — client bootstrap, interaction handler, process-level error handling
- `src/deploy-commands.js` — registers slash commands with Discord's API
- `src/lib/loadCommands.js` — shared command loader used by both entry points
- `src/lib/jsonStore.js` — atomic JSON persistence under `data/`
- `src/commands/<group>/<command>.js` — each command exports `{ data, execute }`

## Patches

1. **Music** (`src/commands/music`) — discord-player + YouTube extractor: `/play`, `/skip`, `/queue`, `/pause`, `/resume`, `/stop`
2. **Friendly** (`src/commands/fun`) — `/compliment`, `/vibecheck`, `/hug`, `/highfive`, `/wouldyourather`, `/streak`
3. **Roast** (`src/commands/roast`) — `/roast`, `/roastme` (safe-topics-only, self-opt-out)

Secrets live in `.env` (gitignored), never hardcoded.
