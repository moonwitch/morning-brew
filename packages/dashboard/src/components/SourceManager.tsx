import React from "react";
import { SiGooglecalendar, SiGoogletasks, SiMarkdown } from "react-icons/si";
import { TbBrandMonday } from "react-icons/tb";
import { FaSlack, FaTicketSimple } from "react-icons/fa6";
import { Sparkles, Settings } from "lucide-react";

export interface IntegrationSource {
  id: string;
  name: string;
  type: string;
  taskCount: number;
  status: "connected" | "syncing" | "offline";
  iconKey?: string;
}

interface SourceManagerProps {
  sources: IntegrationSource[];
  onOpenSettings: () => void;
}

export function renderSourceIcon(sourceId: string, size = 15) {
  switch (sourceId) {
    case "monday":
      return <TbBrandMonday size={size} style={{ color: "#0052CC" }} />;
    case "freshservice":
      return <FaTicketSimple size={size} style={{ color: "#00A88F" }} />;
    case "slack":
      return <FaSlack size={size} style={{ color: "#E01E5A" }} />;
    case "google_tasks":
      return <SiGoogletasks size={size} style={{ color: "#4285F4" }} />;
    case "google_calendar":
      return <SiGooglecalendar size={size} style={{ color: "#4285F4" }} />;
    case "quick_capture":
      return <Sparkles size={size} style={{ color: "var(--accent-amber)" }} />;
    case "markdown":
      return <SiMarkdown size={size} style={{ color: "var(--text-primary)" }} />;
    default:
      return <Sparkles size={size} />;
  }
}

export function SourceManager({ sources, onOpenSettings }: SourceManagerProps) {
  const activeSources = sources.filter((s) => s.status === "connected");

  return (
    <div className="compact-integrations-bar">
      <div className="integration-pills">
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginRight: "0.5rem" }}>
          Active Integration Sources ({activeSources.length}):
        </span>
        {activeSources.map((source) => (
          <div key={source.id} className="integration-pill">
            <span className="brand-icon-wrapper">{renderSourceIcon(source.id)}</span>
            <span style={{ fontWeight: 600 }}>{source.name}</span>
            <span style={{ opacity: 0.6, fontSize: "0.75rem" }}>({source.taskCount})</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="action-btn"
        style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
        onClick={onOpenSettings}
      >
        <Settings size={14} /> Settings & Integrations
      </button>
    </div>
  );
}
