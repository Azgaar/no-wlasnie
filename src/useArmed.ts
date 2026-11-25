import { useEffect, useState } from "react";

/** The second tap must come within this time. */
const ARMED_MS = 4000;

/** For a button that acts on the second tap, so that a stray tap does nothing. */
export function useArmed(action: () => void): [armed: boolean, tap: () => void] {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), ARMED_MS);
    return () => clearTimeout(timer);
  }, [armed]);

  const tap = () => {
    setArmed(!armed);
    if (armed) action();
  };
  return [armed, tap];
}
