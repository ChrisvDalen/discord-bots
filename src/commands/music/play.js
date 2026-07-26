import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Speel een YouTube-link af of zoek op trefwoord")
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option.setName("query").setDescription("YouTube-URL of zoekterm").setRequired(true)
    ),

  async execute(interaction) {
    // setContexts keeps this out of DMs, but global commands propagate slowly, so
    // guard at runtime too: interaction.member is null outside a guild.
    if (!interaction.inCachedGuild()) {
      return interaction.reply({
        content: "Muziek werkt alleen in een server, niet in DM's.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply({
        content: "Je moet in een voice channel zitten om muziek af te spelen.",
        flags: MessageFlags.Ephemeral,
      });
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

      // queue.tracks holds only upcoming tracks, so its length is the new track's
      // position in the queue — matching how /queue numbers them.
      const position = queue.tracks.toArray().length;
      const message = position > 0
        ? `🎵 **${track.cleanTitle}** toegevoegd aan de wachtrij (positie ${position}).`
        : `🎵 **${track.cleanTitle}** wordt nu afgespeeld.`;

      return interaction.editReply(message);
    } catch (error) {
      console.error("/play failed:", error);
      return interaction.editReply("Kon dit niet afspelen. Controleer de link of zoekterm en probeer opnieuw.");
    }
  },
};
