import { Input } from "./game/input";
import { Spill } from "./game/spill";
import { State } from "./game/state";

export class CanvasController {
  static canvas: HTMLCanvasElement;
  static context: CanvasRenderingContext2D;

  static init() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas?.getContext("2d");
    if (!context) {
      console.error("Failed to get 2d context");
      return;
    }

    CanvasController.canvas = canvas;
    CanvasController.context = context;

    Input.setInputListeners();

    this.main();
  }

  static main() {
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

    requestAnimationFrame(CanvasController.main);
  }
}
