import { SlashCommandBuilder } from "discord.js";
import { checkIn } from "../../lib/streakStore.js";

export default {
  data: new SlashCommandBuilder().setName("streak").setDescription("Dagelijkse check-in, houdt je streak bij"),

  async execute(interaction) {
    const { streak, alreadyCheckedInToday } = checkIn(interaction.user.id);

    if (alreadyCheckedInToday) {
      return interaction.reply({
        content: `📅 Je hebt vandaag al ingecheckt. Huidige streak: **${streak}** dag${streak === 1 ? "" : "en"}. Kom morgen terug!`,
        ephemeral: true,
      });
    }

    return interaction.reply(`🔥 ${interaction.user} heeft ingecheckt! Streak: **${streak}** dag${streak === 1 ? "" : "en"}.`);
  },
};
