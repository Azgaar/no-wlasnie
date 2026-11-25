import { useEffect } from "react";

/** Keeps the screen on: players listen for a long time between taps. */
export function useWakeLock(): void {
  useEffect(() => {
    let lock: WakeLockSentinel | undefined;
    let stopped = false;
    // The browser drops the lock when the page is hidden.
    const request = async () => {
      if (document.hidden) return;
      try {
        lock = await navigator.wakeLock?.request("screen");
        if (stopped) void lock?.release();
      } catch {
        // Not allowed, for example in the low power mode.
      }
    };
    void request();
    document.addEventListener("visibilitychange", request);
    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", request);
      void lock?.release();
    };
  }, []);
}
