# Modular Discord Bot

SkyNet Bot is a modular, production-ready Discord bot built with Node.js and discord.js v14. It provides a Discord bot command handler, slash commands, event handlers, moderation tools, private support tickets, welcome embeds, automatic roles, and moderation logs.

## Install

Requirements:

- Node.js 18.17.0 or newer
- A Discord application and bot
- A Discord server where you can configure the bot
- The required Discord permissions and intents

1. Clone or download the project.

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Configure the environment variables:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id_here
GUILD_ID=your_development_guild_id_here

WELCOME_CHANNEL_ID=channel_id_for_welcome_messages
AUTO_ROLE_ID=role_id_for_new_members

TICKET_CATEGORY_ID=category_id_for_ticket_channels
ADMIN_ROLE_ID=role_id_that_can_view_and_close_tickets

MOD_LOG_CHANNEL_ID=channel_id_for_moderation_logs
```

`DISCORD_TOKEN` and `CLIENT_ID` are required. `GUILD_ID` is recommended during development because guild commands register immediately. Leave it empty for global command registration.

5. In the Discord Developer Portal, enable the Server Members Intent for the bot.

6. Invite the bot with the `bot` and `applications.commands` scopes. Grant the permissions required by the enabled features, including View Channels, Send Messages, Embed Links, Read Message History, Manage Messages, Moderate Members, Manage Channels, and Manage Roles.

7. Register the slash commands:

```bash
npm run register
```

## Use

Start the bot:

```bash
npm start
```

Available commands:

- `/ping` measures bot round-trip latency and Discord API latency.
- `/purge kolicina` deletes between 1 and 100 recent messages. Administrator permission is required. Messages older than 14 days are skipped by Discord.
- `/timeout korisnik vreme razlog` applies a timeout for a duration such as `10m`, `2h`, or `1d`. The maximum supported duration is 28 days, and Moderate Members permission is required.
- `/setup-tickets` posts a ticket panel with the “📩 Otvori tiket” button. Administrator permission is required.

When a user opens a ticket, the bot creates a private text channel. The ticket owner and administrators can view it. If `ADMIN_ROLE_ID` is configured, members with that role can also view and close tickets. The ticket includes a “Zatvori tiket” button and is deleted five seconds after closure.

The welcome system runs when a member joins. If `AUTO_ROLE_ID` is configured, the bot assigns that role. If `WELCOME_CHANNEL_ID` is configured, it sends an embed welcome message to that channel.

Set `MOD_LOG_CHANNEL_ID` to receive embeds for purge actions, timeouts, and closed tickets.

The project uses this structure:

```text
.
├── commands/
│   ├── ping.js
│   ├── purge.js
│   ├── setup-tickets.js
│   └── timeout.js
├── events/
│   ├── guildCreate.js
│   ├── guildMemberAdd.js
│   ├── interactionCreate.js
│   └── ready.js
├── utils/
│   ├── duration.js
│   ├── logging.js
│   └── tickets.js
├── .env.example
├── .gitignore
├── config.js
├── deploy-commands.js
├── index.js
└── package.json
```

---

More Discord bot projects by EnderDevelopment: https://github.com/EnderDevelopment

Project page: https://dash.enderdevelopment.com/community/7e71d4bd-2327-469c-92cf-8a45d74cdae2?utm_source=github&utm_medium=readme&utm_campaign=auto_publish&utm_content=7e71d4bd-2327-469c-92cf-8a45d74cdae2
