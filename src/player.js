import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";

let player;

export function getPlayer(client) {
  if (!player) {
    player = new Player(client);
    player.extractors.register(YoutubeiExtractor, {});
  }
  return player;
}
