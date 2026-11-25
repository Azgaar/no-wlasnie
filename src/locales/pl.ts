import type { Dictionary } from "./en";

export { default as topics } from "../data/topics.pl.json";

export const pl: Dictionary = {
  title: "No właśnie!",
  language: "Język",
  tapAgain: "Dotknij ponownie",
  topic: {
    draw: "Wylosuj temat",
    another: "Inny temat",
    hide: "Ukryj temat"
  },
  board: {
    round: (r, total) => `Runda ${r}/${total}`,
    points: "Punkty",
    box: n => `Odpowiedź ${n}`,
    row: "Premia za rząd",
    column: "Premia za kolumnę",
    duplicate: "Ta sama odpowiedź jest tu dwa razy",
    check: "Porównaj",
    edit: "Popraw",
    endRound: "Zakończ rundę",
    done: "To już wszystko!",
    back: "Wróć",
    next: "Następna runda",
    finish: "Wynik końcowy"
  },
  marks: { match: "Zgoda", pair: "Para", miss: "Pudło" },
  result: { title: "Twój wynik", again: "Zagraj ponownie" },
  newGame: {
    action: "Nowa gra",
    confirm: "Zacząć nową grę?",
    hint: "Odpowiedzi i punkty na tym telefonie zostaną usunięte.",
    cancel: "Anuluj"
  },
  rules: {
    action: "Zasady",
    title: "Jak grać",
    close: "Jasne",
    steps: [
      "Gra dla 4–12 osób, najlepiej 5–8. Przez 3 rundy zdobywacie punkty, pisząc to samo co inni.",
      "Jedna osoba losuje temat i czyta go na głos. Każdy w tajemnicy wpisuje 3 odpowiedzi w dowolne wolne pola. Po 3 tematach wszystkie 9 pól jest pełnych. Losuje się dwoma dotknięciami, a strzałki zmieniają temat.",
      "Odpowiedź to jedno lub dwa słowa. Nazwy własne mogą być dłuższe. Nie wpisuj dwa razy tego samego, nawet do innego tematu.",
      "Po kolei czytacie na głos po jednej swojej odpowiedzi, której jeszcze nie było. Kto też ją ma, do dowolnego tematu, podnosi rękę i jej dotyka.",
      "Mają ją co najmniej dwie inne osoby: zgoda. Ma ją dokładnie jedna: razem wołacie „No właśnie!” i oznaczacie parę. Nikt jej nie ma: pudło. Puste pole to też pudło i nie można go już wypełnić.",
      "Dotknij swojej odpowiedzi: raz to zgoda, dwa razy para, trzy razy pudło. Czwarte dotknięcie usuwa znak.",
      "Runda kończy się od razu, gdy ktoś oznaczy wszystkie 9 odpowiedzi: „To już wszystko!”. Nieoznaczone odpowiedzi nic nie dają.",
      "Zgoda daje 1 punkt, a para 3. Rząd lub kolumna z samych zgód i par daje jeszcze premię.",
      "Słowa o tym samym znaczeniu się zgadzają. Ogólne i szczegółowe nie: „pies” to nie „pudel”. W razie wątpliwości decyduje stół.",
      "Następną rundę zaczyna osoba z najmniejszą liczbą punktów. Po 3 rundach wygrywa najwięcej punktów."
    ]
  },
  options: { action: "Opcje", color: "Kolor", sound: "Dźwięk", on: "Wł.", off: "Wył.", close: "Gotowe" }
};
