import { CONFIG } from "../config";
import { Circle } from "./entities/circle";
import { State } from "./state";

const INITIAL_CIRCLE_RADIUS = 5;
const CIRCLE_GROWTH_PERIOD_MS = 800;
const MAX_CIRCLE_RADIUS = 50;

const SOFT_BORDER_MARGIN = 100;

const SPREAD_DISTANCE = MAX_CIRCLE_RADIUS;
const POINT_MAXIMUM = 150;
const SPREAD_INTERVAL = 75;

const SPILL_POINT_GROWTH_RATE = 0.4;
const SPILL_POINT_SWEEP_RATE = SPILL_POINT_GROWTH_RATE * 3;
const SWEEP_RADIUS = 150;

const MAX_ANTI_SCORE = MAX_CIRCLE_RADIUS * POINT_MAXIMUM;

const MAX_SEED = 10000;

/**
 * - have points move away from player by biasing the random function
 */
export class Spill {
  points: SpillPoint[] = [];

  constructor() {
    this.points.push(
      new SpillPoint(600, 500, INITIAL_CIRCLE_RADIUS, Date.now() % MAX_SEED, 0)
    );

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

  get score() {
    return (
      MAX_ANTI_SCORE - this.points.reduce((acc, point) => acc + point.r, 0)
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const point of this.points) {
      point.draw(ctx);
    }
  }

  setPoints(pointData: [number, number, number, number][]) {
    this.points = pointData.map((point, index) => {
      const [x, y, r, seed] = point;
      return new SpillPoint(x, y, r, seed, index);
    });
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
        CONFIG.inWidth(x, MAX_CIRCLE_RADIUS),
        CONFIG.inHeight(y, MAX_CIRCLE_RADIUS),
        INITIAL_CIRCLE_RADIUS,
        Date.now() % MAX_SEED,
        this.points.length
      )
    );
  }

  update() {
    for (const point of this.points) {
      // point.update();
    }
  }
}

class SpillPoint extends Circle {
  seed: number = Date.now();
  dying: boolean = false;

  constructor(
    x: number,
    y: number,
    radius: number,
    seed: number,
    index: number
  ) {
    super(x, y, radius, SpillPoint.getColour(seed));

    this.seed = seed;
  }

  get isDead() {
    return this.r <= 0;
  }

  get growthState(): SpillPoint.State {
    if (this.dying) {
      return SpillPoint.State.SHRINKING;
    }

    if (this.r <= MAX_CIRCLE_RADIUS) {
      return SpillPoint.State.GROWING;
    }

    if (
      Math.abs(((this.seed - Date.now()) % CIRCLE_GROWTH_PERIOD_MS) * 2) <
      CIRCLE_GROWTH_PERIOD_MS
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
        Math.sin((Date.now() - this.seed) / 1000) * POINT_MOTION_DISTANCE,
      this.y + Math.cos((Date.now() - this.seed) / 700) * POINT_MOTION_DISTANCE
    );
  }

  // update() {
  //   if (this.growthState === SpillPoint.State.SHRINKING) {
  //     this.r -= SPILL_POINT_GROWTH_RATE;
  //   }

  //   if (this.growthState === SpillPoint.State.GROWING) {
  //     this.r += SPILL_POINT_GROWTH_RATE;
  //   }

  //   if (this.dying) {
  //     return;
  //   }

  //   const playerDistance = State.player.distanceTo(this);
  //   if (playerDistance < SWEEP_RADIUS) {
  //     this.r -= Math.pow(
  //       SPILL_POINT_SWEEP_RATE *
  //         ((SWEEP_RADIUS - playerDistance) / SWEEP_RADIUS + 0.5),
  //       1.2
  //     );

  //     if (this.r <= 0) {
  //       this.dying = true;
  //     }

  //     return;
  //   }
  // }

  private static getColour(seed: number, isEnemy: boolean = false): string {
    const green = {
      h: 140,
      s: 99,
      l: 27,
      a: 0.25,
    };

    const purple = {
      h: 263,
      s: 96,
      l: 16,
      a: 0.5,
    };

    const colour = isEnemy ? green : purple;

    const randomFactorH = (seed % 100) / 100;
    const randomFactorL = (seed % 70) / 70;

    const dhue = (randomFactorH - 0.5) * 30;
    const dlight = (randomFactorL - 0.5) * 4;

    return `hsla(${colour.h + dhue}, ${colour.s}%, ${colour.l + dlight}%, ${
      colour.a
    })`;
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
