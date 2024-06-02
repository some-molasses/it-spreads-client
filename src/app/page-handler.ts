import { Team } from "../../message-types";

export class PageHandler {
  private static getElement(id: string, name: string) {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`No ${name} found`);
    }
    return element;
  }

  private static get messageElement() {
    return this.getElement("messages", "message element");
  }

  private static get remainingTimeElement() {
    return this.getElement("remaining-time", "time element");
  }

  static getScoreBar(team: Team) {
    const teamname = team === Team.GREEN ? "green" : "purple";
    return this.getElement(`${teamname}-score-bar`, `${teamname} score bar`);
  }

  static setMessage(message: string) {}

  static setRemainingTime(time: number) {
    const seconds = Math.floor((time % 60000) / 1000);
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    this.remainingTimeElement.innerText = `${Math.floor(
      time / (60 * 1000)
    )}:${secondsString}`;
  }

  static setScorePercentage(team: Team, percentage: number) {
    this.getScoreBar(team).style.width = `${percentage * 100}%`;
  }
}
