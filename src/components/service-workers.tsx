"use client"; // ✅ Now it's a Client Component

import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      Promise.all([
        navigator.serviceWorker.register("/custom-sw.js"),
        navigator.serviceWorker.register("/sw.js"),
      ])
        .then((registrations) => {
          registrations.forEach((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null; // No UI needed
}
