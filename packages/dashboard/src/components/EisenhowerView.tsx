import React from "react";
import type { MorningBrewTask } from "@morningbrew/core";
import { Zap, Clock, UserCheck, Coffee } from "lucide-react";

interface EisenhowerViewProps {
  tasks: MorningBrewTask[];
  onStartFocus: (task: MorningBrewTask) => void;
  onOpenParkModal: (task: MorningBrewTask) => void;
}

export function EisenhowerView({ tasks, onStartFocus, onOpenParkModal }: EisenhowerViewProps) {
  // Quadrant 1: Urgent & Important (Must priority)
  const q1 = tasks.filter((t) => t.priority === "must");
  // Quadrant 2: Important, Not Urgent (Should priority)
  const q2 = tasks.filter((t) => t.priority === "should");
  // Quadrant 3: Urgent, Less Important (Could priority)
  const q3 = tasks.filter((t) => t.priority === "could");
  // Quadrant 4: Park / Low priority (Wont priority)
  const q4 = tasks.filter((t) => t.priority === "wont");

  const renderQuadrant = (
    title: string,
    description: string,
    quadrantTasks: MorningBrewTask[],
    icon: React.ReactNode,
    borderColor: string
  ) => (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: `1px solid var(--border-subtle)`,
        borderTop: `4px solid ${borderColor}`,
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "var(--shadow-subtle)",
        minHeight: "240px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {icon}
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{title}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{description}</p>
          </div>
        </div>
        <span className="badge badge-size">{quadrantTasks.length}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {quadrantTasks.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
            No tasks in this quadrant.
          </p>
        ) : (
          quadrantTasks.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Est: {t.size} • Source: {t.source}
                </div>
              </div>
              <button
                type="button"
                className="action-btn"
                style={{ fontSize: "0.78rem" }}
                onClick={() => onStartFocus(t)}
              >
                Focus
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Lunatask-Inspired Eisenhower Prioritization Matrix</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Organize tasks by Urgency and Importance to conquer decision paralysis.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {renderQuadrant(
          "1. Do First (Urgent & Important)",
          "Critical tasks requiring immediate focus today",
          q1,
          <Zap size={20} color="var(--accent-red)" />,
          "var(--accent-red)"
        )}

        {renderQuadrant(
          "2. Schedule (Important, Not Urgent)",
          "High value tasks to timebox into focus slots",
          q2,
          <Clock size={20} color="var(--accent-amber)" />,
          "var(--accent-amber)"
        )}

        {renderQuadrant(
          "3. Delegate / Quick (Urgent, Less Important)",
          "Quick admin wins or items to pass along",
          q3,
          <UserCheck size={20} color="var(--accent-teal)" />,
          "var(--accent-teal)"
        )}

        {renderQuadrant(
          "4. Park / Low Priority (Neither)",
          "Items to park until resurface date arrives",
          q4,
          <Coffee size={20} color="var(--text-muted)" />,
          "var(--text-muted)"
        )}
      </div>
    </div>
  );
}
