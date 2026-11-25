export type Cue = "match" | "pair" | "miss" | "done" | "result";

export interface Tone {
  /** Noise has no pitch: its frequency is the lowest one that is heard. */
  wave: OscillatorType | "noise";
  from: number;
  /** Slides to this frequency, in Hz. */
  to?: number;
  /** Seconds from the start of the cue. */
  at: number;
  length: number;
  volume: number;
}

/** C major from C5. Lower notes are too quiet on phone speakers. */
function pitch(degree: number): number {
  const semitones = [0, 2, 4, 5, 7, 9, 11];
  const octave = Math.floor(degree / 7);
  return 523.25 * 2 ** (octave + semitones[degree % 7]! / 12);
}

/** One note after another. */
function melody(degrees: number[], step: number, tone: Pick<Tone, "wave" | "volume">): Tone[] {
  return degrees.map((degree, i) => ({
    ...tone,
    from: pitch(degree),
    at: i * step,
    // The last note rings.
    length: i === degrees.length - 1 ? step * 3 : step * 1.2
  }));
}

const BELL = { wave: "triangle", volume: 0.5 } as const;

const TONES: Record<Cue, Tone[]> = {
  match: melody([4], 0.1, BELL),
  pair: melody([4, 7, 9], 0.09, BELL),
  // Soft, because it is not a fault.
  miss: [{ wave: "triangle", from: 420, to: 260, at: 0, length: 0.2, volume: 0.35 }],
  // The whole table must hear it.
  done: melody([0, 2, 4, 7, 4, 7], 0.11, { wave: "square", volume: 0.25 }),
  result: melody([0, 2, 4, 7, 4, 7, 9], 0.13, BELL)
};

export const getTones = (cue: Cue): Tone[] => TONES[cue];

/** Seconds. */
export const getLength = (cue: Cue): number => Math.max(...TONES[cue].map(tone => tone.at + tone.length));
