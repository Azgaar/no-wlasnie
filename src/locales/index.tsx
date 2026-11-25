import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { save } from "../game/storage";

import type { Dictionary } from "./en";

interface Pack {
  t: Dictionary;
  topics: string[];
}

const pack = (t: Dictionary, topics: string[]): Pack => ({ t, topics });

/** Each pack is a separate file that is loaded when the language is used. */
const LOADERS = {
  en: () => import("./en").then(m => pack(m.en, m.topics)),
  pl: () => import("./pl").then(m => pack(m.pl, m.topics)),
  be: () => import("./be").then(m => pack(m.be, m.topics)),
  ru: () => import("./ru").then(m => pack(m.ru, m.topics)),
  uk: () => import("./uk").then(m => pack(m.uk, m.topics))
};
export type Locale = keyof typeof LOADERS;

/** Must be known before any pack is loaded. */
const NAMES: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
  be: "Беларуская",
  ru: "Русский",
  uk: "Українська"
};

export const LOCALE_KEYS = Object.keys(LOADERS) as Locale[];
export const LOCALE_NAMES = LOCALE_KEYS.map(key => [key, NAMES[key]] as const);

const isLocale = (key: string): key is Locale => Object.hasOwn(LOADERS, key);

/** The saved choice, then the first supported browser language, then English. */
export function pickLocale(saved: string | null, browserLanguages: readonly string[]): Locale {
  if (saved !== null && isLocale(saved)) return saved;
  const keys = browserLanguages.map(tag => tag.split("-")[0]!.toLowerCase());
  return keys.find(isLocale) ?? "en";
}

interface LoadedLocale extends Pack {
  locale: Locale;
}

export const loadLocale = async (locale: Locale): Promise<LoadedLocale> => ({ locale, ...(await LOADERS[locale]()) });

/** Falls back to any language that can be loaded, for example when offline. */
export async function loadFirstLocale(preferred: Locale): Promise<LoadedLocale> {
  for (const locale of [preferred, ...LOCALE_KEYS.filter(l => l !== preferred)]) {
    try {
      return await loadLocale(locale);
    } catch {
      // Try the next one.
    }
  }
  throw new Error("No language could be loaded");
}

interface LocaleValue extends LoadedLocale {
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ initial, children }: { initial: LoadedLocale; children: ReactNode }) {
  const [active, setActive] = useState(initial);
  const requested = useRef(initial.locale);

  // The old language stays on screen until the new one is here. The last request wins.
  const setLocale = (next: Locale) => {
    requested.current = next;
    loadLocale(next).then(
      loaded => {
        if (requested.current !== next) return;
        save("locale", next);
        setActive(loaded);
      },
      () => {
        if (requested.current === next) requested.current = active.locale;
      }
    );
  };

  useEffect(() => {
    document.documentElement.lang = active.locale;
    document.title = active.t.title;
  }, [active]);

  return <LocaleContext value={{ ...active, setLocale }}>{children}</LocaleContext>;
}

export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale needs a LocaleProvider");
  return value;
}
