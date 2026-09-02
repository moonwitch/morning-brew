import { Check, Heart, Plus, Users, X } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface CaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregivers: string[];
  onAddCaregiver: (name: string) => void;
}

export function CaregiverModal({
  isOpen,
  onClose,
  caregivers,
  onAddCaregiver,
}: CaregiverModalProps) {
  const [newName, setNewName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddCaregiver(newName.trim());
    setNewName("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="quick-capture-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "540px" }}
      >
        <div className="quick-capture-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={20} color="var(--accent-teal)" /> Co-Brewers & Caregivers 🤝
          </h2>
          <button type="button" className="action-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Allow trusted caregivers, partners, or team leads to co-author your tasks, share gentle
          reminders, and support your daily energy planning.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            className="quick-input"
            style={{ fontSize: "0.95rem", padding: "0.6rem 1rem" }}
            placeholder="Caregiver Name or Email (e.g. Sarah / Dr. Miller)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            type="submit"
            className="action-btn"
            style={{
              backgroundColor: "var(--accent-teal)",
              color: "#fff",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Plus size={14} /> Invite
          </button>
        </form>

        <div style={{ marginTop: "1rem" }}>
          <h3 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>
            Active Co-Brewers ({caregivers.length}):
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {caregivers.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                No active caregivers added yet.
              </p>
            ) : (
              caregivers.map((name) => (
                <div
                  key={name}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Heart size={16} color="var(--accent-red)" />
                    <span style={{ fontWeight: 600 }}>{name}</span>
                  </div>
                  <span className="badge badge-should">Co-Author Access</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
