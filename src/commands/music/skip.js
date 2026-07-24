import { SlashCommandBuilder } from "discord.js";
import { getActiveQueue } from "../../lib/musicQueue.js";

export default {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skip het huidige nummer"),

  async execute(interaction) {
    const queue = getActiveQueue(interaction);
    if (!queue) {
      return interaction.reply({ content: "Er speelt niks om te skippen.", ephemeral: true });
    }

    const skippedTrack = queue.currentTrack;
    queue.node.skip();
    return interaction.reply(`⏭️ **${skippedTrack.cleanTitle}** geskipt.`);
  },
};
