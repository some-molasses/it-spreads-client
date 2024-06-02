import { State } from "./state";

export class Input {
  static keys = new Map<string, boolean>();

  static setInputListeners() {
    window.addEventListener("keydown", (event) => {
      this.keys.set(event.key, true);
    });

    window.addEventListener("keyup", (event) => {
      this.keys.set(event.key, false);
    });
  }

  static doInputResponse() {
    if (
      (this.keys.get("w") ||
        this.keys.get("a") ||
        this.keys.get("s") ||
        this.keys.get("d")) &&
      !State.localPlayerId &&
      State.localPlayerId !== 0
    ) {
      throw new Error("No local player id");
    }

    if (!State.players[State.localPlayerId!]) {
      throw new Error("Local player does not exist");
    }

    if (this.keys.get("w")) {
      State.players[State.localPlayerId!]!.accelerate("up");
    }

    if (this.keys.get("a")) {
      State.players[State.localPlayerId!]!.accelerate("left");
    }

    if (this.keys.get("s")) {
      State.players[State.localPlayerId!]!.accelerate("down");
    }

    if (this.keys.get("d")) {
      State.players[State.localPlayerId!]!.accelerate("right");
    }
  }
}
