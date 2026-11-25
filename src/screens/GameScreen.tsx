import { announceScore, play } from "../audio/play";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { RoundTotal } from "../components/RoundTotal";
import { TopicCard } from "../components/TopicCard";
import {
  type Action, CELLS, type Game, getDuplicates, getScore, isAllMarked, isFilled, isLocked, isUntouched, nextMark, ROUNDS
} from "../game/game";
import { save } from "../game/storage";
import { useLocale } from "../locales";
import { useArmed } from "../useArmed";

interface Props {
  game: Game;
  dispatch: (action: Action) => void;
  onNewGame: () => void;
}

/** Four slots of a fixed size in every phase: header, topic or total, board, actions. Nothing moves. */
export function GameScreen({ game, dispatch, onNewGame }: Props) {
  const { t, locale } = useLocale();
  const { round, phase, cells } = game;
  const filled = cells.filter(isFilled).length;
  const duplicates = getDuplicates(cells).size > 0;
  const allMarked = isAllMarked(game);

  const go = (next: "write" | "mark" | "score") => dispatch({ type: "phase", phase: next });
  // Empty boxes are lost, so a stray tap must not start the comparing.
  const open = cells.some(c => !isFilled(c) && !isLocked(c));
  const [armed, tapCompare] = useArmed(() => go("mark"));
  const tap = (cell: number) => {
    const mark = nextMark(cells[cell]!.mark);
    dispatch({ type: "mark", cell, mark });
    if (mark) void play(mark);
  };
  const endRound = () => {
    // Heard by the table: nobody marks anything after it.
    if (allMarked) void play("done");
    go("score");
  };
  const next = () => {
    save("topicOpen", false);
    if (round === ROUNDS) announceScore(game.totals.reduce((sum, n) => sum + n, getScore(cells).total), locale);
    dispatch({ type: "next" });
  };

  return (
    <main className="mx-auto flex h-svh min-h-110 max-w-xl flex-col gap-2 px-3 pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] short:grid short:min-h-0 short:max-w-5xl short:grid-cols-2 short:grid-rows-[auto_4rem_1fr] short:gap-x-4 short:pt-2">
      <Header onNewGame={isUntouched(game) ? undefined : onNewGame}>
        <span role="img" aria-label={t.board.round(round, ROUNDS)}>
          {round}/{ROUNDS}
        </span>
      </Header>

      <div className="h-16 shrink-0">
        {phase === "write" ? (
          <TopicCard key={round} />
        ) : (
          <RoundTotal total={getScore(cells).total} final={phase === "score"} />
        )}
      </div>

      <div className="mt-1 mb-4 min-h-0 grow short:col-start-2 short:row-span-3 short:row-start-1 short:mt-0">
        <Board cells={cells} phase={phase} onTap={tap} onWrite={(cell, text) => dispatch({ type: "write", cell, text })} />
      </div>

      <div className="flex h-14 shrink-0 gap-2 *:h-full short:self-end">
        {phase === "write" && (
          <Button
            tone={armed || (!open && !duplicates) ? "primary" : "paper"}
            className="grow text-xl"
            disabled={filled === 0}
            onClick={open ? tapCompare : () => go("mark")}
          >
            {armed ? t.tapAgain : `${t.board.check} ${filled}/${CELLS}`}
          </Button>
        )}
        {phase === "mark" && (
          <>
            <Button className="grid w-14 place-items-center" aria-label={t.board.edit} onClick={() => go("write")}>
              <Icon name="edit" />
            </Button>
            <Button tone={allMarked ? "primary" : "paper"} className="grow text-xl" onClick={endRound}>
              {allMarked ? t.board.done : t.board.endRound}
            </Button>
          </>
        )}
        {phase === "score" && (
          <>
            <Button className="grid w-14 place-items-center" aria-label={t.board.back} onClick={() => go("mark")}>
              <Icon name="back" />
            </Button>
            <Button tone="primary" className="grow text-xl" onClick={next}>
              {round === ROUNDS ? t.board.finish : t.board.next}
            </Button>
          </>
        )}
      </div>
      <p aria-live="polite" className="sr-only">{duplicates ? t.board.duplicate : ""}</p>
    </main>
  );
}
