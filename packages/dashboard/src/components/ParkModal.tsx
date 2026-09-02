import type { MorningBrewTask } from "@morningbrew/core";
import type React from "react";
import { useState } from "react";

interface ParkModalProps {
  task: MorningBrewTask | null;
  onClose: () => void;
  onParkSubmit: (taskId: string, reason: string, resurfaceOn?: string) => void;
}

export function ParkModal({ task, onClose, onParkSubmit }: ParkModalProps) {
  const [reason, setReason] = useState("");
  const [resurfacePreset, setResurfacePreset] = useState<"tomorrow" | "next-week" | "someday">(
    "tomorrow",
  );

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    let resurfaceDate: string | undefined;
    const now = new Date();
    if (resurfacePreset === "tomorrow") {
      now.setDate(now.getDate() + 1);
      resurfaceDate = now.toISOString().split("T")[0];
    } else if (resurfacePreset === "next-week") {
      now.setDate(now.getDate() + 7);
      resurfaceDate = now.toISOString().split("T")[0];
    }

    onParkSubmit(task.id, reason, resurfaceDate);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quick-capture-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px" }}
      >
        <h3>Park Task: "{task.title}"</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Parking protects working memory by safely removing this task from view until resurface
          date.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Reason for parking <span style={{ color: "var(--accent-red)" }}>*</span>
            </label>
            <input
              type="text"
              className="quick-input"
              style={{ fontSize: "0.95rem", padding: "0.75rem" }}
              placeholder="e.g. Waiting on API credentials from backend team"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Resurface Date
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className={`action-btn ${resurfacePreset === "tomorrow" ? "active-steady" : ""}`}
                onClick={() => setResurfacePreset("tomorrow")}
              >
                Tomorrow
              </button>
              <button
                type="button"
                className={`action-btn ${resurfacePreset === "next-week" ? "active-steady" : ""}`}
                onClick={() => setResurfacePreset("next-week")}
              >
                Next Week
              </button>
              <button
                type="button"
                className={`action-btn ${resurfacePreset === "someday" ? "active-steady" : ""}`}
                onClick={() => setResurfacePreset("someday")}
              >
                Someday (Manual)
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            <button type="button" className="action-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn"
              style={{ backgroundColor: "var(--accent-amber)", color: "#000", fontWeight: 600 }}
              disabled={!reason.trim()}
            >
              Park Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
