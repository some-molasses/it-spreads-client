import { ClientSentWebsocketMessage } from "../../../types";
import { State } from "./state";

const URL = "https://it-spreads-server.onrender.com/";

export class WebsocketHandler {
  static ws: WebSocket;
  static init() {
    this.ws = new WebSocket(URL);

    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject();
        throw new Error("Illegal state: no websocket?");
      }

      this.ws.onopen = (evt) => {
        this.ws.send("hello server!!");
        console.log(evt);
        resolve(null);
      };

      this.ws.onmessage = (event) => {
        console.log(event.data);
        State.updateFromServer(JSON.parse(event.data));
      };
    });
  }

  static send(message: ClientSentWebsocketMessage) {
    this.ws.send(JSON.stringify(message));
  }
}
