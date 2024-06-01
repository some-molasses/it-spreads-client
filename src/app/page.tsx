"use client";

import React, { useEffect, useState } from "react";
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
      <h1 style={{ marginBottom: "20px" }}>it spreads aaaa</h1>
      <canvas
        id="canvas"
        width={CONFIG.WIDTH}
        height={CONFIG.HEIGHT}
        style={{ border: "1px solid #d3d3d3", backgroundColor: "white" }}
      >
        Your browser does not support the HTML canvas tag.
      </canvas>
      <div>
        <span id="info"></span>
      </div>
    </div>
  );
}
