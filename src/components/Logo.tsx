import { useLocale } from "../locales";

/** Two speech bubbles that say the same. */
export function Bubbles({ className = "h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`stroke-ink ${className}`} aria-hidden strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round">
      <path className="fill-paper" d="M27 4h26a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-2l3 10-13-10H27a8 8 0 0 1-8-8V12a8 8 0 0 1 8-8Z" />
      <path className="fill-main" d="M11 18h26a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H24L11 60l3-10h-3a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8Z" />
      <path d="M24 25v11M24 43v.2" fill="none" strokeWidth="5.6" />
    </svg>
  );
}

export function Logo() {
  const { t } = useLocale();
  return (
    <h1 className="flex items-center gap-1 text-xl font-black tracking-tight whitespace-nowrap max-[359px]:text-base">
      <Bubbles className="h-8 max-[359px]:h-7" />
      {t.title}
    </h1>
  );
}
