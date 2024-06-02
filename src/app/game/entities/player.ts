import { CONFIG } from "@/app/config";
import { Circle } from "./circle";
import { Team } from "../../../../message-types";

const ACCELERATION = 1.7;
const DECELERATION = 0.6;
const MAX_SPEED = ACCELERATION * 9;

const Colours = {
  purple: "hsl(244, 77%, 31%)",
  purpleInner: "hsl(244, 77%, 21%)",
  green: "hsl(139, 77%, 41%)",
  greenInner: "hsl(139, 77%, 31%)",
};

export class Player extends Circle {
  dx: number = 0;
  dy: number = 0;
  team: Team;
  isLocal: boolean;

  constructor(
    x: number,
    y: number,
    dx: number,
    dy: number,
    team: Team,
    isLocal: boolean
  ) {
    super(x, y, 25);

    this.dx = dx;
    this.dy = dy;

    this.team = team;
    this.isLocal = isLocal;
  }

  get colour(): string {
    return this.team === Team.GREEN ? Colours.green : Colours.purple;
  }

  get innerColour(): string {
    if (this.isLocal) {
      return this.team === Team.GREEN
        ? Colours.greenInner
        : Colours.purpleInner;
    } else {
      return "white";
    }
  }

  accelerate(dir: "left" | "right" | "up" | "down") {
    switch (dir) {
      case "up":
        this.dy -= ACCELERATION;
        break;
      case "down":
        this.dy += ACCELERATION;
        break;
      case "left":
        this.dx -= ACCELERATION;
        break;
      case "right":
        this.dx += ACCELERATION;
        break;
    }

    this.dx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, this.dx));
    this.dy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, this.dy));
  }

  draw(context: CanvasRenderingContext2D) {
    Circle.draw(context, this.x, this.y, this.r + 4, "white");
    Circle.draw(context, this.x, this.y, this.r, this.colour);
    Circle.draw(context, this.x, this.y, this.r - 8, this.innerColour);
  }

  private decelerate() {
    if (this.dx > 0) {
      this.dx -= DECELERATION;
    } else if (this.dx < 0) {
      this.dx += DECELERATION;
    }

    if (this.dy > 0) {
      this.dy -= DECELERATION;
    } else if (this.dy < 0) {
      this.dy += DECELERATION;
    }

    if (Math.abs(this.dx) <= DECELERATION) {
      this.dx = 0;
    }
    if (Math.abs(this.dy) <= DECELERATION) {
      this.dy = 0;
    }
  }

  private move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.y <= this.r) {
      this.y = this.r;
    }

    if (this.y >= CONFIG.HEIGHT - this.r) {
      this.y = CONFIG.HEIGHT - this.r;
    }

    if (this.x <= this.r) {
      this.x = this.r;
    }

    if (this.x >= CONFIG.WIDTH - this.r) {
      this.x = CONFIG.WIDTH - this.r;
    }
  }

  update() {
    this.move();
    this.decelerate();
  }
}
