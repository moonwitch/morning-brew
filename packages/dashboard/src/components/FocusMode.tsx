import React, { useState, useEffect } from "react";
import type { MorningBrewTask } from "@morningbrew/core";

interface FocusModeProps {
  task: MorningBrewTask | null;
  onClose: () => void;
  onComplete: (taskId: string) => void;
  onPark: (task: MorningBrewTask) => void;
}

export function FocusMode({ task, onClose, onComplete, onPark }: FocusModeProps) {
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25 min default pomodoro
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  if (!task) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="focus-overlay">
      <div className="focus-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="focus-tag">Single-Task Focus</span>
          <button type="button" className="action-btn" onClick={onClose}>
            ✕ Exit Focus
          </button>
        </div>

        <h1 className="focus-title">{task.title}</h1>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          <span className="badge badge-size">{task.size}</span>
          <span className="badge badge-category">{task.source}</span>
        </div>

        <div className="focus-timer">{timeFormatted}</div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            type="button"
            className="action-btn"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? "Pause Timer" : "Resume Timer"}
          </button>
          <button
            type="button"
            className="action-btn"
            style={{ backgroundColor: "var(--accent-teal)", color: "#fff", fontWeight: 600 }}
            onClick={() => {
              onComplete(task.id);
              onClose();
            }}
          >
            ✓ Mark Complete
          </button>
          <button
            type="button"
            className="action-btn"
            style={{ backgroundColor: "var(--accent-amber-light)", color: "var(--accent-amber)" }}
            onClick={() => onPark(task)}
          >
            ⏸ Park Task
          </button>
        </div>
      </div>
    </div>
  );
}
