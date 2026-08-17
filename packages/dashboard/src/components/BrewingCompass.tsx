import React from "react";
import type { MorningBrewTask } from "@morningbrew/core";
import { Flame, Compass, Coffee, Sparkles } from "lucide-react";

interface BrewingCompassProps {
  tasks: MorningBrewTask[];
  onStartFocus: (task: MorningBrewTask) => void;
  onOpenParkModal: (task: MorningBrewTask) => void;
}

export function BrewingCompass({ tasks, onStartFocus, onOpenParkModal }: BrewingCompassProps) {
  // Quadrant 1: Firefighting (Must priority)
  const q1 = tasks.filter((t) => t.priority === "must");
  // Quadrant 2: Deep Brews (Should priority)
  const q2 = tasks.filter((t) => t.priority === "should");
  // Quadrant 3: Quick Sips (Could priority & XS/S size)
  const q3 = tasks.filter((t) => t.priority === "could");
  // Quadrant 4: Decaf Corner (Wont priority)
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
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
            No tasks in this quadrant — feeling clear! ✨
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
                  Est: {t.size || "S"} {t.addedByCaregiver ? `• 🤝 Co-authored by ${t.addedByCaregiver}` : ""}
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
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Compass size={22} color="var(--accent-amber)" /> Brewing Compass 🧭
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Fun, mindful priority quadrants to conquer decision paralysis and focus energy.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {renderQuadrant(
          "1. Firefighting 🔥",
          "Critical tasks requiring immediate focus today",
          q1,
          <Flame size={20} color="var(--accent-red)" />,
          "var(--accent-red)"
        )}

        {renderQuadrant(
          "2. Deep Brews ☕",
          "High-value focus sessions to timebox into calendar slots",
          q2,
          <Coffee size={20} color="var(--accent-amber)" />,
          "var(--accent-amber)"
        )}

        {renderQuadrant(
          "3. Quick Sips ⚡",
          "Fast admin wins and small tasks",
          q3,
          <Sparkles size={20} color="var(--accent-teal)" />,
          "var(--accent-teal)"
        )}

        {renderQuadrant(
          "4. Decaf Corner 💤",
          "Items parked until resurface date arrives",
          q4,
          <Compass size={20} color="var(--text-muted)" />,
          "var(--text-muted)"
        )}
      </div>
    </div>
  );
}
