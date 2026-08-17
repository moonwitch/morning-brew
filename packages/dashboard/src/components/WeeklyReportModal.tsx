import React from "react";
import { BarChart2, CheckCircle2, Flame, Award, X } from "lucide-react";

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWorkMode: boolean;
}

export function WeeklyReportModal({ isOpen, onClose, isWorkMode }: WeeklyReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quick-capture-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        <div className="quick-capture-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BarChart2 size={20} color="var(--accent-amber)" /> Weekly Work Velocity & Energy Report 📊
          </h2>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Summary of planned vs completed tasks, energy pacing, and team impact for the past week.
        </p>

        {/* Weekly Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "0.5rem 0" }}>
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-teal)" }}>88%</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Task Completion Rate</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>14 of 16 planned tasks done</div>
          </div>

          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-amber)" }}>18.5 hrs</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Focused Work Delivered</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>Within daily capacity limits</div>
          </div>
        </div>

        {/* G-Factor Impact Section (Work Mode Only) */}
        {isWorkMode && (
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Award size={32} color="var(--accent-purple)" />
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>High G-Factor Team Impact ⚡</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                85% of completed tasks had a G-Factor score of 4 or 5, directly helping teammates and stakeholders.
              </div>
            </div>
          </div>
        )}

        {/* Energy Distribution Breakdown */}
        <div>
          <h3 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>Energy Pacing Breakdown:</h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="badge badge-could">🌿 2 Gentle Days (~90m)</span>
            <span className="badge badge-should">⚡ 3 Steady Days (~180m)</span>
            <span className="badge badge-must">🚀 2 Full Power Days (~300m)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
