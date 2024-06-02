import {
  ClientSentWebsocketMessage,
  ServerSentWebsocketMessage,
  Team,
  Teams,
} from "../../../message-types";
import { PageHandler } from "../page-handler";
import { Player } from "./entities/player";
import { Spill } from "./spill";
import { WebsocketHandler } from "./websocket-handler";

export class State {
  static players: Record<number, Player | undefined> = {};
  static localPlayerId: number | null = null;

  static maxPlayersPerTeam: number;
  static isGameComplete: boolean = false;

  static spills = {
    [Team.GREEN]: new Spill(Team.GREEN),
    [Team.PURPLE]: new Spill(Team.PURPLE),
  };

  static get activePlayers() {
    const playersByTeam: Record<Team, Player[]> = {
      [Team.GREEN]: [],
      [Team.PURPLE]: [],
    };

    for (const player of Object.values(this.players)) {
      if (player) {
        playersByTeam[player.team].push(player);
      }
    }

    const sortedPlayers = {
      [Team.GREEN]: playersByTeam[Team.GREEN].sort(
        (a, b) => a.creationTime - b.creationTime
      ),
      [Team.PURPLE]: playersByTeam[Team.PURPLE].sort(
        (a, b) => a.creationTime - b.creationTime
      ),
    };

    return {
      [Team.GREEN]: sortedPlayers[Team.GREEN].slice(0, State.maxPlayersPerTeam),
      [Team.PURPLE]: sortedPlayers[Team.PURPLE].slice(
        0,
        State.maxPlayersPerTeam
      ),
    };
  }

  static updateFromServer(data: ServerSentWebsocketMessage) {
    switch (data.type) {
      case "HANDSHAKE": {
        const handshakeData =
          data as ServerSentWebsocketMessage.HandshakeMessage;
        State.localPlayerId = handshakeData.localPlayerId;
        State.players[State.localPlayerId] = new Player(
          0,
          0,
          0,
          0,
          Team.GREEN,
          Date.now(),
          true
        );

        State.sendStateUpdate();
        break;
      }
      case "STATE": {
        const stateData = data as ServerSentWebsocketMessage.GameStateMessage;

        State.maxPlayersPerTeam = stateData.state.maxPlayersPerTeam;

        State.setPlayers(data.state.players);

        for (const team of Teams) {
          State.spills[team].setPoints(
            stateData.state.teams[team].spill.points
          );
        }

        const totalScore =
          stateData.state.teams[Team.GREEN].score +
          stateData.state.teams[Team.PURPLE].score;

        for (const team of Teams) {
          PageHandler.setScorePercentage(
            team,
            stateData.state.teams[team].score / totalScore
          );
        }

        PageHandler.setRemainingTime(stateData.state.timeRemaining);
        PageHandler.setMessage(
          `Reinforcements coming! Each team currently has room for ${
            stateData.state.maxPlayersPerTeam
          } player${stateData.state.maxPlayersPerTeam !== 1 ? "s" : ""}.`
        );

        if (stateData.state.timeRemaining <= 0) {
          PageHandler.mainDisplay.outerHTML = "";
          PageHandler.scoreDisplay.style.display = "block";

          PageHandler.greenScoreText.innerText = `Green score: ${stateData.state.teams[
            Team.GREEN
          ].score.toString()}`;
          PageHandler.purpleScoreText.innerText = `Purple score: ${stateData.state.teams[
            Team.PURPLE
          ].score.toString()}`;

          const winner =
            stateData.state.teams[Team.PURPLE].score >
            stateData.state.teams[Team.GREEN].score
              ? "Purple"
              : "Green";

          PageHandler.winnerText.innerText = `${winner} wins!`;
          State.isGameComplete = true;
        }

        break;
      }
    }
  }

  static getSendableState(): ClientSentWebsocketMessage {
    if (!this.localPlayerId && this.localPlayerId !== 0) {
      throw new Error("No local player id");
    }

    if (!this.players[this.localPlayerId]) {
      throw new Error("Local player does not exist");
    }

    return {
      type: "STATE",
      payload: {
        localPlayerId: this.localPlayerId,
        player: {
          x: this.players[this.localPlayerId]!.x,
          y: this.players[this.localPlayerId]!.y,
          dx: this.players[this.localPlayerId]!.dx,
          dy: this.players[this.localPlayerId]!.dy,
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

  static setPlayers(
    data: Record<number, [number, number, number, number, Team, number]>
  ) {
    const currentPlayerIds = Object.keys(this.players);
    const playersProcessed: Record<string, boolean> = {};

    for (const id of currentPlayerIds) {
      playersProcessed[id] = false;
    }

    Object.entries(data).forEach(([id, dataset]) => {
      playersProcessed[id] = true;

      if (Number(id) === State.localPlayerId) {
        if (!State.players[Number(id)]) {
          throw new Error("No local player?");
        }

        State.players[Number(id)]!.team = dataset[4];
        State.players[Number(id)]!.creationTime = dataset[5];
        return;
      }

      State.players[Number(id)] = new Player(
        dataset[0],
        dataset[1],
        dataset[2],
        dataset[3],
        dataset[4],
        dataset[5],
        false
      );
    });

    // delete unprocessed players
    console.log(data, playersProcessed);
    for (const id of currentPlayerIds) {
      if (!playersProcessed[id]) {
        console.log(`Deleting player ${id}`);
        State.players[Number(id)] = undefined;
      }
    }
  }
}
