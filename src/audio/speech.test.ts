import { describe, expect, it } from "vitest";
import { getSpeech, pickEnglishVoice, spellBelarusian } from "./speech";

describe("Belarusian numbers", () => {
  it.each([
    [0, "нуль"],
    [11, "адзінаццаць"],
    [20, "дваццаць"],
    [53, "пяцьдзясят тры"],
    [100, "сто"],
    [117, "сто семнаццаць"],
    [297, "дзвесце дзевяноста сем"]
  ])("%i", (n, text) => expect(spellBelarusian(n)).toBe(text));
});

describe("speech", () => {
  it("uses the selected language", () => {
    expect(getSpeech("42", "pl", ["en-US", "pl_PL"])).toEqual({ text: "42", tag: "pl-PL" });
  });

  it("respells Belarusian letters for a Russian voice", () => {
    expect(getSpeech("Ў сям’і, у саўне", "be", ["ru-RU"])?.text).toBe("У сямъи, у сауне");
    expect(getSpeech("Ў сям’і", "be", ["be-BY"])?.text).toBe("Ў сям’і");
  });

  it("spells the numbers in Belarusian topics", () => {
    expect(getSpeech("Чаго не было 50 гадоў таму", "be", ["ru-RU"])?.text).toBe("Чаго не было пяцьдзясят гадоу таму");
  });

  it("is silent without a voice for it", () => {
    expect(getSpeech("42", "uk", ["en-US", "ru-RU"])).toBeNull();
    expect(getSpeech("42", "be", ["en-US"])).toBeNull();
  });

  it("tries when the voices are not listed", () => {
    expect(getSpeech("42", "uk", [])).toEqual({ text: "42", tag: "uk-UA" });
  });

  it("reads Belarusian with a Russian voice if there is no better one", () => {
    expect(getSpeech("21", "be", ["ru-RU"])).toEqual({ text: "дваццаць адзин", tag: "ru-RU" });
    expect(getSpeech("21", "be", ["ru-RU", "be-BY"])).toEqual({ text: "21", tag: "be-BY" });
  });
});

describe("English voice", () => {
  const voice = (name: string, lang = "en-US", localService = true) => ({ name, lang, localService });

  it("is not a joke voice", () => {
    expect(pickEnglishVoice([voice("Albert"), voice("Daniel", "en-GB"), voice("Samantha")])?.name).toBe("Samantha");
  });

  it("is a downloaded better one, if there is", () => {
    const voices = [voice("Samantha"), voice("Ava (Enhanced)"), voice("Zoe (Premium)")];
    expect(pickEnglishVoice(voices)?.name).toBe("Zoe (Premium)");
  });

  it("is left to the browser otherwise", () => {
    expect(pickEnglishVoice([voice("Zosia (Premium)", "pl-PL"), voice("Samantha", "en-US", false)])).toBeUndefined();
  });
});
