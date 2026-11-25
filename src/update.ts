import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";

// A new version is downloaded in the background, but it is used only between games:
// a reload would interrupt typing.
let registration: ServiceWorkerRegistration | undefined;
let ready = false;
let allowed = false;

const applyUpdate = registerSW({
  immediate: true,
  onNeedRefresh() {
    ready = true;
    apply();
  },
  onRegisteredSW(_url, r) {
    registration = r;
  }
});

function apply(): void {
  if (ready && allowed) void applyUpdate(true);
}

async function check(): Promise<void> {
  try {
    await registration?.update();
  } catch {
    // Offline: the current version still works.
  }
}

/** While active, a new version is looked for and used as soon as it is ready. */
export function useAppUpdates(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const onShow = () => {
      if (!document.hidden) void check();
    };
    allowed = true;
    apply();
    void check();
    document.addEventListener("visibilitychange", onShow);
    return () => {
      allowed = false;
      document.removeEventListener("visibilitychange", onShow);
    };
  }, [active]);
}
