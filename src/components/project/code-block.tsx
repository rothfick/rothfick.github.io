import { getSnippet } from "@/content/snippets";
import type { SnippetKey } from "@/content/types";
import { ui } from "@/content/ui";
import { highlight } from "@/lib/highlight";
import type { Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";
import { ScrollRegion } from "../scroll-region";

/**
 * A verbatim excerpt from the Learning OS repository, with its real path and
 * line numbers. ≥640px: no wrapping, line numbers, horizontal scroll with edge
 * shadows, focusable only when a line is wider than the column. <640px: full
 * bleed, wrapped lines.
 */
export async function CodeBlock({ id, locale, number }: { id: SnippetKey; locale: Locale; number?: number }) {
  const snippet = getSnippet(id);
  // Shiki separates lines with bare "\n" text nodes. Below 640px each line is a
  // block, so those newlines would render as blank lines: wrap them so they can
  // be hidden there while copy and paste keeps the line breaks.
  // The scroll region is the one tab stop (when it scrolls), so Shiki's own tabindex on <pre> goes.
  const html = (await highlight(snippet.code))
    .replace(' tabindex="0"', "")
    .replaceAll('</span>\n<span class="line">', '</span><span class="nl">\n</span><span class="line">');
  const title = snippet.title[locale];
  return (
    <figure data-snippet={id}>
      <div className="text-[0.9375rem] leading-6">
        <p className="font-semibold text-ink">
          {number !== undefined && (
            <span className="text-accent">
              {ui.figure.listing[locale]}&nbsp;{number}
              {" "}
            </span>
          )}
          {typo(locale, title)}
        </p>
        {/* Breaks only after a slash; the line range never splits. */}
        <p className="mt-0.5 font-mono text-[0.8125rem] leading-5 text-ink-2 [overflow-wrap:anywhere]">
          {`learning-os/${snippet.file}`.split("/").map((part, i, all) => (
            <span key={i}>
              {part}
              {i < all.length - 1 && (
                <>
                  /<wbr />
                </>
              )}
            </span>
          ))}
          <span className="whitespace-nowrap">
            :{snippet.start}–{snippet.end}
          </span>
        </p>
      </div>
      {/* .scroll-x paints its edge covers in --paper; on a raised ground they must be raised too. */}
      <div className="mt-3 border-y border-line bg-raised max-sm:mx-[calc(-1*var(--pad))]">
        <ScrollRegion
          label={`${title} — ${ui.figure.code[locale]}`}
          className="code-block scroll-x [--paper:var(--raised)] focus-visible:outline-offset-[-2px] max-sm:[&_.line:empty]:min-h-[1.55em] max-sm:[&_.nl]:hidden"
          style={{ "--start": snippet.start - 1 } as React.CSSProperties}
          html={html}
        />
      </div>
      <figcaption className="mt-3 max-w-[46ch] text-sm leading-5 text-ink-2">{typo(locale, snippet.note[locale])}</figcaption>
    </figure>
  );
}
