import { SlashCommandBuilder } from "discord.js";
import { getActiveQueue } from "../../lib/musicQueue.js";

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauzeer de muziek"),

  async execute(interaction) {
    const queue = getActiveQueue(interaction);
    if (!queue) {
      return interaction.reply({ content: "Er speelt niks om te pauzeren.", ephemeral: true });
    }

    if (queue.node.isPaused()) {
      return interaction.reply({ content: "Staat al gepauzeerd.", ephemeral: true });
    }

    queue.node.setPaused(true);
    return interaction.reply("⏸️ Gepauzeerd.");
  },
};
