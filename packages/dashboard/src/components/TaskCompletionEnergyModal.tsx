import React from "react";
import type { MorningBrewTask, EnergyFeel } from "@morningbrew/core";
import { Sparkles, BatteryCharging, CheckCircle2, X } from "lucide-react";
import brewieLogo from "../brewie_logo.jpg";

interface TaskCompletionEnergyModalProps {
  task: MorningBrewTask | null;
  onClose: () => void;
  onSubmitEnergyFeel: (taskId: string, feel: EnergyFeel) => void;
}

export function TaskCompletionEnergyModal({
  task,
  onClose,
  onSubmitEnergyFeel,
}: TaskCompletionEnergyModalProps) {
  if (!task) return null;

  const handleSelect = (feel: EnergyFeel) => {
    onSubmitEnergyFeel(task.id, feel);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quick-capture-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px", textAlign: "center" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src={brewieLogo} alt="Brewie Mascot" style={{ width: 36, height: 36, borderRadius: "50%" }} />
            <h2 style={{ fontSize: "1.15rem" }}>Task Complete! How did it feel? ☕</h2>
          </div>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1rem",
            margin: "0.5rem 0",
            fontWeight: 600,
          }}
        >
          "{task.title}"
        </div>

        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Recording task energy drain helps calibrate your remaining capacity so you don't burn out.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            type="button"
            className="action-btn"
            style={{
              backgroundColor: "var(--accent-teal-light)",
              border: "1px solid var(--accent-teal)",
              color: "var(--text-primary)",
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
            onClick={() => handleSelect("easy")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🌿</span>
              <span>Energizing / Easy</span>
            </div>
            <span className="badge badge-should">Light Energy Used</span>
          </button>

          <button
            type="button"
            className="action-btn"
            style={{
              backgroundColor: "var(--accent-amber-light)",
              border: "1px solid var(--accent-amber)",
              color: "var(--text-primary)",
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
            onClick={() => handleSelect("standard")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>⚡</span>
              <span>As Expected</span>
            </div>
            <span className="badge badge-size">Normal Energy Used</span>
          </button>

          <button
            type="button"
            className="action-btn"
            style={{
              backgroundColor: "var(--accent-red-light)",
              border: "1px solid var(--accent-red)",
              color: "var(--text-primary)",
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
            onClick={() => handleSelect("draining")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🔋</span>
              <span>Cognitively Draining</span>
            </div>
            <span className="badge badge-must">High Energy Drain</span>
          </button>
        </div>
      </div>
    </div>
  );
}
