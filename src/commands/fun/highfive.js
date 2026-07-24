import { SlashCommandBuilder } from "discord.js";
import { HIGHFIVE_LINES } from "../../lib/complimentData.js";

export default {
  data: new SlashCommandBuilder()
    .setName("highfive")
    .setDescription("Geef iemand een high five")
    .addUserOption((option) => option.setName("persoon").setDescription("Wie krijgt de high five?")),

  async execute(interaction) {
    const target = interaction.options.getUser("persoon");
    const line = HIGHFIVE_LINES[Math.floor(Math.random() * HIGHFIVE_LINES.length)];

    if (!target || target.id === interaction.user.id) {
      return interaction.reply(`✋ ${interaction.user} klapt zichzelf een high five toe.`);
    }

    return interaction.reply(`✋ ${interaction.user} ${line} ${target}`);
  },
};
