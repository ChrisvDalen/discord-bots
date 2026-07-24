import { SlashCommandBuilder } from "discord.js";
import { getActiveQueue } from "../../lib/musicQueue.js";

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Toon de wachtrij"),

  async execute(interaction) {
    const queue = getActiveQueue(interaction);
    if (!queue) {
      return interaction.reply({ content: "Er is geen actieve wachtrij.", ephemeral: true });
    }

    const upcoming = queue.tracks.toArray();
    const lines = [`▶️ Nu: **${queue.currentTrack.cleanTitle}**`];

    if (upcoming.length === 0) {
      lines.push("Verder niks in de wachtrij.");
    } else {
      lines.push(
        ...upcoming.slice(0, 10).map((track, index) => `${index + 1}. ${track.cleanTitle}`)
      );
      if (upcoming.length > 10) {
        lines.push(`...en nog ${upcoming.length - 10} meer.`);
      }
    }

    return interaction.reply(lines.join("\n"));
  },
};
