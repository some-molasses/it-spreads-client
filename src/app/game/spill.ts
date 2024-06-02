import { Team } from "../../../message-types";
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
  team: Team;

  constructor(team: Team) {
    this.team = team;
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
      return new SpillPoint(x, y, r, seed, this.team, index);
    });
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
    team: Team,
    index: number
  ) {
    super(x, y, radius, SpillPoint.getColour(seed, team));

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

  private static getColour(seed: number, team: Team): string {
    if (!State.localPlayerId) {
      throw new Error("Local player ID not set");
    }

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

    const colour = team === Team.GREEN ? purple : green;

    const randomFactorH = (seed % 100) / 100;
    const randomFactorL = (seed % 70) / 70;

    const dhue = (randomFactorH - 0.5) * 30;
    const dlight = (randomFactorL - 0.5) * 4;

    return `hsla(${colour.h + dhue}, ${colour.s}%, ${colour.l + dlight}%, ${
      State.players[State.localPlayerId].team === team ? 0.1 : 0.4
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
