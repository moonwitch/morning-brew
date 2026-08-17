import React from "react";
import type { MorningBrewTask } from "@morningbrew/core";
import { Filter, X, ArrowUpRight, Zap } from "lucide-react";

export interface SetAsideTaskItem {
  task: MorningBrewTask;
  explanation: string;
}

interface SetAsideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: SetAsideTaskItem[];
  onPullIntoToday: (taskId: string) => void;
}

export function SetAsideDrawer({
  isOpen,
  onClose,
  items,
  onPullIntoToday,
}: SetAsideDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={20} color="var(--accent-amber)" /> Set-Aside Drawer ({items.length})
          </h2>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Tasks safely set aside by the G-Factor ⚡ filter and today's energy budget limit. None of these tasks are lost or deleted.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflowY: "auto" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
              No tasks set aside today! All active tasks fit into today's focus plan. ✨
            </div>
          ) : (
            items.map(({ task, explanation }) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 600 }}>{task.title}</h4>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Source: {task.source} • Size: {task.size || "S"}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="action-btn"
                    style={{
                      fontSize: "0.8rem",
                      backgroundColor: "var(--accent-amber-light)",
                      color: "var(--accent-amber)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                    }}
                    onClick={() => {
                      onPullIntoToday(task.id);
                      onClose();
                    }}
                  >
                    Pull Into Today <ArrowUpRight size={14} />
                  </button>
                </div>

                <div className="explanation-box">
                  <span style={{ fontWeight: 600 }}>G-Factor Gate:</span> {explanation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
