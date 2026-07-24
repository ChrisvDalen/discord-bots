export function getActiveQueue(interaction) {
  const queue = interaction.client.player.nodes.get(interaction.guildId);
  if (!queue || !queue.currentTrack) {
    return null;
  }
  return queue;
}
