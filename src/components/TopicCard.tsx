import { useState } from "react";
import { announceTopic } from "../audio/play";
import { type Deck, draw, putBack, restoreDeck } from "../game/deck";
import { load, save } from "../game/storage";
import { useLocale } from "../locales";
import { useArmed } from "../useArmed";
import { Icon } from "./Icon";

/** Any phone can draw. A stray tap draws nothing, and the card has the same size in every state. */
export function TopicCard() {
  const { t, topics, locale } = useLocale();
  const [deck, setDeck] = useState<Deck>(() => restoreDeck(load("deck"), topics.length));
  const [open, setOpen] = useState(() => load("topicOpen") === true);

  const drawTopic = () => {
    const next = draw(deck);
    save("deck", next);
    save("topicOpen", true);
    setDeck(next);
    setOpen(true);
    announceTopic(topics[next.order[next.position]!]!, locale);
  };
  const hideTopic = () => {
    const next = putBack(deck);
    save("deck", next);
    save("topicOpen", false);
    setDeck(next);
    setOpen(false);
  };
  const [armed, tap] = useArmed(drawTopic);

  const topic = topics[deck.order[deck.position] ?? -1];
  if (!open || topic === undefined) {
    return (
      <button
        type="button"
        className={`chunky pressable h-full w-full text-xl font-extrabold text-ink ${armed ? "bg-main" : "bg-paper"}`}
        onClick={tap}
      >
        {armed ? t.tapAgain : t.topic.draw}
      </button>
    );
  }
  return (
    <section className="chunky flex h-full w-full items-center bg-paper text-ink">
      <button type="button" aria-label={t.topic.another} className="grid h-full w-11 shrink-0 place-items-center" onClick={drawTopic}>
        <Icon name="shuffle" />
      </button>
      <p aria-live="polite" className="line-clamp-2 grow text-center text-base leading-tight font-extrabold text-balance min-[23rem]:text-lg">
        {topic}
      </p>
      <button type="button" aria-label={t.topic.hide} className="grid h-full w-11 shrink-0 place-items-center" onClick={hideTopic}>
        <Icon name="hide" />
      </button>
    </section>
  );
}
