import React, { useState } from "react";

export type EnergyLevel = "gentle" | "steady" | "full";

interface MorningCheckInProps {
  currentLevel: EnergyLevel;
  onSelectLevel: (level: EnergyLevel) => void;
  showMoodReflection: boolean;
}

export function MorningCheckIn({ currentLevel, onSelectLevel, showMoodReflection }: MorningCheckInProps) {
  const [moodText, setMoodText] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="energy-banner">
        <div className="energy-info">
          <h2>Morning Energy Check-in</h2>
          <p>Calibrate today's focus capacity to match your real cognitive energy level.</p>
        </div>

        <div className="energy-selector">
          <button
            type="button"
            className={`energy-btn ${currentLevel === "gentle" ? "active-gentle" : ""}`}
            onClick={() => onSelectLevel("gentle")}
          >
            🌿 Gentle (~90m)
          </button>
          <button
            type="button"
            className={`energy-btn ${currentLevel === "steady" ? "active-steady" : ""}`}
            onClick={() => onSelectLevel("steady")}
          >
            ⚡ Steady (~180m)
          </button>
          <button
            type="button"
            className={`energy-btn ${currentLevel === "full" ? "active-full" : ""}`}
            onClick={() => onSelectLevel("full")}
          >
            🚀 Full Power (~300m)
          </button>
        </div>
      </div>

      {showMoodReflection && (
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem 1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>💭 Optional Morning Mood Reflection</h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Can be disabled in Settings ⚙️</span>
          </div>
          <textarea
            className="quick-input"
            style={{ fontSize: "0.95rem", padding: "0.75rem", borderRadius: "var(--radius-md)", minHeight: "64px" }}
            placeholder="How are you feeling this morning? What's on your mind? (Optional private note)"
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
