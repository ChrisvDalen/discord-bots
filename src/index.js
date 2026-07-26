import "dotenv/config";
import { Client, Collection, GatewayIntentBits, MessageFlags } from "discord.js";
import { loadCommands } from "./lib/loadCommands.js";
import { createPlayer } from "./player.js";

if (!process.env.DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN is not set (see .env.example).");
  process.exit(1);
}

// Node terminates on an unhandled rejection by default, which would take the bot
// down in every guild over a single failed API call.
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  // Process state is undefined after this point, so exit and let a supervisor
  // restart us rather than serving requests from a broken process.
  console.error("Uncaught exception, shutting down:", error);
  process.exit(1);
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

async function respondWithError(interaction) {
  const payload = {
    content: "Er ging iets mis bij het uitvoeren van dit command.",
    flags: MessageFlags.Ephemeral,
  };

  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(payload);
    } else {
      await interaction.reply(payload);
    }
  } catch (error) {
    // The interaction may have expired or been acknowledged elsewhere. There is
    // no way left to reach the user, but this must not become a fatal rejection.
    console.error("Could not deliver the error notice to the user:", error);
  }
}

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// An unhandled "error" event on an EventEmitter is thrown, so this must be bound.
client.on("error", (error) => {
  console.error("Discord client error:", error);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing /${interaction.commandName}:`, error);
    await respondWithError(interaction);
  }
});

client.player = await createPlayer(client);

for (const command of await loadCommands()) {
  client.commands.set(command.data.name, command);
}

await client.login(process.env.DISCORD_TOKEN);
