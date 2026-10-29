import type { Locale } from "./i18n";

const NB = " ";

/**
 * Typographic non-breaking spaces: no line starts with a dash or a middle dot, numbers stay
 * with their units, "Learning OS" never splits, and Polish one-letter words
 * (a, i, o, u, w, z) never end a line.
 */
export function typo(locale: Locale, s: string): string {
  let out = s
    .replace(/ —/g, `${NB}—`)
    .replace(/ · /g, `${NB}· `)
    .replace(/(\d) (?=[\p{L}%])/gu, `$1${NB}`)
    .replace(/Learning OS/g, `Learning${NB}OS`);
  if (locale === "pl") out = out.replace(/(?<=^|[\s(„"])([aiouwzAIOUWZ]) /g, `$1${NB}`);
  return out;
}
