import "dotenv/config";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { REST, Routes } from "discord.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function collectCommandData() {
  const commandsDir = path.join(__dirname, "commands");
  const groups = readdirSync(commandsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const commandData = [];

  for (const group of groups) {
    const groupDir = path.join(commandsDir, group.name);
    const files = readdirSync(groupDir).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(groupDir, file);
      const command = (await import(pathToFileURL(filePath).href)).default;
      if (command?.data) {
        commandData.push(command.data.toJSON());
      }
    }
  }

  return commandData;
}

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  console.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set (see .env.example).");
  process.exit(1);
}

const commands = await collectCommandData();
const rest = new REST().setToken(DISCORD_TOKEN);

const route = DISCORD_GUILD_ID
  ? Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID)
  : Routes.applicationCommands(DISCORD_CLIENT_ID);

const result = await rest.put(route, { body: commands });
console.log(`Deployed ${result.length} slash command(s)${DISCORD_GUILD_ID ? ` to guild ${DISCORD_GUILD_ID}` : " globally"}.`);
