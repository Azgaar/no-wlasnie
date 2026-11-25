export const ROUNDS = 3;
export const CELLS = 9;
/** Bonus for each row, top to bottom, and each column, left to right. The center is the hot spot. */
export const ROW_BONUS = [2, 3, 1] as const;
export const COLUMN_BONUS = [1, 3, 2] as const;
export const POINTS = { match: 1, pair: 3, miss: 0 } as const;

export type Mark = keyof typeof POINTS;

export interface Cell {
  text: string;
  mark: Mark | null;
}

export type Phase = "write" | "mark" | "score" | "final";

export interface Game {
  round: number;
  phase: Phase;
  cells: Cell[];
  /** Totals of the finished rounds. */
  totals: number[];
}

export interface Score {
  matches: number;
  pairs: number;
  bonus: number;
  total: number;
  rows: boolean[];
  columns: boolean[];
}

export type Action =
  | { type: "write"; cell: number; text: string }
  | { type: "mark"; cell: number; mark: Mark | null }
  | { type: "phase"; phase: "write" | "mark" | "score" }
  | { type: "next" }
  | { type: "new" };

const emptyCells = (): Cell[] => Array.from({ length: CELLS }, () => ({ text: "", mark: null }));

export const newGame = (): Game => ({ round: 1, phase: "write", cells: emptyCells(), totals: [] });

export const isFilled = (cell: Cell): boolean => cell.text.trim() !== "";

/** An empty box is a miss once the answers are compared: nobody writes after hearing the others. */
export const isLocked = (cell: Cell): boolean => !isFilled(cell) && cell.mark === "miss";

export const isUntouched = (game: Game): boolean => game.round === 1 && !game.cells.some(isFilled);

/** All 9 answers are written and marked, so the player ends the round for the table. */
export const isAllMarked = (game: Game): boolean => game.cells.every(c => isFilled(c) && c.mark !== null);

const normalize = (text: string): string =>
  text.trim().toLowerCase().replaceAll("ё", "е").replace(/\s+/g, " ");

/** Cells with an answer that is already in another cell. */
export function getDuplicates(cells: Cell[]): Set<number> {
  const texts = cells.map(c => normalize(c.text));
  return new Set(texts.flatMap((text, i) => (text && texts.some((other, j) => j !== i && other === text) ? [i] : [])));
}

/** Each tap on an answer: no mark, match, pair, miss, and again no mark. */
export function nextMark(mark: Mark | null): Mark | null {
  const order: (Mark | null)[] = [null, "match", "pair", "miss"];
  return order[(order.indexOf(mark) + 1) % order.length] ?? null;
}

const scores = (cell: Cell): boolean => cell.mark === "match" || cell.mark === "pair";

export function getScore(cells: Cell[]): Score {
  const lines = [0, 1, 2];
  const rows = lines.map(r => lines.every(c => scores(cells[r * 3 + c]!)));
  const columns = lines.map(c => lines.every(r => scores(cells[r * 3 + c]!)));
  const matches = cells.filter(c => c.mark === "match").length;
  const pairs = cells.filter(c => c.mark === "pair").length;
  const bonus =
    ROW_BONUS.reduce<number>((sum, points, i) => sum + (rows[i] ? points : 0), 0) +
    COLUMN_BONUS.reduce<number>((sum, points, i) => sum + (columns[i] ? points : 0), 0);
  return { matches, pairs, bonus, total: matches * POINTS.match + pairs * POINTS.pair + bonus, rows, columns };
}

function write(cells: Cell[], index: number, text: string): Cell[] {
  return cells.map((cell, i) => {
    if (i !== index || isLocked(cell)) return cell;
    // A changed answer must be checked again.
    const mark = normalize(text) === normalize(cell.text) ? cell.mark : null;
    return { text, mark };
  });
}

export function reduce(game: Game, action: Action): Game {
  switch (action.type) {
    case "write":
      return game.phase === "write" ? { ...game, cells: write(game.cells, action.cell, action.text) } : game;
    case "mark": {
      const target = game.cells[action.cell];
      if (game.phase !== "mark" || !target || !isFilled(target)) return game;
      return { ...game, cells: game.cells.map((c, i) => (i === action.cell ? { ...c, mark: action.mark } : c)) };
    }
    case "phase": {
      if (game.phase === "final") return game;
      const cells =
        game.phase === "write"
          ? game.cells.map((c): Cell => (isFilled(c) ? c : { ...c, mark: "miss" }))
          : game.cells;
      return { ...game, phase: action.phase, cells };
    }
    case "next": {
      if (game.phase !== "score") return game;
      const totals = [...game.totals, getScore(game.cells).total];
      if (game.round === ROUNDS) return { ...game, phase: "final", totals };
      return { round: game.round + 1, phase: "write", cells: emptyCells(), totals };
    }
    case "new":
      return newGame();
  }
}

const isInteger = (value: unknown, min: number, max: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max;

function isCell(value: unknown): value is Cell {
  const cell = value as Cell | null;
  return (
    typeof cell === "object" &&
    cell !== null &&
    typeof cell.text === "string" &&
    (cell.mark === null || Object.hasOwn(POINTS, cell.mark))
  );
}

/** A saved game, or a new one when nothing usable was saved. */
export function restoreGame(saved: unknown): Game {
  const game = saved as Game | null;
  const valid =
    typeof game === "object" &&
    game !== null &&
    isInteger(game.round, 1, ROUNDS) &&
    ["write", "mark", "score", "final"].includes(game.phase) &&
    Array.isArray(game.cells) &&
    game.cells.length === CELLS &&
    game.cells.every(isCell) &&
    Array.isArray(game.totals) &&
    game.totals.length === (game.phase === "final" ? ROUNDS : game.round - 1) &&
    game.totals.every(total => isInteger(total, 0, 99));
  return valid ? game : newGame();
}
