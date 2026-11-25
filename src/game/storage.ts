/** localStorage that never throws (private mode, blocked storage, stale JSON). */
export function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`no-wlasnie:${key}`);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(`no-wlasnie:${key}`, JSON.stringify(value));
  } catch {
    // The game still works for this page load.
  }
}
