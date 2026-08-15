import React from "react";
import type { MorningBrewTask } from "@morningbrew/core";

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

export function SetAsideDrawer({ isOpen, onClose, items, onPullIntoToday }: SetAsideDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h2>Set-Aside Drawer</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {items.length} tasks protected from today's working memory
            </p>
          </div>
          <button type="button" className="action-btn" onClick={onClose}>
            ✕ Close
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
              No tasks currently set aside.
            </p>
          ) : (
            items.map(({ task, explanation }) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 600 }}>{task.title}</div>
                  <button
                    type="button"
                    className="action-btn"
                    style={{ fontSize: "0.85rem", color: "var(--accent-teal)" }}
                    onClick={() => onPullIntoToday(task.id)}
                  >
                    + Pull into Today
                  </button>
                </div>

                <div className="explanation-box">
                  🔍 <strong>Filter explanation:</strong> {explanation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
