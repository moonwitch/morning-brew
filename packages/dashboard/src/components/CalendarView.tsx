import type { MorningBrewTask } from "@morningbrew/core";
import React from "react";

export interface CalendarMeeting {
  id: string;
  title: string;
  startTime: string; // e.g. "09:30"
  endTime: string; // e.g. "10:00"
  location?: string;
  source: "google_calendar" | "outlook";
}

interface CalendarViewProps {
  meetings: CalendarMeeting[];
  tasks: MorningBrewTask[];
  onStartFocus: (task: MorningBrewTask) => void;
}

export function CalendarView({ meetings, tasks, onStartFocus }: CalendarViewProps) {
  const task0 = tasks[0];
  const task1 = tasks[1];
  const task2 = tasks[2];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Calendar Header Card */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "var(--shadow-subtle)",
        }}
      >
        <div>
          <h2>Today's Schedule & Meetings</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
            3 Calendar Meetings synced from <strong>Google Calendar</strong>. Tasks are
            auto-scheduled in open focus gaps.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <span className="badge badge-could">3 Meetings (1.75h)</span>
          <div
            style={{
              fontSize: "0.85rem",
              color: "var(--accent-teal)",
              fontWeight: 600,
              marginTop: "4px",
            }}
          >
            3.5h Open Focus Time Remaining
          </div>
        </div>
      </div>

      {/* Hour-by-Hour Schedule Timeline */}
      <div className="calendar-timeline">
        {/* 09:00 - 10:00 */}
        <div className="timeline-row">
          <div className="timeline-hour">09:30</div>
          <div className="timeline-event-card">
            <div>
              <div style={{ fontWeight: 600 }}>📅 Team Standup</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                09:30 - 10:00 • Google Calendar
              </div>
            </div>
            <span className="badge badge-size">Meeting</span>
          </div>
        </div>

        {/* 10:00 - 11:00 Focus Slot */}
        <div className="timeline-row">
          <div className="timeline-hour">10:00</div>
          {task0 ? (
            <div className="timeline-task-card">
              <div>
                <div style={{ fontWeight: 600 }}>🎯 Focus Slot: {task0.title}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  10:00 - 11:00 • Priority: {(task0.priority || "should").toUpperCase()} (
                  {task0.size || "S"})
                </div>
              </div>
              <button
                type="button"
                className="action-btn"
                style={{ backgroundColor: "var(--accent-teal)", color: "#fff", fontWeight: 600 }}
                onClick={() => onStartFocus(task0)}
              >
                Start Focus
              </button>
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Open focus slot</div>
          )}
        </div>

        {/* 11:00 - 12:00 */}
        <div className="timeline-row">
          <div className="timeline-hour">11:00</div>
          <div className="timeline-event-card">
            <div>
              <div style={{ fontWeight: 600 }}>📅 Sprint Review & Roadmap</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                11:00 - 12:00 • Google Calendar
              </div>
            </div>
            <span className="badge badge-size">Meeting</span>
          </div>
        </div>

        {/* 12:00 - 12:30 Focus Slot */}
        <div className="timeline-row">
          <div className="timeline-hour">12:00</div>
          {task1 ? (
            <div className="timeline-task-card">
              <div>
                <div style={{ fontWeight: 600 }}>🎯 Focus Slot: {task1.title}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  12:00 - 12:30 • Priority: {(task1.priority || "should").toUpperCase()} (
                  {task1.size || "S"})
                </div>
              </div>
              <button
                type="button"
                className="action-btn"
                style={{ backgroundColor: "var(--accent-teal)", color: "#fff", fontWeight: 600 }}
                onClick={() => onStartFocus(task1)}
              >
                Start Focus
              </button>
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Open focus slot</div>
          )}
        </div>

        {/* 14:30 - 15:15 Meeting */}
        <div className="timeline-row">
          <div className="timeline-hour">14:30</div>
          <div className="timeline-event-card">
            <div>
              <div style={{ fontWeight: 600 }}>📅 1:1 Engineering Sync</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                14:30 - 15:15 • Google Calendar
              </div>
            </div>
            <span className="badge badge-size">Meeting</span>
          </div>
        </div>

        {/* 15:30 - 16:30 Focus Slot */}
        <div className="timeline-row">
          <div className="timeline-hour">15:30</div>
          {task2 ? (
            <div className="timeline-task-card">
              <div>
                <div style={{ fontWeight: 600 }}>🎯 Focus Slot: {task2.title}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  15:30 - 16:30 • Priority: {(task2.priority || "should").toUpperCase()} (
                  {task2.size || "S"})
                </div>
              </div>
              <button
                type="button"
                className="action-btn"
                style={{ backgroundColor: "var(--accent-teal)", color: "#fff", fontWeight: 600 }}
                onClick={() => onStartFocus(task2)}
              >
                Start Focus
              </button>
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Open focus slot</div>
          )}
        </div>
      </div>
    </div>
  );
}
