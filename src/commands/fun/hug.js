import { SlashCommandBuilder } from "discord.js";
import { HUG_LINES } from "../../lib/complimentData.js";

export default {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Geef iemand een knuffel")
    .addUserOption((option) => option.setName("persoon").setDescription("Wie krijgt de knuffel?")),

  async execute(interaction) {
    const target = interaction.options.getUser("persoon");
    const line = HUG_LINES[Math.floor(Math.random() * HUG_LINES.length)];

    if (!target || target.id === interaction.user.id) {
      return interaction.reply(`🤗 ${interaction.user} knuffelt zichzelf, want soms heb je dat nodig.`);
    }

    return interaction.reply(`🤗 ${interaction.user} ${line} ${target}`);
  },
};
