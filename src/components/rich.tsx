import { Fragment } from "react";
import type { Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";

/**
 * Renders `backticked` fragments of a content string as inline code and runs
 * typo() over everything else. Inline code is styled globally (mono 0.875em
 * on paper-dim), so code fragments are left exactly as written.
 */
export function Rich({ text, locale = "en" }: { text: string; locale?: Locale }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <code key={i}>{part}</code> : <Fragment key={i}>{typo(locale, part)}</Fragment>,
      )}
    </>
  );
}
