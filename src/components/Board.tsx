import { type CSSProperties, type KeyboardEvent, useRef } from "react";
import { type Cell, COLUMN_BONUS, getDuplicates, getScore, isFilled, isLocked, type Phase, ROW_BONUS } from "../game/game";
import { useLocale } from "../locales";

interface Props {
  cells: Cell[];
  phase: Phase;
  onTap: (cell: number) => void;
  onWrite: (cell: number, text: string) => void;
}

/** A mark shows its points, so the score needs no other explanation. */
export const MARK_STYLE = {
  match: { box: "bg-match text-ink", sign: "+1" },
  pair: { box: "bg-pair text-ink", sign: "+3" },
  miss: { box: "bg-miss text-paper", sign: "✕" }
} as const;

const CELL = "chunky relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden px-1 pt-2";
// The same text in a field and in a button: nothing moves between writing and marking.
// 16px: iOS zooms the page when a smaller field gets focus.
const TEXT = "w-full text-center text-xl max-[359px]:text-base leading-tight font-semibold tracking-tighter hyphens-auto whitespace-pre-wrap wrap-anywhere";
const MAX_LENGTH = 30;

const place = (cell: number): CSSProperties => ({ gridRow: Math.floor(cell / 3) + 1, gridColumn: (cell % 3) + 1 });

export function Board({ cells, phase, onTap, onWrite }: Props) {
  const { t } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const duplicates = getDuplicates(cells);
  const score = getScore(cells);

  // Enter goes to the next empty box, or closes the keyboard.
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    e.preventDefault();
    const boxes = [...ref.current!.querySelectorAll("textarea")];
    const order = [...boxes.slice(index + 1), ...boxes.slice(0, index)];
    const next = order.find(box => !box.disabled && box.value.trim() === "");
    if (next) next.focus();
    else boxes[index]!.blur();
  };

  return (
    <div ref={ref} className="grid h-full grid-cols-3 grid-rows-3 gap-x-2 gap-y-2.5">
      {cells.map((cell, i) => {
        const label = t.board.box(i + 1);
        const locked = isLocked(cell);
        if (phase === "write") {
          return (
            <label
              key={i}
              style={place(i)}
              className={`${CELL} ${locked ? "" : "cursor-text"} ${locked || duplicates.has(i) ? "bg-miss text-paper" : "bg-paper text-ink"}`}
            >
              {locked && <MarkSign sign={MARK_STYLE.miss.sign} />}
              <span className="grid w-full">
                {/* Gives the field the height of its text. */}
                <span aria-hidden className={`${TEXT} invisible [grid-area:1/1]`}>{`${cell.text}​`}</span>
                <textarea
                  aria-label={label}
                  aria-invalid={duplicates.has(i)}
                  value={cell.text}
                  disabled={locked}
                  rows={1}
                  maxLength={MAX_LENGTH}
                  enterKeyHint="next"
                  autoCapitalize="off"
                  autoComplete="off"
                  className={`${TEXT} resize-none overflow-hidden outline-none [grid-area:1/1]`}
                  onChange={e => onWrite(i, e.target.value.replaceAll("\n", " "))}
                  onKeyDown={e => onKeyDown(e, i)}
                />
              </span>
            </label>
          );
        }
        const mark = cell.mark && MARK_STYLE[cell.mark];
        return (
          <button
            key={i}
            type="button"
            style={place(i)}
            aria-label={`${cell.text || label}${cell.mark ? `: ${t.marks[cell.mark]}` : ""}`}
            disabled={phase !== "mark" || !isFilled(cell)}
            className={`${CELL} touch-manipulation ${mark ? mark.box : "bg-paper text-ink"}`}
            onClick={() => onTap(i)}
          >
            {mark && <MarkSign sign={mark.sign} />}
            <span className={TEXT}>{cell.text}</span>
          </button>
        );
      })}
      {/* On the outer edges of the boxes, in the page margin: they take no space from the grid. */}
      {ROW_BONUS.map((points, i) => (
        <Bonus
          key={`row-${i}`}
          points={points}
          earned={score.rows[i]!}
          label={t.board.row}
          className="col-start-3 -mr-3 h-10 w-4 self-center justify-self-end rounded-l-lg border-r-0 text-xs"
          style={{ gridRow: i + 1 }}
        />
      ))}
      {COLUMN_BONUS.map((points, i) => (
        <Bonus
          key={`column-${i}`}
          points={points}
          earned={score.columns[i]!}
          label={t.board.column}
          className="row-start-3 -mb-3.5 h-5 w-10 self-end justify-self-center rounded-lg text-sm"
          style={{ gridColumn: i + 1 }}
        />
      ))}
    </div>
  );
}

function MarkSign({ sign }: { sign: string }) {
  return (
    <span aria-hidden className="absolute top-0 right-1.5 text-base font-black">
      {sign}
    </span>
  );
}

interface BonusProps {
  points: number;
  earned: boolean;
  label: string;
  className: string;
  style: CSSProperties;
}

function Bonus({ points, earned, label, className, style }: BonusProps) {
  return (
    <span
      role="img"
      aria-label={`${label}: ${points}${earned ? " ✓" : ""}`}
      style={style}
      className={`pointer-events-none z-10 grid place-items-center border-3 border-ink leading-none font-black transition-colors ${
        earned ? "bg-pair text-ink" : "bg-bonus text-paper"
      } ${className}`}
    >
      {points}
    </span>
  );
}
