import React from "react";
import type { IntegrationSource } from "./SourceManager.tsx";
import { renderSourceIcon } from "./SourceManager.tsx";
import { Settings, X, Check, Plus } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: IntegrationSource[];
  onToggleSource: (sourceId: string) => void;
  showMoodReflection: boolean;
  onToggleMoodReflection: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  sources,
  onToggleSource,
  showMoodReflection,
  onToggleMoodReflection,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quick-capture-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "580px" }}
      >
        <div className="quick-capture-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings size={20} /> Preferences & Integrations
          </h2>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Dashboard Preferences Section */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Dashboard Features</h3>
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>💭 Morning Mood Reflection Card</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Show an optional morning notes field next to the Energy Check-in banner
              </div>
            </div>

            <button
              type="button"
              className="action-btn"
              style={{
                backgroundColor: showMoodReflection ? "var(--accent-teal-light)" : "var(--bg-input)",
                color: showMoodReflection ? "var(--accent-teal)" : "var(--text-muted)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
              onClick={onToggleMoodReflection}
            >
              {showMoodReflection ? <><Check size={14} /> Enabled</> : "Disabled"}
            </button>
          </div>
        </div>

        {/* Integration Sources Section */}
        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Task & Calendar Sources</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "300px", overflowY: "auto" }}>
            {sources.map((source) => {
              const isEnabled = source.status === "connected";
              return (
                <div
                  key={source.id}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.85rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className="brand-icon-wrapper" style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {renderSourceIcon(source.id, 16)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{source.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{source.type}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="action-btn"
                    style={{
                      backgroundColor: isEnabled ? "var(--accent-teal-light)" : "var(--bg-input)",
                      color: isEnabled ? "var(--accent-teal)" : "var(--text-muted)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                    onClick={() => onToggleSource(source.id)}
                  >
                    {isEnabled ? <><Check size={14} /> Connected</> : <><Plus size={14} /> Connect</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
