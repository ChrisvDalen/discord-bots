import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { getActiveQueue } from "../../lib/musicQueue.js";

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauzeer de muziek").setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const queue = getActiveQueue(interaction);
    if (!queue) {
      return interaction.reply({ content: "Er speelt niks om te pauzeren.", flags: MessageFlags.Ephemeral });
    }

    if (queue.node.isPaused()) {
      return interaction.reply({ content: "Staat al gepauzeerd.", flags: MessageFlags.Ephemeral });
    }

    queue.node.setPaused(true);
    return interaction.reply("⏸️ Gepauzeerd.");
  },
};
