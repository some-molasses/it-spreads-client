import {
  ClientSentWebsocketMessage,
  ServerSentWebsocketMessage,
} from "../../../message-types";
import { Player } from "./entities/player";
import { Spill } from "./spill";

export class State {
  static players: Player[] = [];
  static localPlayerIndex: number | null = null;

  static spill = new Spill();

  static updateFromServer(data: ServerSentWebsocketMessage) {
    switch (data.type) {
      case "HANDSHAKE": {
        const handshakeData =
          data as ServerSentWebsocketMessage.HandshakeMessage;
        this.localPlayerIndex = handshakeData.localPlayerIndex;
        break;
      }
      case "STATE": {
        const stateData = data as ServerSentWebsocketMessage.GameStateMessage;
        this.spill.setPoints(stateData.state.teams[0].spill.points);
        break;
      }
    }
  }

  static getSendableState(): ClientSentWebsocketMessage {
    if (!this.localPlayerIndex) {
      throw new Error("No local player index");
    }

    return {
      type: "STATE",
      payload: {
        localPlayerIndex: this.localPlayerIndex,
        player: {
          x: this.players[this.localPlayerIndex].x,
          y: this.players[this.localPlayerIndex].y,
          dx: this.players[this.localPlayerIndex].dx,
          dy: this.players[this.localPlayerIndex].dy,
        },
      },
    };
  }
}
