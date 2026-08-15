import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// Register PWA Service Worker for Offline Capability
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("☕ [PWA Service Worker] Registered successfully:", registration.scope);
      })
      .catch((error) => {
        console.warn("☕ [PWA Service Worker] Registration failed:", error);
      });
  });
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
