import { describe, expect, it } from "vitest";
import { type Deck, draw, putBack, restoreDeck } from "./deck";

const topicOf = (deck: Deck) => deck.order[deck.position]!;

describe("deck", () => {
  it("shows every topic once before it repeats any", () => {
    let deck = restoreDeck(null, 20);
    const seen = Array.from({ length: 20 }, () => topicOf((deck = draw(deck))));
    expect(new Set(seen).size).toBe(20);
  });

  it("does not repeat the last topic after a reshuffle", () => {
    for (let i = 0; i < 50; i++) {
      const last: Deck = { order: [0, 1, 2], position: 2 };
      expect(topicOf(draw(last))).not.toBe(2);
    }
  });

  it("draws a topic that was put back again", () => {
    const first = draw(restoreDeck(null, 5));
    const second = draw(first);
    const reshuffled = draw({ order: [0, 1, 2], position: 2 });
    for (const deck of [first, second, reshuffled]) expect(draw(putBack(deck))).toEqual(deck);
    expect(putBack(restoreDeck(null, 5)).position).toBe(-1);
  });

  it("is restored only when it fits the topics", () => {
    const deck = draw(restoreDeck(null, 5));
    expect(restoreDeck(deck, 5)).toBe(deck);
    expect(restoreDeck(deck, 6).order).toHaveLength(6);
    expect(restoreDeck({ order: [0, 0, 1], position: 0 }, 3).position).toBe(-1);
    expect(restoreDeck({ order: [0, 1, 2], position: 3 }, 3).position).toBe(-1);
  });
});
