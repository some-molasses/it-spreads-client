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
        const data = JSON.parse(event.data);
        if (data.type !== "HANDSHAKE") {
          resolve();
        }
        State.updateFromServer(data);
      };
    });
  }

  static send(message: ClientSentWebsocketMessage) {
    this.ws.send(JSON.stringify(message));
  }
}
