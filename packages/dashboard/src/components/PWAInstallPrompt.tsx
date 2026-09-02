import { Download, Wifi, WifiOff, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import brewieLogo from "../brewie_logo.jpg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone;
    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
    }

    // Capture PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Capture online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("☕ MorningBrew PWA installed by user");
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Status Badge */}
      {isOffline && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "1rem",
            zIndex: 100,
            backgroundColor: "var(--accent-amber)",
            color: "#140f0c",
            fontWeight: 600,
            fontSize: "0.82rem",
            padding: "0.4rem 0.85rem",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <WifiOff size={14} /> Offline Mode — Local tasks saved
        </div>
      )}

      {/* PWA Home Screen Install Banner */}
      {(deferredPrompt || isIOS) && !isDismissed && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            zIndex: 110,
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            boxShadow: "var(--shadow-elevated)",
            maxWidth: "380px",
          }}
        >
          <img
            src={brewieLogo}
            alt="Brewie Mascot"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Add MorningBrew to Home Screen
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {isIOS
                ? "Tap Share 📤 then 'Add to Home Screen' 📲 for offline access"
                : "Download app for offline task management"}
            </div>
          </div>

          {!isIOS && deferredPrompt && (
            <button
              type="button"
              className="action-btn"
              style={{
                backgroundColor: "var(--accent-amber)",
                color: "#140f0c",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
              onClick={handleInstallClick}
            >
              <Download size={14} /> Install
            </button>
          )}

          <button
            type="button"
            className="action-btn"
            style={{ padding: "0.2rem" }}
            onClick={() => setIsDismissed(true)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
