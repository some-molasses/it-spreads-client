import { Input } from "./game/input";
import { Spill } from "./game/spill";
import { State } from "./game/state";
import { WebsocketHandler } from "./game/websocket-handler";

export class CanvasController {
  static canvas: HTMLCanvasElement;
  static context: CanvasRenderingContext2D;

  static info: HTMLElement;

  static lastFrame: number = 0;
  static lastServerSend: number = 0;

  static async init() {
    if (this.canvas) {
      console.warn("CanvasController.init already called");
      return;
    }

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const info = document.getElementById("info") as HTMLCanvasElement;
    const context = canvas?.getContext("2d");
    if (!context) {
      console.error("Failed to get 2d context");
      return;
    }

    CanvasController.canvas = canvas;
    CanvasController.context = context;

    info.innerHTML = "Loading connection to server...";
    const timeout = setTimeout(
      () =>
        (info.innerHTML += "\nThis can take up to 50 seconds on initial load.")
    );
    await WebsocketHandler.init();
    clearTimeout(timeout);
    info.innerHTML = "Connected!";

    Input.setInputListeners();

    this.main();
  }

  static main() {
    requestAnimationFrame(CanvasController.main);

    if (Date.now() - CanvasController.lastFrame > 16) {
      CanvasController.lastFrame = Date.now();

      CanvasController.context.clearRect(
        0,
        0,
        CanvasController.canvas.width,
        CanvasController.canvas.height
      );

      for (const player of Object.values(State.players)) {
        player.draw(CanvasController.context);
      }
      State.spill.draw(CanvasController.context);

      Input.doInputResponse();

      /**these update functions might be useless */
      for (const player of Object.values(State.players)) {
        player.update();
      }
      State.spill.update();

      if (
        Date.now() - CanvasController.lastServerSend > 16 &&
        WebsocketHandler.canSend
      ) {
        CanvasController.lastServerSend = Date.now();
        State.sendStateUpdate();
      }
    }
  }
}
