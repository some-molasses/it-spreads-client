"use client";

import React, { useEffect } from "react";
import { CanvasController } from "./main";
import { CONFIG } from "./config";

export default function Home() {
  useEffect(() => {
    CanvasController.init();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        textAlign: "center",
        margin: "20px",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>it-spreads.vercel.app</h1>
      <p style={{ margin: "20px" }}>
        Remaining time: <span id="remaining-time">-spreads.vercel.app</span>
      </p>
      <p>
        <span id="messages"></span>
      </p>
      <canvas
        id="canvas"
        width={CONFIG.WIDTH}
        height={CONFIG.HEIGHT}
        style={{ border: "1px solid #d3d3d3", backgroundColor: "white" }}
      >
        Your browser does not support the HTML canvas tag.
      </canvas>
      <div>
        <span>Scores</span>
        <div id="score-wrapper">
          <div className="score-bar-back">
            <div className="score-bar" id="green-score-bar"></div>
          </div>
          <div className="score-bar-back">
            <div className="score-bar" id="purple-score-bar"></div>
          </div>
        </div>
      </div>
      <div style={{ paddingBottom: "8px" }}>
        <span id="info"></span>
      </div>
    </div>
  );
}
