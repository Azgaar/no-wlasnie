import { describe, expect, it } from "vitest";
import {
  type Action, type Cell, type Game, getDuplicates, getScore, isAllMarked, isUntouched, type Mark,
  newGame, nextMark, reduce, restoreGame, ROUNDS
} from "./game";

const run = (game: Game, ...actions: Action[]) => actions.reduce(reduce, game);
const write = (cell: number, text: string): Action => ({ type: "write", cell, text });
const fill = (): Action[] => Array.from({ length: 9 }, (_, i) => write(i, `answer ${i}`));

/** One letter per cell: m match, p pair, x miss, - not marked. */
const board = (marks: string): Cell[] =>
  [...marks.replace(/\s/g, "")].map((letter, i) => ({
    text: `answer ${i}`,
    mark: ({ m: "match", p: "pair", x: "miss" } as Record<string, Mark>)[letter] ?? null
  }));

describe("score", () => {
  it.each([
    ["nothing marked", "--- --- ---", 0],
    ["one match", "m-- --- ---", 1],
    ["one pair", "-p- --- ---", 3],
    ["misses", "xxx xxx xxx", 0],
    ["a row of matches: 3 + bonus 2", "mmm xxx xxx", 5],
    ["the middle row: 3 + bonus 3", "xxx mmm xxx", 6],
    ["the last row: 3 + bonus 1", "xxx xxx mmm", 4],
    ["the first column: 3 + bonus 1", "mxx mxx mxx", 4],
    ["the middle column: 3 + bonus 3", "xmx xmx xmx", 6],
    ["the last column: 3 + bonus 2", "xxm xxm xxm", 5],
    ["pairs complete a line too: 3 + 1 + 1 + bonus 2", "pmm xxx xxx", 7],
    ["an unmarked answer breaks a line", "mm- xxx xxx", 2],
    ["a full board of matches: 9 + 12", "mmm mmm mmm", 21],
    ["a full board of pairs: 27 + 12", "ppp ppp ppp", 39]
  ])("%s", (_name, marks, total) => expect(getScore(board(marks)).total).toBe(total));

  it("adds up from its parts", () => {
    const { matches, pairs, bonus, total } = getScore(board("mmm mmp mxx"));
    expect({ matches, pairs, bonus, total }).toEqual({ matches: 6, pairs: 1, bonus: 6, total: 15 });
  });
});

describe("writing", () => {
  it("finds the same answer in any case and spacing", () => {
    const game = run(newGame(), write(0, "Ice  cream "), write(1, "ice cream"), write(2, "Ёлка"), write(3, "елка"), write(4, "x"));
    expect([...getDuplicates(game.cells)]).toEqual([0, 1, 2, 3]);
    expect(getDuplicates(newGame().cells).size).toBe(0);
  });

  it("drops the mark of a changed answer only", () => {
    const marked = run(newGame(), ...fill(), { type: "phase", phase: "mark" },
      { type: "mark", cell: 0, mark: "match" }, { type: "mark", cell: 1, mark: "pair" }, { type: "phase", phase: "write" });
    const game = run(marked, write(0, "Answer 0"), write(1, "other"));
    expect(game.cells[0]!.mark).toBe("match");
    expect(game.cells[1]!.mark).toBeNull();
  });
});

describe("marking", () => {
  it("works only in its phase and only on written answers", () => {
    const mark: Action = { type: "mark", cell: 0, mark: "match" };
    expect(run(newGame(), write(0, "a"), mark).cells[0]!.mark).toBeNull();
    expect(run(newGame(), { type: "phase", phase: "mark" }, mark).cells[0]!.mark).toBe("miss");
    const marked = run(newGame(), write(0, "a"), { type: "phase", phase: "mark" }, mark);
    expect(marked.cells[0]!.mark).toBe("match");
    // With empty boxes a player cannot end the round early.
    expect(isAllMarked(marked)).toBe(false);
    expect(isAllMarked({ ...marked, cells: board("mmm xxx ppp") })).toBe(true);
    expect(run(marked, { type: "mark", cell: 0, mark: null }).cells[0]!.mark).toBeNull();
    expect(run(marked, write(1, "late")).cells[1]!.text).toBe("");
  });
});

it("taps go through the marks and back to none", () => {
  const marks: (Mark | null)[] = [null];
  for (let i = 0; i < 4; i++) marks.push(nextMark(marks.at(-1)!));
  expect(marks).toEqual([null, "match", "pair", "miss", null]);
});

describe("empty boxes", () => {
  const compared = run(newGame(), write(0, "a"), { type: "phase", phase: "mark" });

  it("are misses once the answers are compared", () => {
    expect(compared.cells.map(c => c.mark)).toEqual([null, ...Array(8).fill("miss")]);
    expect(getScore(compared.cells).total).toBe(0);
  });

  it("cannot be marked or written any more", () => {
    expect(run(compared, { type: "mark", cell: 1, mark: "pair" })).toBe(compared);
    const edited = run(compared, { type: "phase", phase: "write" }, write(1, "late"), write(0, "fixed"));
    expect(edited.cells[1]).toEqual({ text: "", mark: "miss" });
    expect(edited.cells[0]!.text).toBe("fixed");
  });

  it("stay open when an answer is only being rewritten", () => {
    const edited = run(compared, { type: "phase", phase: "write" }, write(0, ""), write(0, "again"));
    expect(edited.cells[0]).toMatchObject({ text: "again", mark: null });
  });

  it("are open again in the next round", () => {
    const next = run(compared, { type: "phase", phase: "score" }, { type: "next" });
    expect(next.cells.every(c => c.mark === null)).toBe(true);
  });
});

describe("rounds", () => {
  const round = (mark: Mark): Action[] => [
    ...fill(), { type: "phase", phase: "mark" }, { type: "mark", cell: 0, mark }, { type: "phase", phase: "score" }, { type: "next" }
  ];

  it("play three and add up", () => {
    const second = run(newGame(), ...round("pair"));
    expect(second).toMatchObject({ round: 2, phase: "write", totals: [3] });
    expect(second.cells.every(c => c.text === "")).toBe(true);
    const last = run(second, ...round("match"), ...round("miss"));
    expect(last).toMatchObject({ round: ROUNDS, phase: "final", totals: [3, 1, 0] });
    expect(run(last, { type: "phase", phase: "mark" })).toBe(last);
    expect(run(last, { type: "new" })).toEqual(newGame());
  });

  it("do not end from the board", () => expect(run(newGame(), { type: "next" }).round).toBe(1));

  it("know an untouched game", () => {
    expect(isUntouched(newGame())).toBe(true);
    expect(isUntouched(run(newGame(), write(0, "a")))).toBe(false);
    expect(isUntouched(run(newGame(), ...round("pair")))).toBe(false);
  });
});

describe("saved game", () => {
  it("is restored", () => {
    const game = run(newGame(), ...fill(), { type: "phase", phase: "mark" }, { type: "mark", cell: 3, mark: "miss" });
    expect(restoreGame(JSON.parse(JSON.stringify(game)))).toEqual(game);
  });

  it.each([
    null, 5, "x", {}, { ...newGame(), round: 4 }, { ...newGame(), phase: "x" }, { ...newGame(), cells: [] },
    { ...newGame(), totals: [1] }, { ...newGame(), cells: newGame().cells.map(c => ({ ...c, mark: "star" })) }
  ])("is dropped when broken: %j", saved => expect(restoreGame(saved)).toEqual(newGame()));
});
