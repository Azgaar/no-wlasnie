import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, type Theme, THEMES } from "./themes";

function luminance(color: string): number {
  const [r, g, b] = [1, 3, 5].map(i => {
    const value = parseInt(color.slice(i, i + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

const TEXT: [keyof Theme, keyof Theme][] = [
  ["on-ground", "ground"], ["ink", "paper"], ["ink", "main"], ["ink", "match"], ["ink", "pair"], ["paper", "miss"], ["paper", "bonus"]
];

describe.each(Object.entries(THEMES) as [string, Theme][])("theme %s", (_key, theme) => {
  it.each(TEXT)("%s is readable on %s", (text, surface) => {
    expect(contrast(theme[text], theme[surface])).toBeGreaterThanOrEqual(4.5);
  });

  it("has a different color for each mark", () => {
    expect(new Set([theme.match, theme.pair, theme.miss, theme.paper]).size).toBe(4);
  });
});

it("the default theme is the one in index.css", () => {
  const css = readFileSync(new URL("./index.css", import.meta.url), "utf8");
  for (const [role, color] of Object.entries(THEMES[DEFAULT_THEME])) {
    expect(css).toContain(`--color-${role}: ${color.toLowerCase()};`);
  }
});
