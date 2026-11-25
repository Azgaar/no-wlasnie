import { useEffect, useReducer } from "react";
import { isUntouched, reduce, restoreGame } from "./game/game";
import { load, save } from "./game/storage";
import { GameScreen } from "./screens/GameScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { useAppUpdates } from "./update";
import { useWakeLock } from "./useWakeLock";

export function App() {
  const [game, dispatch] = useReducer(reduce, null, () => restoreGame(load("game")));
  useEffect(() => save("game", game), [game]);
  useWakeLock();
  useAppUpdates(game.phase === "final" || isUntouched(game));

  const startNew = () => {
    save("topicOpen", false);
    dispatch({ type: "new" });
  };

  return game.phase === "final" ? (
    <ResultScreen game={game} onPlayAgain={startNew} />
  ) : (
    <GameScreen game={game} dispatch={dispatch} onNewGame={startNew} />
  );
}
