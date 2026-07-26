import "dotenv/config";
import { REST, Routes } from "discord.js";
import { loadCommands } from "./lib/loadCommands.js";

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  console.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set (see .env.example).");
  process.exit(1);
}

const commands = (await loadCommands()).map((command) => command.data.toJSON());
const rest = new REST().setToken(DISCORD_TOKEN);

const route = DISCORD_GUILD_ID
  ? Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID)
  : Routes.applicationCommands(DISCORD_CLIENT_ID);

const result = await rest.put(route, { body: commands });
console.log(`Deployed ${result.length} slash command(s)${DISCORD_GUILD_ID ? ` to guild ${DISCORD_GUILD_ID}` : " globally"}.`);
