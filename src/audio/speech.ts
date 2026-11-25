import type { Locale } from "../locales";

const TAGS: Record<Locale, string> = { en: "en-US", pl: "pl-PL", be: "be-BY", ru: "ru-RU", uk: "uk-UA" };

const BE_ONES = [
  "нуль", "адзін", "два", "тры", "чатыры", "пяць", "шэсць", "сем", "восем", "дзевяць",
  "дзесяць", "адзінаццаць", "дванаццаць", "трынаццаць", "чатырнаццаць", "пятнаццаць", "шаснаццаць", "семнаццаць",
  "васямнаццаць", "дзевятнаццаць"
];
const BE_TENS = [
  "", "", "дваццаць", "трыццаць", "сорак", "пяцьдзясят", "шэсцьдзесят", "семдзесят", "восемдзесят", "дзевяноста"
];
const BE_HUNDREDS = ["", "сто", "дзвесце"];

/** 0–299: more than three rounds can give. */
export function spellBelarusian(n: number): string {
  if (n < 20) return BE_ONES[n]!;
  const [large, rest] =
    n < 100 ? [BE_TENS[Math.floor(n / 10)]!, n % 10] : [BE_HUNDREDS[Math.floor(n / 100)]!, n % 100];
  return rest ? `${large} ${spellBelarusian(rest)}` : large;
}

/** Belarusian for a Russian voice: numbers as words, and the nearest letters for those that Russian does not have. */
const respell = (text: string): string =>
  text
    .replace(/\d+/g, digits => (Number(digits) < 300 ? spellBelarusian(Number(digits)) : digits))
    .replaceAll("і", "и")
    .replaceAll("І", "И")
    .replaceAll("ў", "у")
    .replaceAll("Ў", "У")
    .replace(/['’ʼ]/g, "ъ");

interface Speech {
  text: string;
  tag: string;
}

/** Null when the device has no voice for the language: another language would be confusing. */
export function getSpeech(text: string, locale: Locale, voiceTags: string[]): Speech | null {
  // Some browsers never list their voices.
  const has = (key: Locale) => voiceTags.length === 0 || voiceTags.some(tag => tag.toLowerCase().split(/[-_]/)[0] === key);
  // Hardly any device speaks Belarusian, but a Russian voice can read it.
  if (locale === "be" && (voiceTags.length === 0 || !has("be"))) {
    return has("ru") ? { text: respell(text), tag: TAGS.ru } : null;
  }
  return has(locale) ? { text, tag: TAGS[locale] } : null;
}

/** Best first. Apple lists joke voices too, and browsers take the first one of the language: Albert. */
const ENGLISH_VOICES = [/\(Premium\)/, /\(Enhanced\)/, /^Samantha/, /^Daniel/];

/** Undefined when none is here: then the browser chooses. Voices from the network do not work offline. */
export function pickEnglishVoice<V extends Pick<SpeechSynthesisVoice, "name" | "lang" | "localService">>(voices: V[]): V | undefined {
  const usable = voices.filter(voice => voice.localService && /^en[-_](US|GB)/i.test(voice.lang));
  for (const name of ENGLISH_VOICES) {
    const found = usable.find(voice => name.test(voice.name));
    if (found) return found;
  }
  return undefined;
}

const getSynth = (): SpeechSynthesis | undefined => globalThis.speechSynthesis;

// The first call only starts to load the list in some browsers.
getSynth()?.getVoices();

let timer: ReturnType<typeof setTimeout> | undefined;
/** Kept, because Chrome can lose an utterance that nothing refers to while it is spoken. */
let utterance: SpeechSynthesisUtterance | undefined;

/** Replaces what is spoken now. Call from a tap handler. Never throws: the game works without speech. */
export function speak(text: string, locale: Locale, delaySeconds = 0): void {
  try {
    stopSpeaking();
    const synth = getSynth();
    if (!synth) return;
    const voices = synth.getVoices();
    const speech = getSpeech(text, locale, voices.map(voice => voice.lang));
    if (!speech) return;
    utterance = new SpeechSynthesisUtterance(speech.text);
    utterance.lang = speech.tag;
    const voice = locale === "en" ? pickEnglishVoice(voices) : undefined;
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    if (delaySeconds === 0) {
      synth.speak(utterance);
      return;
    }
    // iOS speaks later only if something was spoken in the tap itself.
    const unlock = new SpeechSynthesisUtterance(" ");
    unlock.volume = 0;
    synth.speak(unlock);
    timer = setTimeout(() => utterance && synth.speak(utterance), delaySeconds * 1000);
  } catch {
    // No speech, or the browser refused.
  }
}

export function stopSpeaking(): void {
  clearTimeout(timer);
  const synth = getSynth();
  if (synth?.speaking || synth?.pending) synth.cancel();
}
