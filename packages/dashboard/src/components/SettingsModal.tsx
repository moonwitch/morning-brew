import React, { useState } from "react";
import type { IntegrationSource } from "./SourceManager.tsx";
import { renderSourceIcon } from "./SourceManager.tsx";
import type { ThemePreference } from "../App.tsx";
import { Settings, X, Check, Plus, Users, BarChart2, Briefcase, User, Laptop, Moon, Sun, Key } from "lucide-react";

export type UseCaseMode = "work_and_personal" | "personal_only";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: IntegrationSource[];
  onToggleSource: (sourceId: string) => void;
  showMoodReflection: boolean;
  onToggleMoodReflection: () => void;
  useCaseMode: UseCaseMode;
  onSelectUseCaseMode: (mode: UseCaseMode) => void;
  themePref: ThemePreference;
  onSelectThemePref: (pref: ThemePreference) => void;
  onOpenCaregivers: () => void;
  onOpenWeeklyReport: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  sources,
  onToggleSource,
  showMoodReflection,
  onToggleMoodReflection,
  useCaseMode,
  onSelectUseCaseMode,
  themePref,
  onSelectThemePref,
  onOpenCaregivers,
  onOpenWeeklyReport,
}: SettingsModalProps) {
  const [configuringSourceId, setConfiguringSourceId] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quick-capture-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px", maxHeight: "88vh", overflowY: "auto" }}
      >
        <div className="quick-capture-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings size={20} /> Preferences & Integration Settings
          </h2>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Theme Preference Setting */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Theme Mode Preference</h3>
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              System mode automatically syncs with your OS light/dark preference.
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className="action-btn"
                style={{
                  flex: 1,
                  backgroundColor: themePref === "system" ? "var(--accent-amber)" : "var(--bg-input)",
                  color: themePref === "system" ? "#140f0c" : "var(--text-secondary)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
                onClick={() => onSelectThemePref("system")}
              >
                <Laptop size={15} /> System OS Auto
              </button>

              <button
                type="button"
                className="action-btn"
                style={{
                  flex: 1,
                  backgroundColor: themePref === "dark" ? "var(--accent-amber)" : "var(--bg-input)",
                  color: themePref === "dark" ? "#140f0c" : "var(--text-secondary)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
                onClick={() => onSelectThemePref("dark")}
              >
                <Moon size={15} /> Coffee Dark
              </button>

              <button
                type="button"
                className="action-btn"
                style={{
                  flex: 1,
                  backgroundColor: themePref === "light" ? "var(--accent-amber)" : "var(--bg-input)",
                  color: themePref === "light" ? "#140f0c" : "var(--text-secondary)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
                onClick={() => onSelectThemePref("light")}
              >
                <Sun size={15} /> Warm Light
              </button>
            </div>
          </div>
        </div>

        {/* Work vs Personal Mode Toggle */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>App Usage Mode</h3>
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Choose whether organizational G-Factor scoring and team metrics are enabled.
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className="action-btn"
                style={{
                  flex: 1,
                  backgroundColor: useCaseMode === "work_and_personal" ? "var(--accent-amber)" : "var(--bg-input)",
                  color: useCaseMode === "work_and_personal" ? "#140f0c" : "var(--text-secondary)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
                onClick={() => onSelectUseCaseMode("work_and_personal")}
              >
                <Briefcase size={16} /> Work & Personal (G-Factor ⚡)
              </button>

              <button
                type="button"
                className="action-btn"
                style={{
                  flex: 1,
                  backgroundColor: useCaseMode === "personal_only" ? "var(--accent-teal)" : "var(--bg-input)",
                  color: useCaseMode === "personal_only" ? "#fff" : "var(--text-secondary)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
                onClick={() => onSelectUseCaseMode("personal_only")}
              >
                <User size={16} /> Personal Only
              </button>
            </div>
          </div>
        </div>

        {/* Shortcuts Section */}
        <div style={{ marginBottom: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <button
            type="button"
            className="action-btn"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-strong)",
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontWeight: 600,
            }}
            onClick={onOpenCaregivers}
          >
            <Users size={16} color="var(--accent-teal)" /> Co-Brewers & Caregivers 🤝
          </button>

          <button
            type="button"
            className="action-btn"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-strong)",
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontWeight: 600,
            }}
            onClick={onOpenWeeklyReport}
          >
            <BarChart2 size={16} color="var(--accent-amber)" /> Weekly Velocity Report 📊
          </button>
        </div>

        {/* Integration Sources Management Section */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h3 style={{ fontSize: "1rem" }}>Task & Calendar Integration Connectors</h3>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Toggle to sync tasks</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sources.map((source) => {
              const isEnabled = source.status === "connected";
              const isConfiguring = configuringSourceId === source.id;

              return (
                <div
                  key={source.id}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.85rem 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        className="brand-icon-wrapper"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "var(--bg-input)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {renderSourceIcon(source.id, 18)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{source.name}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{source.type} • {isEnabled ? `${source.taskCount} synced` : "Disabled"}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        type="button"
                        className="action-btn"
                        style={{ fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.2rem" }}
                        onClick={() => setConfiguringSourceId(isConfiguring ? null : source.id)}
                      >
                        <Key size={13} /> {isConfiguring ? "Close" : "Configure"}
                      </button>

                      <button
                        type="button"
                        className="action-btn"
                        style={{
                          backgroundColor: isEnabled ? "var(--accent-teal-light)" : "var(--bg-input)",
                          color: isEnabled ? "var(--accent-teal)" : "var(--text-muted)",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                        onClick={() => onToggleSource(source.id)}
                      >
                        {isEnabled ? <><Check size={14} /> Active</> : <><Plus size={14} /> Enable</>}
                      </button>
                    </div>
                  </div>

                  {/* Inline API Credential Configuration Form */}
                  {isConfiguring && (
                    <div
                      style={{
                        backgroundColor: "var(--bg-input)",
                        border: "1px solid var(--border-strong)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.75rem",
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        type="password"
                        className="quick-input"
                        style={{ fontSize: "0.85rem", padding: "0.5rem" }}
                        placeholder={`Enter ${source.name} API Key or Token...`}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                      />
                      <button
                        type="button"
                        className="action-btn"
                        style={{ backgroundColor: "var(--accent-amber)", color: "#140f0c", fontWeight: 700, whiteSpace: "nowrap" }}
                        onClick={() => {
                          setConfiguringSourceId(null);
                          setApiKeyInput("");
                        }}
                      >
                        Save Key
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
