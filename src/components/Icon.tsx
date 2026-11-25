const PATHS = {
  shuffle: "M3 7h3.5c2 0 3.2 1 4.3 2.6l2.4 4.8C14.3 16 15.5 17 17.5 17H21M3 17h3.5c2 0 3.2-1 4.3-2.6M13.2 9.6C14.3 8 15.5 7 17.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3",
  hide: "M3 7c2 4 5.2 6 9 6s7-2 9-6M12 13v4.5M6.5 11.5l-2.3 3.7M17.5 11.5l2.3 3.7",
  edit: "M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19 4 20ZM13.5 7l3.5 3.5",
  back: "M9 6l-5 5 5 5M4 11h10a6 6 0 0 1 6 6v1",
  rules: "M8.5 9a3.5 3.5 0 1 1 5.2 3c-1.2.8-1.7 1.4-1.7 3M12 19.2v.1",
  options: "M4 7h9M19 7h1M4 17h1M11 17h9M16 4.5v5M8 14.5v5"
};

export function Icon({ name, className = "size-6" }: { name: keyof typeof PATHS; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}
