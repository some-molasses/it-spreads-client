import { Team } from "../../message-types";
import { State } from "./game/state";

export class PageHandler {
  static getScoreBar(team: Team) {
    const teamname = team === Team.GREEN ? "green" : "purple";
    const element = document.getElementById(`${teamname}-score-bar`);

    if (!element) {
      throw new Error(`No score bar found for team ${team}`);
    }

    return element;
  }

  static setScorePercentage(team: Team, percentage: number) {
    this.getScoreBar(team).style.width = `${percentage * 100}%`;
  }
}
