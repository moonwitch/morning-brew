import type { MorningBrewTask, MoscowPriority } from "@morningbrew/core";
import { Coffee, Compass, Flame, Shirt, Sparkles } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface BrewingCompassProps {
  tasks: MorningBrewTask[];
  onStartFocus: (task: MorningBrewTask) => void;
  onOpenParkModal: (task: MorningBrewTask) => void;
  onUpdatePriority: (taskId: string, priority: MoscowPriority) => void;
}

export function BrewingCompass({
  tasks,
  onStartFocus,
  onOpenParkModal,
  onUpdatePriority,
}: BrewingCompassProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropTarget, setActiveDropTarget] = useState<MoscowPriority | null>(null);

  // Quadrant 1: Firefighting (Must priority)
  const q1 = tasks.filter((t) => t.priority === "must");
  // Quadrant 2: Deep Brews (Should priority)
  const q2 = tasks.filter((t) => t.priority === "should");
  // Quadrant 3: Quick Sips (Could priority)
  const q3 = tasks.filter((t) => t.priority === "could");
  // Quadrant 4: Decaf Corner (Wont priority)
  const q4 = tasks.filter((t) => t.priority === "wont");

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, priority: MoscowPriority) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (activeDropTarget !== priority) {
      setActiveDropTarget(priority);
    }
  };

  const handleDragLeave = () => {
    setActiveDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetPriority: MoscowPriority) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setActiveDropTarget(null);
    setDraggedTaskId(null);

    if (taskId) {
      onUpdatePriority(taskId, targetPriority);
    }
  };

  const renderQuadrant = (
    title: string,
    description: string,
    priority: MoscowPriority,
    quadrantTasks: MorningBrewTask[],
    icon: React.ReactNode,
    borderColor: string,
  ) => {
    const isTarget = activeDropTarget === priority;

    return (
      <div
        onDragOver={(e) => handleDragOver(e, priority)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, priority)}
        style={{
          backgroundColor: isTarget ? "var(--bg-card-hover)" : "var(--bg-surface)",
          border: isTarget ? `2px dashed ${borderColor}` : "1px solid var(--border-subtle)",
          borderTop: `4px solid ${borderColor}`,
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          boxShadow: isTarget ? "var(--shadow-elevated)" : "var(--shadow-subtle)",
          minHeight: "260px",
          transition: "var(--transition-fast)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {icon}
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{title}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{description}</p>
            </div>
          </div>
          <span className="badge badge-size">{quadrantTasks.length}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", flex: 1 }}>
          {quadrantTasks.length === 0 ? (
            <div
              style={{
                flex: 1,
                border: "1px dashed var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1rem",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                fontStyle: "italic",
              }}
            >
              Drag tasks here to assign to {title}
            </div>
          ) : (
            quadrantTasks.map((t) => (
              <div
                key={t.id}
                draggable
                onDragStart={(e) => handleDragStart(e, t.id)}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "grab",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.title}</div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "3px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span
                      className="badge badge-size"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        padding: "1px 5px",
                      }}
                    >
                      <Shirt size={11} /> {t.size || "S"}
                    </span>
                    <span>• {t.source}</span>
                    {t.addedByCaregiver && <span>• 🤝 {t.addedByCaregiver}</span>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    type="button"
                    className="action-btn"
                    style={{ fontSize: "0.78rem" }}
                    onClick={() => onStartFocus(t)}
                  >
                    Focus
                  </button>
                  <button
                    type="button"
                    className="action-btn"
                    style={{ fontSize: "0.78rem" }}
                    onClick={() => onOpenParkModal(t)}
                  >
                    Park
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Compass size={22} color="var(--accent-amber)" /> Brewing Compass 🧭
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Drag and drop tasks between priority quadrants. Changes reflect instantly in Today Plan
            & Calendar!
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {renderQuadrant(
          "1. Firefighting 🔥",
          "Critical tasks (Must Priority)",
          "must",
          q1,
          <Flame size={20} color="var(--accent-red)" />,
          "var(--accent-red)",
        )}

        {renderQuadrant(
          "2. Deep Brews ☕",
          "High-value focus (Should Priority)",
          "should",
          q2,
          <Coffee size={20} color="var(--accent-amber)" />,
          "var(--accent-amber)",
        )}

        {renderQuadrant(
          "3. Quick Sips ⚡",
          "Fast wins & admin (Could Priority)",
          "could",
          q3,
          <Sparkles size={20} color="var(--accent-teal)" />,
          "var(--accent-teal)",
        )}

        {renderQuadrant(
          "4. Decaf Corner 💤",
          "Low priority / Parked (Wont Priority)",
          "wont",
          q4,
          <Compass size={20} color="var(--text-muted)" />,
          "var(--text-muted)",
        )}
      </div>
    </div>
  );
}
