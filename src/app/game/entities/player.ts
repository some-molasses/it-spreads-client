import { CONFIG } from "@/app/config";
import { Circle } from "./circle";

const ACCELERATION = 1.7;
const DECELERATION = 0.6;
const MAX_SPEED = ACCELERATION * 9;

export class Player extends Circle {
  dx: number = 0;
  dy: number = 0;

  constructor() {
    super(50, 50, 25, "#353ffc");
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
