import { useState } from "react";
import { useLocale } from "../locales";
import { getTheme, setTheme, THEME_KEYS, type Theme, THEMES } from "../themes";

/** Each swatch has the colors of the background, a match and a pair. The choice is seen at once. */
export function ThemePicker() {
  const { t } = useLocale();
  const [current, setCurrent] = useState(getTheme);
  return (
    <div role="group" aria-label={t.options.color} className="grid grid-cols-6 gap-1.5">
      {THEME_KEYS.map((key, i) => {
        const theme: Theme = THEMES[key];
        return (
          <button
            key={key}
            type="button"
            aria-label={`${t.options.color} ${i + 1}`}
            aria-pressed={key === current}
            className={`flex h-10 touch-manipulation items-center justify-center gap-0.5 rounded-xl border-3 border-ink ${
              key === current ? "outline-4 -outline-offset-1 outline-main" : ""
            }`}
            style={{ background: theme.ground }}
            onClick={() => {
              setTheme(key);
              setCurrent(key);
            }}
          >
            {[theme.match, theme.pair].map(color => (
              <span key={color} className="size-3 rounded-full border border-ink" style={{ background: color }} />
            ))}
          </button>
        );
      })}
    </div>
  );
}
