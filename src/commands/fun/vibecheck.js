import { SlashCommandBuilder } from "discord.js";
import { VIBE_MOODS } from "../../lib/complimentData.js";

export default {
  data: new SlashCommandBuilder().setName("vibecheck").setDescription("Check je huidige vibe"),

  async execute(interaction) {
    const mood = VIBE_MOODS[Math.floor(Math.random() * VIBE_MOODS.length)];
    const percentage = Math.floor(Math.random() * 41) + 60; // 60-100%, keep it positive
    return interaction.reply(`${mood.emoji} Vibe check voor ${interaction.user}: **${percentage}% ${mood.label}**`);
  },
};
