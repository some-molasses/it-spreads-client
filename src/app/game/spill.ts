import { CONFIG } from "../config";
import { Circle } from "./entities/circle";
import { State } from "./state";

const CIRCLE_WIDTH = 5;
const MAX_CIRCLE_WIDTH = 50;

const SPREAD_DISTANCE = MAX_CIRCLE_WIDTH;
const POINT_MAXIMUM = 150;
const SPREAD_INTERVAL = 75;

const SPILL_POINT_GROWTH_RATE = 0.4;
const SPILL_POINT_SWEEP_RATE = SPILL_POINT_GROWTH_RATE * 2;

const SWEEP_RADIUS = 125;

/**
 * - have points shrink faster when nearer to player
 * - have points move away from player by biasing the random function
 */
export class Spill {
  points: SpillPoint[] = [];

  constructor() {
    this.points.push(new SpillPoint(600, 500));

    const interval = setInterval(() => {
      if (this.points.length < 0) {
        clearInterval(interval);
        // win condition
        return;
      }

      if (this.points.length >= POINT_MAXIMUM) {
        this.points[this.points.length - POINT_MAXIMUM].dying = true;
      }

      if (this.points[0].isDead) {
        this.points.shift();
      }

      if (this.points.length > 0 && this.points.length < POINT_MAXIMUM) {
        this.spread();
      }
    }, SPREAD_INTERVAL);
  }

  update() {
    for (const point of this.points) {
      point.update();
    }
  }

  spread() {
    const base = this.points[this.points.length - 1]; // random walk

    const x = base.x + (Math.random() * SPREAD_DISTANCE * 2 - SPREAD_DISTANCE);
    const y = base.y + (Math.random() * SPREAD_DISTANCE * 2 - SPREAD_DISTANCE);

    this.points.push(
      new SpillPoint(
        Math.max(
          Math.min(x, CONFIG.WIDTH - MAX_CIRCLE_WIDTH),
          MAX_CIRCLE_WIDTH
        ),
        Math.max(
          Math.min(y, CONFIG.HEIGHT - MAX_CIRCLE_WIDTH),
          MAX_CIRCLE_WIDTH
        )
      )
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const point of this.points) {
      point.draw(ctx);
    }
  }
}

class SpillPoint extends Circle {
  creationTime: number = Date.now();
  dying: boolean = false;

  constructor(x: number, y: number) {
    super(x, y, CIRCLE_WIDTH, "#00880077");
  }

  get isDead() {
    return this.r <= 0;
  }

  update() {
    if (this.dying) {
      this.r -= SPILL_POINT_GROWTH_RATE;
      return;
    }

    const playerDistance = State.player.distanceTo(this);
    if (playerDistance < SWEEP_RADIUS) {
      this.r -= SPILL_POINT_SWEEP_RATE * (playerDistance / SWEEP_RADIUS + 0.5);

      if (this.r <= 0) {
        this.dying = true;
      }

      return;
    }

    if (this.r < MAX_CIRCLE_WIDTH) {
      this.r += SPILL_POINT_GROWTH_RATE;
    }
  }
}
