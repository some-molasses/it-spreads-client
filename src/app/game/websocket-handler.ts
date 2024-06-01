import { State } from "./state";

const URL = "https://it-spreads-server.onrender.com/";

export class WebsocketHandler {
  static init() {
    const ws = new WebSocket(URL);

    return new Promise((resolve, reject) => {
      if (!ws) {
        reject();
        throw new Error("No websocket?");
      }

      ws.onopen = (evt) => {
        ws.send("hello server!!");
        console.log(evt);
        resolve(null);
      };

      ws.onmessage = (event) => {
        console.log(event.data);
        State.updateFromServer(event.data);
      };
    });
  }
}
