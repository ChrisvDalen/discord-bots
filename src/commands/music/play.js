import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Speel een YouTube-link af of zoek op trefwoord")
    .addStringOption((option) =>
      option.setName("query").setDescription("YouTube-URL of zoekterm").setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply({ content: "Je moet in een voice channel zitten om muziek af te spelen.", ephemeral: true });
    }

    const query = interaction.options.getString("query", true);
    await interaction.deferReply();

    const player = interaction.client.player;

    try {
      const { track, queue } = await player.play(channel, query, {
        nodeOptions: {
          metadata: { channel: interaction.channel },
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 60_000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 300_000,
          leaveOnStop: true,
        },
      });

      const position = queue.tracks.toArray().length;
      const message = position > 0
        ? `🎵 **${track.cleanTitle}** toegevoegd aan de wachtrij (positie ${position + 1}).`
        : `🎵 **${track.cleanTitle}** wordt nu afgespeeld.`;

      return interaction.followUp(message);
    } catch (error) {
      console.error("/play failed:", error);
      return interaction.followUp("Kon dit niet afspelen. Controleer de link of zoekterm en probeer opnieuw.");
    }
  },
};
