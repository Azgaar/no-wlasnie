# No właśnie!

Party game of matching answers for 4–12 players, best with 5–8. Each player uses a phone as a game board.
No server and no sync. It is a static PWA and works offline after the first visit.

## Rules

Score the most points in 3 rounds by writing what others write.

1. One player draws a topic and reads it aloud. Everyone secretly writes 3 answers in any free boxes.
   After 3 topics all 9 boxes are full. Any phone can draw; the table decides whose turn it is.
2. An answer has one or two words. Names can be longer. No answer is written twice.
3. Players take turns reading aloud one of their answers that has not been read yet. Everyone who has it marks it:
   - **Match**: two or more other players have it.
   - **Pair**: exactly one other player has it. Both shout “No właśnie!”
   - **Miss**: nobody else has it.
4. The round ends at once when someone has marked all 9 answers. Answers without a mark score nothing.
5. The player with the fewest points starts the next round. The most points after 3 rounds win.

| Scored                                | Points |
| :------------------------------------ | -----: |
| Match                                 |      1 |
| Pair                                  |      3 |
| Row of matches and pairs, from top    |  2 3 1 |
| Column of matches and pairs, from left|  1 3 2 |

Words with the same meaning match. A general and a specific word do not. The table decides in doubt.

## How it works

- The app does not know the players or their number, and does not limit it.
- Phones are not connected: players mark their own answers, and compare the totals aloud.
- The game, the deck, the language, the theme and the sound setting are in `localStorage`, so a refresh loses nothing.
- Each phone shuffles the topics and repeats none until all were shown. Two phones can draw the same topic: skip it.
- A topic is drawn with two taps, so a stray tap draws nothing. The arrows change it, and the eye hides it: the
  next draw shows it again.
- Comparing turns empty boxes into misses that cannot be changed. With empty boxes it needs two taps.
- Each tap on an answer goes through the marks: match, pair, miss, none.
- Marks and answers can be changed until the next round. A changed answer loses its mark.
- With the sound on, a drawn topic and the final score are read aloud in the language of the game, if the phone has a
  voice for it.
  Belarusian falls back to a Russian voice that reads Belarusian words.
  English has preferred voices, because browsers choose a joke voice on Apple devices.
- The screen stays on, where the browser allows it.
- The service worker downloads a new version in the background. It is used only before and after a game.

## Commands

    npm install
    npm run dev
    npm test
    npm run build

## Deploy

Set GitHub Pages source to "GitHub Actions" and push to `main`.
The workflow passes `/<repo-name>/` as `BASE_PATH`; `vite.config.ts` reads it.

## Layout

- `src/game` — pure rules: board, score, deck, storage, tests
- `src/locales` — typed dictionaries (English, Polish, Belarusian, Russian, Ukrainian) and locale context
- `src/data` — topics per locale
- `src/audio` — sounds, Web Audio playback and speech
- `src/components`, `src/screens` — UI

## Topics

Plain lists, up to 50 characters each. All languages have the same topics in the same order, so switching the language
keeps the drawn card. Tests check the number of topics.

A good topic is broad enough for different answers and narrow enough for them to overlap.

## Add a language

1. Add `src/locales/<locale>.ts` and `src/data/topics.<locale>.json`.
2. Add its loader and name in `src/locales/index.tsx`, and the topics in `src/data/topics.test.ts`.

## Visual style

- Same as Żarówki: flat and tactile, 3px ink outline, 14px corners, hard `0 4px 0` shadow, Rubik 700–900.
- Made for small phones first: iPhone SE (375 × 553 with the browser bars) without scrolling.
- Nothing jumps: header, topic or total, board and actions are slots of a fixed size in every phase. Answers do not move
  between writing and marking.
- The board gets all the width. Row and column bonuses are tabs on the outer edges of the boxes, in the page margin.
- No help texts on the screen: they are in the rules. Marks show their points, earned bonuses change color.
- Colors are tokens named by role: `ground`, `on-ground`, `ink`, `paper`, `main` (buttons), `match`, `pair` (also earned
  bonuses), `miss` (also repeated answers), `bonus` (not earned yet). `src/themes.ts` has the six themes, and `src/index.css`
  repeats the default one, Plum night. Players change the theme of their phone in the options. Tests check the contrast.

## Status

Not done yet: playtests, review of the topics by native speakers.
