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

  static init() {
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
    WebsocketHandler.init().then(() => {
      info.innerHTML = "Connected!";
    });

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

      State.player.draw(CanvasController.context);
      State.spill.draw(CanvasController.context);

      Input.doInputResponse();

      State.player.update();
      State.spill.update();

      /** @todo significantly reduce this ping time. */
      if (
        Date.now() - CanvasController.lastServerSend > 1000 &&
        WebsocketHandler.canSend
      ) {
        CanvasController.lastServerSend = Date.now();
        WebsocketHandler.send(State.getSendableState());
      }
    }
  }
}
