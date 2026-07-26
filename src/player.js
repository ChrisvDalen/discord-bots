import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";

// Registration is async: awaiting it keeps a failure from surfacing as an
// unhandled rejection, and guarantees extractors are ready before the first /play.
export async function createPlayer(client) {
  const player = new Player(client);

  // discord-player treats "error" as a required event on each of these emitters:
  // without a listener the underlying EventEmitter throws and kills the process.
  player.on("error", (error) => console.error("Player error:", error));
  player.extractors.on("error", (error) => console.error("Extractor error:", error));
  player.events.on("error", (queue, error) => console.error(`Queue error in ${queue.guild?.name}:`, error));
  player.events.on("playerError", (queue, error) => console.error(`Playback error in ${queue.guild?.name}:`, error));

  await player.extractors.register(YoutubeiExtractor, {});
  return player;
}
