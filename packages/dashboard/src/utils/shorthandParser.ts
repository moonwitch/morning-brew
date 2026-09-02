import type { MoscowPriority, TshirtSize } from "@morningbrew/core";

export interface ParsedShorthandToken {
  type: "text" | "category" | "date" | "urgency" | "duration";
  text: string;
  value?: string | number;
}

export interface ParsedShorthand {
  raw: string;
  title: string;
  category?: string;
  resurfaceOn?: string;
  priority: MoscowPriority;
  durationMinutes: number;
  tshirtSize: TshirtSize;
  tokens: ParsedShorthandToken[];
}

export function parseShorthand(input: string, now: Date = new Date()): ParsedShorthand {
  const raw = input;
  const text = input;

  let category: string | undefined;
  let resurfaceOn: string | undefined;
  let priority: MoscowPriority = "should"; // Default priority
  let durationMinutes = 30; // Default estimate (S)

  // 1. Extract category (#work, #personal)
  const categoryMatch = text.match(/#([a-zA-Z0-9_\-]+)/);
  if (categoryMatch?.[1]) {
    category = categoryMatch[1];
  }

  // 2. Extract date (@tomorrow, @today, @2026-08-15, @next-week)
  const dateMatch = text.match(/@([a-zA-Z0-9_\-]+)/);
  if (dateMatch?.[1]) {
    const rawDate = dateMatch[1].toLowerCase();
    resurfaceOn = resolveDateKeyword(rawDate, now);
  }

  // 3. Extract urgency (! to !!!!)
  const urgencyMatch = text.match(/(^|\s)(!{1,4})(\s|$)/);
  if (urgencyMatch?.[2]) {
    const exclamation = urgencyMatch[2];
    if (exclamation === "!") priority = "wont";
    else if (exclamation === "!!") priority = "could";
    else if (exclamation === "!!!") priority = "should";
    else if (exclamation === "!!!!") priority = "must";
  }

  // 4. Extract duration (~40min, ~15m, ~1.5h)
  const durationMatch = text.match(/~([\d\.]+)(min|m|h|hour|hours)?/i);
  if (durationMatch?.[1]) {
    const num = Number.parseFloat(durationMatch[1]);
    const unit = (durationMatch[2] || "m").toLowerCase();
    if (unit.startsWith("h")) {
      durationMinutes = Math.round(num * 60);
    } else {
      durationMinutes = Math.round(num);
    }
  }

  const tshirtSize = minutesToTShirtSize(durationMinutes);

  // Clean title by removing shorthand markers
  let title = text
    .replace(/#([a-zA-Z0-9_\-]+)/g, "")
    .replace(/@([a-zA-Z0-9_\-]+)/g, "")
    .replace(/(^|\s)!{1,4}(\s|$)/g, " ")
    .replace(/~([\d\.]+)(min|m|h|hour|hours)?/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!title) {
    title = input.trim() || "Untitled Task";
  }

  // Generate tokens for syntax highlighting overlay
  const tokens = tokenizeShorthand(input);

  return {
    raw,
    title,
    category,
    resurfaceOn,
    priority,
    durationMinutes,
    tshirtSize,
    tokens,
  };
}

function resolveDateKeyword(keyword: string, now: Date): string {
  const d = new Date(now);
  if (keyword === "today") {
    return formatDate(d);
  }
  if (keyword === "tomorrow") {
    d.setDate(d.getDate() + 1);
    return formatDate(d);
  }
  if (keyword === "next-week" || keyword === "nextweek") {
    d.setDate(d.getDate() + 7);
    return formatDate(d);
  }
  // Check YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(keyword)) {
    return keyword;
  }
  // Fallback default tomorrow
  d.setDate(d.getDate() + 1);
  return formatDate(d);
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function minutesToTShirtSize(minutes: number): TshirtSize {
  if (minutes <= 20) return "XS";
  if (minutes <= 45) return "S";
  if (minutes <= 90) return "M";
  if (minutes <= 180) return "L";
  return "XL";
}

function tokenizeShorthand(input: string): ParsedShorthandToken[] {
  const tokens: ParsedShorthandToken[] = [];
  const words = input.split(/(\s+)/);

  for (const word of words) {
    if (!word) continue;
    if (word.startsWith("#") && word.length > 1) {
      tokens.push({ type: "category", text: word, value: word.slice(1) });
    } else if (word.startsWith("@") && word.length > 1) {
      tokens.push({ type: "date", text: word, value: word.slice(1) });
    } else if (/^!{1,4}$/.test(word)) {
      tokens.push({ type: "urgency", text: word, value: word });
    } else if (/^~[\d\.]+(min|m|h|hour|hours)?$/i.test(word)) {
      tokens.push({ type: "duration", text: word, value: word });
    } else {
      tokens.push({ type: "text", text: word });
    }
  }

  return tokens;
}
