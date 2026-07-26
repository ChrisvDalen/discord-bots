import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { getActiveQueue } from "../../lib/musicQueue.js";

export default {
  data: new SlashCommandBuilder().setName("resume").setDescription("Hervat de muziek").setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const queue = getActiveQueue(interaction);
    if (!queue) {
      return interaction.reply({ content: "Er speelt niks om te hervatten.", flags: MessageFlags.Ephemeral });
    }

    if (!queue.node.isPaused()) {
      return interaction.reply({ content: "Staat niet gepauzeerd.", flags: MessageFlags.Ephemeral });
    }

    queue.node.setPaused(false);
    return interaction.reply("▶️ Hervat.");
  },
};
