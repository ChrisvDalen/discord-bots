import "dotenv/config";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { getPlayer } from "./player.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();
client.player = getPlayer(client);

async function loadCommands() {
  const commandsDir = path.join(__dirname, "commands");
  const groups = readdirSync(commandsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());

  for (const group of groups) {
    const groupDir = path.join(commandsDir, group.name);
    const files = readdirSync(groupDir).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(groupDir, file);
      const command = (await import(pathToFileURL(filePath).href)).default;

      if (!command?.data || !command?.execute) {
        console.warn(`Skipping ${filePath}: missing "data" or "execute" export.`);
        continue;
      }

      client.commands.set(command.data.name, command);
    }
  }
}

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing /${interaction.commandName}:`, error);
    const payload = { content: "Er ging iets mis bij het uitvoeren van dit command.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  }
});

await loadCommands();
client.login(process.env.DISCORD_TOKEN);
