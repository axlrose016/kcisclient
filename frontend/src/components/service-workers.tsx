"use client"; // ✅ Now it's a Client Component

import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/custom-sw.js")
        .then((registration) => {
          console.log("Service worker registered with scope", registration.scope);
        })
        .catch((error) => {
          console.log("Service Worker registration failed: ", error);
        });
    }
  }, []);

  return null; // No UI needed
}
