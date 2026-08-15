import React from "react";
import type { MorningBrewTask } from "@morningbrew/core";

interface TodayViewProps {
  tasks: MorningBrewTask[];
  totalMinutesUsed: number;
  maxMinutesBudget: number;
  onStatusToggle: (taskId: string) => void;
  onStartFocus: (task: MorningBrewTask) => void;
  onOpenParkModal: (task: MorningBrewTask) => void;
  onOpenSetAside: () => void;
  setAsideCount: number;
  onOpenQuickCapture: () => void;
}

export function TodayView({
  tasks,
  totalMinutesUsed,
  maxMinutesBudget,
  onStatusToggle,
  onStartFocus,
  onOpenParkModal,
  onOpenSetAside,
  setAsideCount,
  onOpenQuickCapture,
}: TodayViewProps) {
  const percentage = Math.min(100, Math.round((totalMinutesUsed / maxMinutesBudget) * 100));
  const isOverload = totalMinutesUsed > maxMinutesBudget;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Capacity Progress Bar Card */}
      <div className="capacity-card">
        <div className="capacity-header">
          <div className="capacity-title">Today's Focus Capacity Budget</div>
          <div className="capacity-stats" style={{ color: isOverload ? "var(--accent-red)" : "var(--accent-teal)" }}>
            {totalMinutesUsed}m / {maxMinutesBudget}m
          </div>
        </div>

        <div className="capacity-bar-bg">
          <div
            className={`capacity-bar-fill ${isOverload ? "overload" : "normal"}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="capacity-footer">
          <span>{isOverload ? "⚠️ Capacity exceeded! Consider setting aside tasks." : "Good focus balance."}</span>
          <button
            type="button"
            className="action-btn"
            style={{ color: "var(--accent-amber)" }}
            onClick={onOpenSetAside}
          >
            📂 View Set-Aside Drawer ({setAsideCount})
          </button>
        </div>
      </div>

      {/* Task List Header */}
      <div className="task-section-header">
        <h2>Today's Plan ({tasks.length} tasks)</h2>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            className="action-btn"
            style={{ backgroundColor: "var(--accent-amber)", color: "#000", fontWeight: 600 }}
            onClick={onOpenQuickCapture}
          >
            + Quick Capture (Cmd+K)
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="task-grid">
        {tasks.map((task) => {
          const isDone = task.status === "done";
          return (
            <div key={task.id} className="task-card">
              <div className="task-left">
                <div
                  className={`status-check ${isDone ? "done" : ""}`}
                  onClick={() => onStatusToggle(task.id)}
                >
                  {isDone && "✓"}
                </div>
                <div>
                  <div className={`task-title ${isDone ? "completed" : ""}`}>{task.title}</div>
                  <div className="task-meta">
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <span className="badge badge-size">{task.size}</span>
                    <span className="badge badge-category">{task.source}</span>
                  </div>
                </div>
              </div>

              <div className="task-actions">
                {!isDone && (
                  <>
                    <button
                      type="button"
                      className="action-btn"
                      style={{ backgroundColor: "var(--accent-teal-light)", color: "var(--accent-teal)", fontWeight: 600 }}
                      onClick={() => onStartFocus(task)}
                    >
                      🎯 Focus
                    </button>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={() => onOpenParkModal(task)}
                    >
                      ⏸ Park
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
