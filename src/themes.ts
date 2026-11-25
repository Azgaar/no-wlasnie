import { load, save } from "./game/storage";

/** Colors by role, the same as in the theme of index.css. */
export type Theme = Record<
  "ground" | "on-ground" | "ink" | "paper" | "main" | "match" | "pair" | "miss" | "bonus",
  string
>;

/** Few and clearly different, not shades of one color. */
// prettier-ignore
export const THEMES = {
  plumNight: { ground: "#43193F", "on-ground": "#FFF3DC", ink: "#1B0A1C", paper: "#FFF3DC", main: "#FFC42E", match: "#FFC42E", pair: "#4FD6B8", miss: "#744C70", bonus: "#744C70" },
  navy: { ground: "#22305C", "on-ground": "#FFF3DC", ink: "#0D1328", paper: "#FFF3DC", main: "#FF7F6B", match: "#FFD23F", pair: "#FF8B78", miss: "#4C5A8C", bonus: "#4C5A8C" },
  lagoon: { ground: "#12736D", "on-ground": "#FFF3DC", ink: "#062B29", paper: "#FFF6E0", main: "#FFD23F", match: "#FFD23F", pair: "#FF8B78", miss: "#0B4F4B", bonus: "#0B4F4B" },
  hotCoral: { ground: "#FF5C4D", "on-ground": "#2A0A18", ink: "#2A0A18", paper: "#FFF8E7", main: "#FFD028", match: "#FFD028", pair: "#4BE3C4", miss: "#7D1230", bonus: "#7D1230" },
  sunny: { ground: "#FFC831", "on-ground": "#2A1020", ink: "#2A1020", paper: "#FFF8E7", main: "#FF6B57", match: "#FF9A86", pair: "#45D6B8", miss: "#7A2A3A", bonus: "#B8322F" },
  cream: { ground: "#FFF0D2", "on-ground": "#2A1020", ink: "#2A1020", paper: "#FFFFFF", main: "#FF7563", match: "#FFD23F", pair: "#FF8B78", miss: "#6B5560", bonus: "#6B5560" }
} satisfies Record<string, Theme>;

export type ThemeKey = keyof typeof THEMES;
/** index.css and index.html start with it, so it does not flash. */
export const DEFAULT_THEME: ThemeKey = "plumNight";
export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

export function getTheme(): ThemeKey {
  const saved = load<unknown>("theme");
  return typeof saved === "string" && Object.hasOwn(THEMES, saved) ? (saved as ThemeKey) : DEFAULT_THEME;
}

export function applyTheme(key: ThemeKey): void {
  const theme: Theme = THEMES[key];
  for (const [role, color] of Object.entries(theme)) {
    document.documentElement.style.setProperty(`--color-${role}`, color);
  }
  // The bars of the browser.
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.ground);
  document.body.style.background = theme.ground;
}

export function setTheme(key: ThemeKey): void {
  save("theme", key);
  applyTheme(key);
}
