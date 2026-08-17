import React from "react";
import type { MorningBrewTask } from "@morningbrew/core";
import { Check, Flame, Coffee, Plus, Filter, Battery, Sparkles } from "lucide-react";

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
  const isOverload = totalMinutesUsed > maxMinutesBudget;
  const fillPercentage = Math.min(100, Math.round((totalMinutesUsed / maxMinutesBudget) * 100));

  const activeTasks = tasks.filter((t) => t.status !== "done");
  const completedTasks = tasks.filter((t) => t.status === "done");

  const renderTaskCard = (t: MorningBrewTask) => {
    const isDone = t.status === "done";
    return (
      <div key={t.id} className="task-card">
        <div className="task-left">
          <div
            className={`status-check ${isDone ? "done" : ""}`}
            onClick={() => onStatusToggle(t.id)}
            title={isDone ? "Mark as Todo" : "Mark as Done"}
          >
            {isDone && <Check size={14} />}
          </div>

          <div>
            <div className={`task-title ${isDone ? "completed" : ""}`}>{t.title}</div>

            <div className="task-meta">
              {t.priority === "must" && <span className="badge badge-must">Must</span>}
              {t.priority === "should" && <span className="badge badge-should">Should</span>}
              {t.priority === "could" && <span className="badge badge-could">Could</span>}

              {t.size && <span className="badge badge-size">{t.size}</span>}

              <span className="badge badge-category">#{t.source}</span>

              {t.addedByCaregiver && (
                <span className="badge badge-should">🤝 {t.addedByCaregiver}</span>
              )}

              {/* Completion Energy Feel Badge */}
              {isDone && t.completionEnergyFeel && (
                <span
                  className="badge"
                  style={{
                    backgroundColor:
                      t.completionEnergyFeel === "easy"
                        ? "var(--accent-teal-light)"
                        : t.completionEnergyFeel === "draining"
                        ? "var(--accent-red-light)"
                        : "var(--accent-amber-light)",
                    color:
                      t.completionEnergyFeel === "easy"
                        ? "var(--accent-teal)"
                        : t.completionEnergyFeel === "draining"
                        ? "var(--accent-red)"
                        : "var(--accent-amber)",
                  }}
                >
                  {t.completionEnergyFeel === "easy"
                    ? "🌿 Easy"
                    : t.completionEnergyFeel === "draining"
                    ? "🔋 Draining"
                    : "⚡ Standard"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="task-actions">
          {!isDone && (
            <button
              type="button"
              className="action-btn"
              onClick={() => onStartFocus(t)}
              title="Start single-task focus session"
            >
              Focus
            </button>
          )}

          <button
            type="button"
            className="action-btn"
            onClick={() => onOpenParkModal(t)}
            title="Park for later with resurface date"
          >
            Park
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Capacity Budget Progress Meter */}
      <div className="capacity-card">
        <div className="capacity-header">
          <div className="capacity-title">Today's Focus Capacity Budget</div>
          <div
            className="capacity-stats"
            style={{ color: isOverload ? "var(--accent-red)" : "var(--accent-teal)" }}
          >
            {totalMinutesUsed}m / {maxMinutesBudget}m
          </div>
        </div>

        <div className="capacity-bar-bg">
          <div
            className={`capacity-bar-fill ${isOverload ? "overload" : "normal"}`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>

        <div className="capacity-footer">
          <span>
            {isOverload
              ? "⚠️ Over capacity: Consider parking or setting aside non-essential tasks"
              : `Pacing looks good (${maxMinutesBudget - totalMinutesUsed}m energy remaining)`}
          </span>

          {setAsideCount > 0 && (
            <button
              type="button"
              className="action-btn"
              style={{
                fontSize: "0.85rem",
                color: "var(--accent-amber)",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
              onClick={onOpenSetAside}
            >
              <Filter size={14} /> Set-Aside Drawer ({setAsideCount})
            </button>
          )}
        </div>
      </div>

      {/* Active Focus Tasks */}
      <section>
        <div className="task-section-header">
          <h2>Today's Focus Plan ({activeTasks.length})</h2>
          <button
            type="button"
            className="action-btn"
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            onClick={onOpenQuickCapture}
          >
            <Plus size={16} /> Quick Add Task
          </button>
        </div>

        <div className="task-grid">
          {activeTasks.length === 0 ? (
            <div
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px dashed var(--border-strong)",
                borderRadius: "var(--radius-md)",
                padding: "2.5rem",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              <Sparkles size={28} color="var(--accent-amber)" style={{ marginBottom: "0.5rem" }} />
              <div>No active tasks remaining in today's focus plan!</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Add a new task via ⌘K or pull items from the Set-Aside Drawer.
              </div>
            </div>
          ) : (
            activeTasks.map(renderTaskCard)
          )}
        </div>
      </section>

      {/* Completed Accomplishments */}
      {completedTasks.length > 0 && (
        <section style={{ marginTop: "1rem" }}>
          <div className="task-section-header">
            <h2 style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>
              Completed Today ({completedTasks.length})
            </h2>
          </div>
          <div className="task-grid">{completedTasks.map(renderTaskCard)}</div>
        </section>
      )}
    </div>
  );
}
