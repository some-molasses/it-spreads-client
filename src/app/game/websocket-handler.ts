const URL = "https://it-spreads-server.onrender.com/";

export class WebsocketHandler {
  static init() {
    const ws = new WebSocket(URL);

    if (!ws) {
      throw new Error("No websocket?");
    }

    ws.onopen = (evt) => {
      ws.send("hello server!!");
    };
  }
}
