import { POINTS, type Mark } from "../game/game";
import { useLocale } from "../locales";
import { MARK_STYLE } from "./Board";

/** The meaning of the marks, and the points of this round so far. */
export function RoundTotal({ total, final }: { total: number; final: boolean }) {
  const { t } = useLocale();
  return (
    <div className="flex h-full items-stretch gap-2">
      <ul className="flex grow items-center justify-around">
        {(Object.keys(POINTS) as Mark[]).map(mark => (
          <li key={mark} className="flex flex-col items-center gap-0.5 text-xs">
            <span aria-hidden className={`grid h-7 w-10 place-items-center rounded-lg border-2 border-ink text-sm font-black ${MARK_STYLE[mark].box}`}>
              {MARK_STYLE[mark].sign}
            </span>
            {t.marks[mark]}
          </li>
        ))}
      </ul>
      <p
        aria-label={`${t.board.points}: ${total}`}
        className={`chunky grid w-24 place-items-center text-4xl leading-none font-black text-ink ${final ? "bg-main" : "bg-paper"}`}
      >
        {total}
      </p>
    </div>
  );
}
