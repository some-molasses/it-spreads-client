import {
  ClientSentWebsocketMessage,
  ServerSentWebsocketMessage,
} from "../../../message-types";
import { Player } from "./entities/player";
import { Spill } from "./spill";
import { WebsocketHandler } from "./websocket-handler";

export class State {
  static players: Record<number, Player> = {};
  static localPlayerId: number | null = null;

  static spill = new Spill();

  static updateFromServer(data: ServerSentWebsocketMessage) {
    switch (data.type) {
      case "HANDSHAKE": {
        const handshakeData =
          data as ServerSentWebsocketMessage.HandshakeMessage;
        State.localPlayerId = handshakeData.localPlayerId;
        State.players[State.localPlayerId] = new Player(0, 0, 0, 0, true);

        State.sendStateUpdate();
        break;
      }
      case "STATE": {
        const stateData = data as ServerSentWebsocketMessage.GameStateMessage;
        State.setPlayers(data.state.players);
        State.spill.setPoints(stateData.state.teams[0].spill.points);
        break;
      }
    }
  }

  static getSendableState(): ClientSentWebsocketMessage {
    if (!this.localPlayerId && this.localPlayerId !== 0) {
      throw new Error("No local player id");
    }

    return {
      type: "STATE",
      payload: {
        localPlayerId: this.localPlayerId,
        player: {
          x: this.players[this.localPlayerId].x,
          y: this.players[this.localPlayerId].y,
          dx: this.players[this.localPlayerId].dx,
          dy: this.players[this.localPlayerId].dy,
        },
      },
    };
  }

  static sendStateUpdate() {
    if (!WebsocketHandler.canSend) {
      throw new Error("Cannot send update yet!");
    }

    WebsocketHandler.send(State.getSendableState());
  }

  static setPlayers(data: Record<number, [number, number, number, number]>) {
    console.log(data);

    Object.entries(data).forEach(([id, dataset]) => {
      if (Number(id) === State.localPlayerId) {
        return;
      }

      State.players[Number(id)] = new Player(
        dataset[0],
        dataset[1],
        dataset[2],
        dataset[3],
        false
      );
    });
  }
}
