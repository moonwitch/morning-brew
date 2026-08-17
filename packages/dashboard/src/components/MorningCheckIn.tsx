import React, { useState } from "react";
import { Sparkles, Moon, Sun, Flame, CheckCircle, ArrowRight } from "lucide-react";

export type EnergyLevel = "gentle" | "steady" | "full";

interface MorningCheckInProps {
  currentLevel: EnergyLevel;
  onSelectLevel: (level: EnergyLevel) => void;
  showMoodReflection: boolean;
  onStartBrewingRitual?: () => void;
}

export function MorningCheckIn({
  currentLevel,
  onSelectLevel,
  showMoodReflection,
  onStartBrewingRitual,
}: MorningCheckInProps) {
  const [moodText, setMoodText] = useState("");
  const [isRitualActive, setIsRitualActive] = useState(false);
  const [ritualStep, setRitualStep] = useState<1 | 2 | 3>(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Guided Brewing Ritual Banner */}
      <div className="energy-banner">
        <div className="energy-info">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "4px" }}>
            <Sparkles size={18} color="var(--accent-amber)" />
            <h2>Guided Morning Brewing Ritual ☕</h2>
          </div>
          <p>Mindful 3-step daily check-in to calibrate focus and prevent executive overwhelm.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="energy-selector">
            <button
              type="button"
              className={`energy-btn ${currentLevel === "gentle" ? "active-gentle" : ""}`}
              onClick={() => onSelectLevel("gentle")}
              title="Low energy focus (~90m capacity)"
            >
              🌿 Gentle (~90m)
            </button>
            <button
              type="button"
              className={`energy-btn ${currentLevel === "steady" ? "active-steady" : ""}`}
              onClick={() => onSelectLevel("steady")}
              title="Balanced focus (~180m capacity)"
            >
              ⚡ Steady (~180m)
            </button>
            <button
              type="button"
              className={`energy-btn ${currentLevel === "full" ? "active-full" : ""}`}
              onClick={() => onSelectLevel("full")}
              title="High cognitive energy (~300m capacity)"
            >
              🚀 Full Power (~300m)
            </button>
          </div>

          <button
            type="button"
            className="action-btn"
            style={{ backgroundColor: "var(--accent-amber)", color: "#140f0c", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}
            onClick={() => setIsRitualActive(true)}
          >
            Start Ritual <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Interactive Guided Ritual Modal / Card */}
      {isRitualActive && (
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "2px solid var(--accent-amber)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="badge badge-should">Step {ritualStep} of 3: {ritualStep === 1 ? "Reflect on Yesterday" : ritualStep === 2 ? "Calibrate Energy & Capacity" : "Finalize Today's Focus"}</span>
            <button type="button" className="action-btn" onClick={() => setIsRitualActive(false)}>✕ Close</button>
          </div>

          {ritualStep === 1 && (
            <div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Step 1: Review Yesterday & Clear Working Memory</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Unfinished tasks from yesterday have been automatically reviewed. Park items you won't touch today so they leave working memory.
              </p>
              <button
                type="button"
                className="action-btn"
                style={{ backgroundColor: "var(--accent-teal)", color: "#fff", fontWeight: 600 }}
                onClick={() => setRitualStep(2)}
              >
                Next: Calibrate Energy & Capacity →
              </button>
            </div>
          )}

          {ritualStep === 2 && (
            <div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Step 2: Choose Today's Cognitive Energy Budget</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Select how much mental energy you have today. MorningBrew will cap task capacity so you don't over-commit.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" className={`action-btn ${currentLevel === "gentle" ? "active-gentle" : ""}`} onClick={() => onSelectLevel("gentle")}>🌿 Gentle (~90m)</button>
                <button type="button" className={`action-btn ${currentLevel === "steady" ? "active-steady" : ""}`} onClick={() => onSelectLevel("steady")}>⚡ Steady (~180m)</button>
                <button type="button" className={`action-btn ${currentLevel === "full" ? "active-full" : ""}`} onClick={() => onSelectLevel("full")}>🚀 Full Power (~300m)</button>
              </div>
              <button
                type="button"
                className="action-btn"
                style={{ backgroundColor: "var(--accent-teal)", color: "#fff", fontWeight: 600, marginTop: "1rem" }}
                onClick={() => setRitualStep(3)}
              >
                Next: Finalize Today's Focus →
              </button>
            </div>
          )}

          {ritualStep === 3 && (
            <div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Step 3: Ready to Brew!</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Your day plan is calibrated. Excess tasks are safely stored in the Set-Aside Drawer with clear filter explanations.
              </p>
              <button
                type="button"
                className="action-btn"
                style={{ backgroundColor: "var(--accent-amber)", color: "#140f0c", fontWeight: 700 }}
                onClick={() => setIsRitualActive(false)}
              >
                ✓ Complete Ritual & Start Work
              </button>
            </div>
          )}
        </div>
      )}

      {/* Optional Mood Reflection */}
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
