import { describe, expect, it } from "vitest";
import be from "./topics.be.json";
import en from "./topics.en.json";
import pl from "./topics.pl.json";
import ru from "./topics.ru.json";
import uk from "./topics.uk.json";

describe.each(Object.entries({ be, en, pl, ru, uk }))("topics: %s", (_locale, topics) => {
  // The same place is the same topic, so switching the language keeps the drawn card.
  it("has as many as English", () => expect(topics).toHaveLength(en.length));
  it("has no repeats", () => expect(new Set(topics.map(t => t.toLowerCase())).size).toBe(topics.length));
  it("fits on the card", () => expect(topics.filter(t => t.trim() !== t || t.length < 3 || t.length > 50)).toEqual([]));
});
