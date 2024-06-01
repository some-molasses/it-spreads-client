import {
  ClientSentWebsocketMessage,
  ServerSentWebsocketMessage,
} from "../../../types";
import { Player } from "./entities/player";
import { Spill } from "./spill";

export class State {
  static player = new Player();

  static spill = new Spill();

  static updateFromServer(data: ServerSentWebsocketMessage) {
    this.spill.setPoints(data.payload.state.teams[0].spill.points);
  }

  static getSendableState(): ClientSentWebsocketMessage {
    return {
      type: "STATE",
      payload: {
        player: {
          x: this.player.x,
          y: this.player.y,
          dx: this.player.dx,
          dy: this.player.dy,
        },
      },
    };
  }
}
