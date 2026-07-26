import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import { getActiveQueue } from "../../lib/musicQueue.js";

export default {
  data: new SlashCommandBuilder().setName("stop").setDescription("Stop de muziek en verlaat het voice channel").setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const queue = getActiveQueue(interaction);
    if (!queue) {
      return interaction.reply({ content: "Er speelt niks om te stoppen.", flags: MessageFlags.Ephemeral });
    }

    queue.delete();
    return interaction.reply("⏹️ Gestopt en voice channel verlaten.");
  },
};
