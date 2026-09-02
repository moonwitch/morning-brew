import React from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userName: string) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quick-capture-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "440px", alignItems: "center", textAlign: "center" }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "-0.5rem" }}>☕✨</div>
        <h2>Sign in to MorningBrew</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Sync your tasks across devices and connect your work sources safely.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
          <button
            type="button"
            className="action-btn"
            style={{
              padding: "0.8rem",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontWeight: 600,
              width: "100%",
            }}
            onClick={() => {
              onLogin("Kelly Crabbé");
              onClose();
            }}
          >
            <span>🌐</span> Sign in with Google Workspace
          </button>

          <button
            type="button"
            className="action-btn"
            style={{
              padding: "0.8rem",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontWeight: 600,
              width: "100%",
            }}
            onClick={() => {
              onLogin("Kelly Crabbé");
              onClose();
            }}
          >
            <span>🔐</span> Sign in with Company SSO
          </button>

          <button
            type="button"
            className="action-btn"
            style={{
              padding: "0.6rem",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              width: "100%",
            }}
            onClick={onClose}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
