export type ServerSentWebsocketMessage =
  | ServerSentWebsocketMessage.GameStateMessage
  | ServerSentWebsocketMessage.HandshakeMessage;

export namespace ServerSentWebsocketMessage {
  export interface GameStateMessage {
    type: "STATE";
    state: GameState;
  }

  export interface HandshakeMessage {
    type: "HANDSHAKE";
    localPlayerIndex: number;
  }

  export interface GameState {
    teams: Record<Team, TeamState>;
  }

  export interface TeamState {
    player: Coords;
    spill: SpillData;
  }

  export interface SpillData {
    /** x, y, radius, seed */
    points: [number, number, number, number][];
  }

  export type Coords = [number, number];

  export enum Team {
    GREEN,
    PURPLE,
  }
}

export interface ClientSentWebsocketMessage {
  type: "STATE";
  payload: ClientSentWebsocketMessage.GameStatePayload;
}

export namespace ClientSentWebsocketMessage {
  export interface GameStatePayload {
    localPlayerIndex: number;
    player: {
      x: number;
      y: number;
      dx: number;
      dy: number;
    };
  }
}
