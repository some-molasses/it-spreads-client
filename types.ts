export interface ServerSentWebsocketMessage {
  type: "STATE";
  payload: ServerSentWebsocketMessage.GameStatePayload;
}

export namespace ServerSentWebsocketMessage {
  export interface GameStatePayload {
    state: GameState;
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
    player: {
      x: number;
      y: number;
      dx: number;
      dy: number;
    };
  }
}
