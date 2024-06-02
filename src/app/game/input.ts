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
      !State.localPlayerIndex
    ) {
      throw new Error("No local player index");
    }

    if (this.keys.get("w")) {
      State.players[State.localPlayerIndex!].accelerate("up");
    }

    if (this.keys.get("a")) {
      State.players[State.localPlayerIndex!].accelerate("left");
    }

    if (this.keys.get("s")) {
      State.players[State.localPlayerIndex!].accelerate("down");
    }

    if (this.keys.get("d")) {
      State.players[State.localPlayerIndex!].accelerate("right");
    }
  }
}
