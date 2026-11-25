import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Bubbles } from "../components/Logo";
import type { Game } from "../game/game";
import { useLocale } from "../locales";

export function ResultScreen({ game, onPlayAgain }: { game: Game; onPlayAgain: () => void }) {
  const { t } = useLocale();
  const total = game.totals.reduce((sum, n) => sum + n, 0);
  return (
    <main className="mx-auto flex h-svh max-w-xl flex-col px-3 pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center short:pt-2">
      <Header />
      <div className="flex grow flex-col items-center justify-center gap-4">
        <Bubbles className="h-20 short:h-12" />
        <h1 className="text-3xl font-black text-balance">{t.result.title}</h1>
        <p className="chunky bg-main px-8 py-2 text-7xl font-black text-ink short:text-5xl">{total}</p>
        <p className="text-xl">{game.totals.join(" + ")}</p>
      </div>
      <Button tone="primary" className="h-14 w-full text-xl" onClick={onPlayAgain}>
        {t.result.again}
      </Button>
    </main>
  );
}
