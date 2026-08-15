import { expect, test } from "bun:test";
import { parseShorthand } from "./shorthandParser.ts";

test("parses shorthand example correctly", () => {
  const fixedNow = new Date("2026-08-14T12:00:00Z");
  const result = parseShorthand("#work Ensure ticket x is handled @tomorrow !!! ~40min", fixedNow);

  expect(result.title).toBe("Ensure ticket x is handled");
  expect(result.category).toBe("work");
  expect(result.resurfaceOn).toBe("2026-08-15");
  expect(result.priority).toBe("should");
  expect(result.durationMinutes).toBe(40);
  expect(result.tshirtSize).toBe("S");
});

test("parses critical priority !!!! and duration ~1.5h", () => {
  const result = parseShorthand("#admin Submit quarterly taxes @today !!!! ~1.5h");
  expect(result.title).toBe("Submit quarterly taxes");
  expect(result.category).toBe("admin");
  expect(result.priority).toBe("must");
  expect(result.durationMinutes).toBe(90);
  expect(result.tshirtSize).toBe("M");
});

test("tokenizes shorthand string into visual tokens", () => {
  const result = parseShorthand("#personal Buy groceries ~15m");
  expect(result.tokens.length).toBeGreaterThan(0);

  const categoryToken = result.tokens.find((t) => t.type === "category");
  expect(categoryToken?.text).toBe("#personal");

  const durationToken = result.tokens.find((t) => t.type === "duration");
  expect(durationToken?.text).toBe("~15m");
});
