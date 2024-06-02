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

  static get mainDisplay() {
    return this.getElement("game-content", "game content");
  }

  static get scoreDisplay() {
    return this.getElement("endgame-screen", "endgame screen");
  }

  static get greenScoreText() {
    return this.getElement("green-score", "green score");
  }

  static get purpleScoreText() {
    return this.getElement("purple-score", "purple score");
  }

  static get winnerText() {
    return this.getElement("winner-text", "winner text");
  }

  static getScoreBar(team: Team) {
    const teamname = team === Team.GREEN ? "green" : "purple";
    return this.getElement(`${teamname}-score-bar`, `${teamname} score bar`);
  }

  static setMessage(message: string) {
    this.messageElement.innerText = message;
  }

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
