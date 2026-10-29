import type { Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";

/** A status sentence whose "·" separators never start a line: "Working MVP · in active development". */
export function statusText(locale: Locale, s: string): string {
  return typo(locale, s).replace(/ · /g, " · ");
}
