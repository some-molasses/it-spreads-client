import { CONFIG } from "../config";
import { Circle } from "./entities/circle";
import { State } from "./state";

const CIRCLE_WIDTH = 5;
const CIRCLE_GROWTH_PERIOD_MS = 800;
const MAX_CIRCLE_WIDTH = 50;

const SOFT_BORDER_MARGIN = 100;

const SPREAD_DISTANCE = MAX_CIRCLE_WIDTH;
const POINT_MAXIMUM = 150;
const SPREAD_INTERVAL = 75;

const SPILL_POINT_GROWTH_RATE = 0.4;
const SPILL_POINT_SWEEP_RATE = SPILL_POINT_GROWTH_RATE * 3;
const SWEEP_RADIUS = 150;

/**
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

    const leftBias = 1 - Math.min(base.x / SOFT_BORDER_MARGIN, 1);
    const rightBias = -(
      1 - Math.min((CONFIG.WIDTH - base.x) / SOFT_BORDER_MARGIN, 1)
    );

    const biasedXRand = Math.random() + leftBias + rightBias;
    const x = base.x + (biasedXRand * SPREAD_DISTANCE * 2 - SPREAD_DISTANCE);

    const y = base.y + (Math.random() * SPREAD_DISTANCE * 2 - SPREAD_DISTANCE);

    this.points.push(
      new SpillPoint(
        CONFIG.inWidth(x, MAX_CIRCLE_WIDTH),
        CONFIG.inHeight(y, MAX_CIRCLE_WIDTH)
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
    super(x, y, CIRCLE_WIDTH, SpillPoint.getColour());
  }

  get isDead() {
    return this.r <= 0;
  }

  get growthState(): SpillPoint.State {
    if (this.dying) {
      return SpillPoint.State.SHRINKING;
    }

    if (this.r <= MAX_CIRCLE_WIDTH) {
      return SpillPoint.State.GROWING;
    }

    if (
      Math.abs(
        ((this.creationTime - Date.now()) % CIRCLE_GROWTH_PERIOD_MS) * 2
      ) < CIRCLE_GROWTH_PERIOD_MS
    ) {
      return SpillPoint.State.GROWING;
    } else {
      return SpillPoint.State.SHRINKING;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    const POINT_MOTION_DISTANCE = 10;
    super.draw(
      context,
      this.x +
        Math.sin((Date.now() - this.creationTime) / 1000) *
          POINT_MOTION_DISTANCE,
      this.y +
        Math.cos((Date.now() - this.creationTime) / 700) * POINT_MOTION_DISTANCE
    );
  }

  update() {
    if (this.growthState === SpillPoint.State.SHRINKING) {
      this.r -= SPILL_POINT_GROWTH_RATE;
    }

    if (this.growthState === SpillPoint.State.GROWING) {
      this.r += SPILL_POINT_GROWTH_RATE;
    }

    if (this.dying) {
      return;
    }

    const playerDistance = State.player.distanceTo(this);
    if (playerDistance < SWEEP_RADIUS) {
      this.r -= Math.pow(
        SPILL_POINT_SWEEP_RATE *
          ((SWEEP_RADIUS - playerDistance) / SWEEP_RADIUS + 0.5),
        1.2
      );

      if (this.r <= 0) {
        this.dying = true;
      }

      return;
    }
  }

  private static getColour(isEnemy: boolean = true): string {
    const green = {
      h: 140,
      s: 99,
      l: 27,
    };

    const purple = {
      h: 263,
      s: 96,
      l: 16,
    };

    const colour = isEnemy ? purple : green;

    const dhue = (Math.random() - 0.5) * 30;
    const dlight = (Math.random() - 0.5) * 4;

    return `hsla(${colour.h + dhue}, ${colour.s}%, ${colour.l + dlight}%, 0.5)`;
  }
}

namespace SpillPoint {
  export enum State {
    GROWING,
    SHRINKING,
    SWEEPING,
    DEAD,
  }
}
