import type { Mark } from "../game/game";

export { default as topics } from "../data/topics.en.json";

export interface Dictionary {
  title: string;
  language: string;
  tapAgain: string;
  topic: Record<"draw" | "another" | "hide", string>;
  board: Record<
    "points" | "row" | "column" | "duplicate" | "check" | "edit" | "endRound" | "done" | "back" | "next" | "finish",
    string
  > & {
    round: (round: number, total: number) => string;
    box: (n: number) => string;
  };
  marks: Record<Mark, string>;
  result: Record<"title" | "again", string>;
  newGame: Record<"action" | "confirm" | "hint" | "cancel", string>;
  rules: Record<"action" | "title" | "close", string> & { steps: string[] };
  options: Record<"action" | "color" | "sound" | "on" | "off" | "close", string>;
}

export const en: Dictionary = {
  title: "No właśnie!",
  language: "Language",
  tapAgain: "Tap again",
  topic: {
    draw: "Draw a topic",
    another: "Another topic",
    hide: "Hide the topic"
  },
  board: {
    round: (r, total) => `Round ${r}/${total}`,
    points: "Points",
    box: n => `Answer ${n}`,
    row: "Row bonus",
    column: "Column bonus",
    duplicate: "You have the same answer twice",
    check: "Compare",
    edit: "Edit",
    endRound: "End round",
    done: "I’m done!",
    back: "Back",
    next: "Next round",
    finish: "Final score"
  },
  marks: { match: "Match", pair: "Pair", miss: "Miss" },
  result: { title: "Your score", again: "Play again" },
  newGame: {
    action: "New game",
    confirm: "Start a new game?",
    hint: "Your answers and points will be erased on this phone.",
    cancel: "Cancel"
  },
  rules: {
    action: "Rules",
    title: "How to play",
    close: "Got it",
    steps: [
      "For 4–12 players, best with 5–8. Score the most points in 3 rounds by writing what others write.",
      "One player draws a topic and reads it aloud. Everyone secretly writes 3 answers in any free boxes. Do this with 3 topics, so that all 9 boxes are full. Tap twice to draw, and use the arrows for another topic.",
      "An answer has one or two words. Names can be longer. Do not write the same answer twice, even for another topic.",
      "Take turns reading aloud one of your answers that has not been read yet. Everyone who wrote it, for any topic, raises a hand and taps it.",
      "Two or more other players have it: a match. Exactly one has it: shout “No właśnie!” together and mark a pair. Nobody has it: a miss. A box left empty is a miss too, and nothing can be written in it later.",
      "Tap your answer: once for a match, twice for a pair, three times for a miss. A fourth tap clears it.",
      "The round ends at once when someone has marked all 9 answers: “I’m done!” Answers without a mark score nothing.",
      "A match gives 1 point and a pair gives 3. A row or column made only of matches and pairs also gives its bonus.",
      "Words with the same meaning match. A general and a specific word do not: “dog” is not “poodle”. The table decides in doubt.",
      "The player with the fewest points starts the next round. The most points after 3 rounds win."
    ]
  },
  options: { action: "Options", color: "Color", sound: "Sound", on: "On", off: "Off", close: "Done" }
};
