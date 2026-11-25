/** Topics of this phone: a shuffled order, so that none repeats until all were shown. */
export interface Deck {
  order: number[];
  /** Place of the shown topic in the order, -1 before the first one. */
  position: number;
}

function shuffle(count: number, random: () => number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order;
}

const isDeck = (value: unknown, count: number): value is Deck => {
  const deck = value as Deck | null;
  return (
    typeof deck === "object" &&
    deck !== null &&
    Array.isArray(deck.order) &&
    deck.order.length === count &&
    new Set(deck.order).size === count &&
    deck.order.every(i => Number.isInteger(i) && i >= 0 && i < count) &&
    Number.isInteger(deck.position) &&
    deck.position >= -1 &&
    deck.position < count
  );
};

/** A saved deck, or a new one when the number of topics has changed. */
export const restoreDeck = (saved: unknown, count: number, random = Math.random): Deck =>
  isDeck(saved, count) ? saved : { order: shuffle(count, random), position: -1 };

export function draw(deck: Deck, random = Math.random): Deck {
  if (deck.position + 1 < deck.order.length) return { ...deck, position: deck.position + 1 };
  const last = deck.order.at(-1);
  const order = shuffle(deck.order.length, random);
  // The topic that is on the screen now must not come first again.
  if (order.length > 1 && order[0] === last) order.push(order.shift()!);
  return { order, position: 0 };
}

/** Puts the shown topic back on top, so the next draw shows it again. */
export const putBack = (deck: Deck): Deck => ({ ...deck, position: Math.max(deck.position - 1, -1) });
