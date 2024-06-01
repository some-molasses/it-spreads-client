import { ClientSentWebsocketMessage } from "../../../message-types";
import { State } from "./state";

const URL = "https://it-spreads-server.onrender.com/";

export class WebsocketHandler {
  static ws: WebSocket;

  static get canSend() {
    return this.ws.readyState === WebSocket.OPEN;
  }

  static init(): Promise<void> {
    if (this.ws) {
      console.warn("Websocket already initialized");
      return Promise.reject();
    }

    this.ws = new WebSocket(URL);

    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject();
        throw new Error("Illegal state: no websocket?");
      }

      this.ws.onopen = (evt) => {
        resolve();
      };

      this.ws.onmessage = (event) => {
        console.log(event.data);
        State.updateFromServer(JSON.parse(event.data));
      };
    });
  }

  static send(message: ClientSentWebsocketMessage) {
    console.log(`sending`, message);
    this.ws.send(JSON.stringify(message));
  }
}
