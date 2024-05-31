import { Circle } from "./entities/circle";
import { Player } from "./entities/player";
import { Spill } from "./spill";

export class State {
  static player = new Player();

  static spill = new Spill();
}
