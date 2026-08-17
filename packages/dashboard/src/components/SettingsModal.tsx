import React from "react";
import type { IntegrationSource } from "./SourceManager.tsx";
import { renderSourceIcon } from "./SourceManager.tsx";
import type { ThemePreference } from "../App.tsx";
import { Settings, X, Check, Plus, Users, BarChart2, Briefcase, User, Laptop, Moon, Sun } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quick-capture-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px", maxHeight: "85vh", overflowY: "auto" }}
      >
        <div className="quick-capture-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings size={20} /> Preferences & Integrations
          </h2>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Theme Preference Setting */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Theme & Color Scheme</h3>
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
              Choose your default theme mode. System mode automatically detects your OS light/dark preference.
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
            <div>
              <div style={{ fontWeight: 600 }}>Work & Personal vs Personal Only</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Choose whether to enable organizational G-Factor scoring and team velocity reporting.
              </div>
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
                <User size={16} /> Personal Only (No Org Metrics)
              </button>
            </div>
          </div>
        </div>

        {/* Co-Brewers & Weekly Velocity Shortcuts */}
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

        {/* Dashboard Features Section */}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "240px", overflowY: "auto" }}>
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
