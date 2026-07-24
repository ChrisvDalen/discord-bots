import { SlashCommandBuilder } from "discord.js";
import { COMPLIMENTS } from "../../lib/complimentData.js";

export default {
  data: new SlashCommandBuilder()
    .setName("compliment")
    .setDescription("Geef iemand een compliment")
    .addUserOption((option) => option.setName("persoon").setDescription("Wie krijgt het compliment?")),

  async execute(interaction) {
    const target = interaction.options.getUser("persoon") ?? interaction.user;
    const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    return interaction.reply(`${target} ${compliment}`);
  },
};
