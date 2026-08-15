import React, { useState, useEffect, useMemo } from "react";
import type { MorningBrewTask } from "@morningbrew/core";
import { TSHIRT_SIZE_MINUTES, applyTeamValueFilter, DEFAULT_TEAM_VALUE_FILTER } from "@morningbrew/core";
import { ClipboardList, Calendar, Sun, Moon, User, Sparkles } from "lucide-react";
import brewieLogo from "./brewie_logo.jpg";
import "./theme.css";

import { MorningCheckIn, type EnergyLevel } from "./components/MorningCheckIn.tsx";
import { TodayView } from "./components/TodayView.tsx";
import { CalendarView, type CalendarMeeting } from "./components/CalendarView.tsx";
import { QuickCaptureModal } from "./components/QuickCaptureModal.tsx";
import { FocusMode } from "./components/FocusMode.tsx";
import { SetAsideDrawer, type SetAsideTaskItem } from "./components/SetAsideDrawer.tsx";
import { ParkModal } from "./components/ParkModal.tsx";
import { SourceManager, type IntegrationSource } from "./components/SourceManager.tsx";
import { LoginModal } from "./components/LoginModal.tsx";
import { SettingsModal } from "./components/SettingsModal.tsx";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt.tsx";
import type { ParsedShorthand } from "./utils/shorthandParser.ts";

const INITIAL_TASKS: MorningBrewTask[] = [
  {
    id: "monday:101",
    source: "monday",
    sourceId: "101",
    title: "Review architecture design & GraphQL backoff specs",
    status: "in_progress",
    size: "M",
    priority: "must",
    teamValue: 5,
  },
  {
    id: "freshservice:4092",
    source: "freshservice",
    sourceId: "INC-4092",
    title: "INC-4092: Fix SSO authentication error on staging server",
    status: "todo",
    size: "M",
    priority: "must",
    teamValue: 5,
  },
  {
    id: "google_tasks:201",
    source: "google_tasks",
    sourceId: "201",
    title: "Update Q3 project deliverables & stakeholder deck",
    status: "todo",
    size: "M",
    priority: "must",
    teamValue: 4,
  },
  {
    id: "slack:8812",
    source: "slack",
    sourceId: "SLACK-8812",
    title: "Slack (#eng-team): Review database migration script before deploy",
    status: "todo",
    size: "S",
    priority: "should",
    teamValue: 4,
  },
  {
    id: "quick_capture:103",
    source: "quick_capture",
    sourceId: "103",
    title: "Ensure ticket x is handled",
    status: "todo",
    size: "S",
    priority: "should",
    teamValue: 4,
    resurfaceOn: "2026-08-15",
  },
  {
    id: "google_tasks:202",
    source: "google_tasks",
    sourceId: "202",
    title: "Review pull request for auth token refresh",
    status: "todo",
    size: "XS",
    priority: "should",
    teamValue: 4,
  },
  {
    id: "markdown:104",
    source: "markdown",
    sourceId: "104",
    title: "Draft weekly release notes for team sync",
    status: "todo",
    size: "S",
    priority: "could",
    teamValue: 2,
  },
  {
    id: "monday:105",
    source: "monday",
    sourceId: "105",
    title: "Calibrate size-to-minutes per user from actuals",
    status: "todo",
    size: "L",
    priority: "could",
    teamValue: 1,
  },
];

const INITIAL_MEETINGS: CalendarMeeting[] = [
  { id: "cal-1", title: "Team Standup", startTime: "09:30", endTime: "10:00", source: "google_calendar" },
  { id: "cal-2", title: "Sprint Review & Roadmap", startTime: "11:00", endTime: "12:00", source: "google_calendar" },
  { id: "cal-3", title: "1:1 Engineering Sync", startTime: "14:30", endTime: "15:15", source: "google_calendar" },
];

const INITIAL_SOURCES: IntegrationSource[] = [
  { id: "monday", name: "Monday.com", type: "API Plugin", taskCount: 2, status: "connected" },
  { id: "freshservice", name: "Freshservice IT", type: "Tickets API", taskCount: 1, status: "connected" },
  { id: "slack", name: "Slack Actions", type: "Saved Messages", taskCount: 1, status: "connected" },
  { id: "google_tasks", name: "Google Tasks", type: "Workspace API", taskCount: 2, status: "connected" },
  { id: "google_calendar", name: "Google Calendar", type: "Calendar API", taskCount: 3, status: "connected" },
  { id: "quick_capture", name: "Quick Capture Inbox", type: "Local Storage", taskCount: 1, status: "connected" },
  { id: "markdown", name: "Local Notes", type: "Markdown File", taskCount: 1, status: "connected" },
];

// Helper to safely access localStorage for offline task persistence
function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("localStorage write failed:", err);
  }
}

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => getStorageItem("mb_theme", "dark"));
  const [activeTab, setActiveTab] = useState<"plan" | "calendar">("plan");
  const [userName, setUserName] = useState<string | null>(() => getStorageItem("mb_username", "Kelly Crabbé"));
  const [sources, setSources] = useState<IntegrationSource[]>(INITIAL_SOURCES);
  const [tasks, setTasks] = useState<MorningBrewTask[]>(() => getStorageItem("mb_tasks", INITIAL_TASKS));
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(() => getStorageItem("mb_energy", "steady"));
  const [showMoodReflection, setShowMoodReflection] = useState<boolean>(() => getStorageItem("mb_mood_reflection", false));

  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<MorningBrewTask | null>(null);
  const [parkTaskTarget, setParkTaskTarget] = useState<MorningBrewTask | null>(null);
  const [isSetAsideOpen, setIsSetAsideOpen] = useState(false);

  // Sync state changes to local storage for offline persistence
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setStorageItem("mb_theme", theme);
  }, [theme]);

  useEffect(() => {
    setStorageItem("mb_tasks", tasks);
  }, [tasks]);

  useEffect(() => {
    setStorageItem("mb_energy", energyLevel);
  }, [energyLevel]);

  useEffect(() => {
    setStorageItem("mb_mood_reflection", showMoodReflection);
  }, [showMoodReflection]);

  useEffect(() => {
    setStorageItem("mb_username", userName);
  }, [userName]);

  // Global Cmd+K / Ctrl+K hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const maxMinutesBudget = useMemo(() => {
    if (energyLevel === "gentle") return 90;
    if (energyLevel === "steady") return 180;
    return 300;
  }, [energyLevel]);

  const { includedTasks, setAsideItems, totalMinutesUsed } = useMemo(() => {
    const { included, excluded } = applyTeamValueFilter(tasks, {
      ...DEFAULT_TEAM_VALUE_FILTER,
      minScore: energyLevel === "gentle" ? 3 : 2,
    });

    let minutes = 0;
    const finalIncluded: MorningBrewTask[] = [];
    const finalSetAside: SetAsideTaskItem[] = [];

    for (const ex of excluded) {
      finalSetAside.push({ task: ex.task, explanation: ex.explanation });
    }

    for (const t of included) {
      if (t.status === "parked") continue;
      const taskMins = TSHIRT_SIZE_MINUTES[t.size || "S"];
      if (minutes + taskMins <= maxMinutesBudget || t.priority === "must") {
        minutes += taskMins;
        finalIncluded.push(t);
      } else {
        finalSetAside.push({
          task: t,
          explanation: `Set aside: Exceeds today's ${maxMinutesBudget}m energy capacity budget`,
        });
      }
    }

    return {
      includedTasks: finalIncluded,
      setAsideItems: finalSetAside,
      totalMinutesUsed: minutes,
    };
  }, [tasks, energyLevel, maxMinutesBudget]);

  const handleQuickCaptureSubmit = (parsed: ParsedShorthand) => {
    const newTask: MorningBrewTask = {
      id: `quick_capture:${Date.now()}`,
      source: "quick_capture",
      sourceId: String(Date.now()),
      title: parsed.title,
      status: "todo",
      size: parsed.tshirtSize,
      priority: parsed.priority,
      teamValue: 4,
      resurfaceOn: parsed.resurfaceOn,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleStatusToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: t.status === "done" ? "todo" : "done" } : t))
    );
  };

  const handleParkSubmit = (taskId: string, reason: string, resurfaceOn?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "parked",
              parked: {
                reason,
                resurfaceOn,
                parkedAt: new Date().toISOString(),
                previousStatus: t.status,
              },
            }
          : t
      )
    );
  };

  const handlePullIntoToday = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, priority: "must" } : t))
    );
  };

  const handleToggleSource = (sourceId: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === sourceId
          ? { ...s, status: s.status === "connected" ? "offline" : "connected" }
          : s
      )
    );
  };

  return (
    <div className="app-shell">
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">
          <img
            src={brewieLogo}
            alt="Brewie the Coffee Bean Mascot Logo"
            className="brand-logo-img"
            title="Brewie — Official MorningBrew Mascot"
          />
          <div className="brand-title">MorningBrew</div>
        </div>

        {/* Desktop Center Navigation Tabs */}
        <div className="nav-tabs desktop-only">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === "plan" ? "active" : ""}`}
            onClick={() => setActiveTab("plan")}
          >
            <ClipboardList size={16} /> Today Plan
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === "calendar" ? "active" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar size={16} /> Calendar & Meetings
          </button>
        </div>

        <div className="nav-actions">
          {/* User Profile Button */}
          <button
            type="button"
            className="user-profile-btn"
            onClick={() => setIsLoginOpen(true)}
          >
            <div className="avatar-circle">
              {userName ? userName.charAt(0) : <User size={14} />}
            </div>
            <span className="desktop-only">{userName ? userName.split(" ")[0] : "Sign In"}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? (
              <>
                <Sun size={15} color="var(--accent-amber)" /> <span className="desktop-only">Light</span>
              </>
            ) : (
              <>
                <Moon size={15} color="var(--accent-amber)" /> <span className="desktop-only">Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="quick-capture-trigger"
            onClick={() => setIsQuickCaptureOpen(true)}
          >
            <Sparkles size={16} color="var(--accent-amber)" />
            <span className="desktop-only">Quick Capture</span>
            <span className="kbd-badge desktop-only">⌘K</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="greeting-header">
          <h1>
            Good morning{userName ? `, ${userName.split(" ")[0]}` : ""}! ☕
            <span style={{ fontSize: "1.1rem", fontWeight: 400, color: "var(--text-secondary)" }}>
              Ready to brew today's focus with Brewie?
            </span>
          </h1>
        </div>

        <MorningCheckIn
          currentLevel={energyLevel}
          onSelectLevel={setEnergyLevel}
          showMoodReflection={showMoodReflection}
        />

        {activeTab === "plan" ? (
          <TodayView
            tasks={includedTasks}
            totalMinutesUsed={totalMinutesUsed}
            maxMinutesBudget={maxMinutesBudget}
            onStatusToggle={handleStatusToggle}
            onStartFocus={(task) => setFocusTask(task)}
            onOpenParkModal={(task) => setParkTaskTarget(task)}
            onOpenSetAside={() => setIsSetAsideOpen(true)}
            setAsideCount={setAsideItems.length}
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
          />
        ) : (
          <CalendarView
            meetings={INITIAL_MEETINGS}
            tasks={includedTasks}
            onStartFocus={(task) => setFocusTask(task)}
          />
        )}

        <SourceManager sources={sources} onOpenSettings={() => setIsSettingsOpen(true)} />
      </main>

      {/* Mobile Bottom Sticky Navigation Bar */}
      <nav className="mobile-bottom-nav mobile-only">
        <button
          type="button"
          className={`mobile-nav-btn ${activeTab === "plan" ? "active" : ""}`}
          onClick={() => setActiveTab("plan")}
        >
          <ClipboardList size={20} />
          <span>Today</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-btn ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("calendar")}
        >
          <Calendar size={20} />
          <span>Calendar</span>
        </button>

        <button
          type="button"
          className="mobile-nav-btn capture-btn"
          onClick={() => setIsQuickCaptureOpen(true)}
        >
          <Sparkles size={20} color="#140f0c" />
          <span>Capture</span>
        </button>
      </nav>

      {/* PWA Home Screen Install Prompt & Offline Banner */}
      <PWAInstallPrompt />

      {/* Overlays */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onSubmit={handleQuickCaptureSubmit}
      />

      <FocusMode
        task={focusTask}
        onClose={() => setFocusTask(null)}
        onComplete={(id) => handleStatusToggle(id)}
        onPark={(t) => {
          setFocusTask(null);
          setParkTaskTarget(t);
        }}
      />

      <ParkModal
        task={parkTaskTarget}
        onClose={() => setParkTaskTarget(null)}
        onParkSubmit={handleParkSubmit}
      />

      <SetAsideDrawer
        isOpen={isSetAsideOpen}
        onClose={() => setIsSetAsideOpen(false)}
        items={setAsideItems}
        onPullIntoToday={handlePullIntoToday}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(name) => setUserName(name)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        sources={sources}
        onToggleSource={handleToggleSource}
        showMoodReflection={showMoodReflection}
        onToggleMoodReflection={() => setShowMoodReflection((v) => !v)}
      />
    </div>
  );
}
