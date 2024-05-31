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
    const SPEED = 8;
    if (this.keys.get("w")) {
      State.player.accelerate("up");
    }

    if (this.keys.get("a")) {
      State.player.accelerate("left");
    }

    if (this.keys.get("s")) {
      State.player.accelerate("down");
    }

    if (this.keys.get("d")) {
      State.player.accelerate("right");
    }
  }
}
