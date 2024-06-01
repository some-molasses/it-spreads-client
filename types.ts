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
    points: Coords[];
  }

  export type Coords = [number, number];

  export enum Team {
    GREEN,
    PURPLE,
  }
}
