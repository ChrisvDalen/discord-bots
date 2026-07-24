import { SlashCommandBuilder } from "discord.js";
import { DILEMMAS } from "../../lib/complimentData.js";

export default {
  data: new SlashCommandBuilder().setName("wouldyourather").setDescription("Genereert een dilemma om over te stemmen"),

  async execute(interaction) {
    const [optionA, optionB] = DILEMMAS[Math.floor(Math.random() * DILEMMAS.length)];
    await interaction.reply(`🤔 Zou je liever...\n🇦 **${optionA}**\n...of...\n🇧 **${optionB}**?`);

    const message = await interaction.fetchReply();
    await message.react("🇦");
    await message.react("🇧");
  },
};
