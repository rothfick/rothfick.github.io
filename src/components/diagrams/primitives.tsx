import { ArrowDown, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { FigCaption } from "@/components/figure";
import { figures } from "@/content/diagrams";
import type { DiagramKey } from "@/content/types";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";
import { ScrollRegion } from "../scroll-region";

/** Props every diagram component accepts. */
export interface DiagramProps {
  locale: Locale;
  number?: number;
  className?: string;
}

/**
 * Every drawing sits directly on paper, with the shared caption below it:
 * "Fig. N  Title. [Kind prefix.] Caption." plus the source path.
 * The body is a size container, so a drawing lays itself out by the width it
 * is given (a full-width hero, the case-study column or a homepage row).
 */
export function Figure({
  diagram,
  locale,
  number,
  children,
  className,
  bodyClassName,
}: {
  diagram: DiagramKey;
  locale: Locale;
  number?: number;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const fig = figures[diagram];
  return (
    <figure className={cn("min-w-0", className)} data-diagram={diagram}>
      <div className={cn("@container", bodyClassName)}>{children}</div>
      <FigCaption locale={locale} number={number} title={typo(locale, fig.title[locale])} kind={fig.kind} source={fig.source}>
        {typo(locale, fig.caption[locale])}
      </FigCaption>
    </figure>
  );
}

/** Text styles shared by drawing nodes and the small headings inside figures. */
export const nodeTitle = "text-[0.9375rem] font-medium leading-[1.375rem] text-ink";
export const nodeNote = "text-sm leading-5 text-ink-2";
export const smallHeading = "text-sm font-semibold leading-5 text-ink-2";
export const monoIdent = "font-mono text-[0.8125rem] leading-5 text-ink";

export type Tone = "default" | "accent" | "dashed" | "quiet";

export const toneClass: Record<Tone, string> = {
  default: "border border-line-strong bg-raised",
  /** At most one per figure. */
  accent: "border-[1.5px] border-accent bg-accent-wash",
  /** A contract without an implementation. */
  dashed: "border border-dashed border-ink-2",
  quiet: "border border-line",
};

/**
 * A drawing node. In a horizontal flow the index ("01") sits on its own line
 * above the title.
 */
export function Box({
  title,
  mono,
  note,
  tone = "default",
  className,
  index,
}: {
  title: ReactNode;
  mono?: ReactNode;
  note?: ReactNode;
  tone?: Tone;
  className?: string;
  index?: string;
}) {
  return (
    <div className={cn("relative min-w-0 rounded-[2px] px-3.5 py-3", toneClass[tone], className)}>
      <p className={cn(nodeTitle, "[overflow-wrap:break-word]")}>
        {index && <span className="nums mb-1 block font-serif text-sm font-normal leading-5 text-ink-2">{index}</span>}
        {title}
      </p>
      {mono && <p className={cn(monoIdent, "mt-1 [overflow-wrap:anywhere]")}>{mono}</p>}
      {note && <p className={cn(nodeNote, "mt-1 [overflow-wrap:break-word]")}>{note}</p>}
    </div>
  );
}

/** Accept / Reject / Completion: an ink-2 outline, a glyph in pass or fail, never a soft fill. */
export function OutcomeBox({ outcome, title, note, className }: { outcome: "pass" | "fail"; title: ReactNode; note?: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 rounded-[2px] border border-ink-2 px-3.5 py-3", className)}>
      <p className={cn(nodeTitle, "flex items-baseline gap-2 [overflow-wrap:break-word]")}>
        <span aria-hidden className={cn("font-semibold", outcome === "pass" ? "text-pass" : "text-fail")}>
          {outcome === "pass" ? "✓" : "✕"}
        </span>
        <span className="min-w-0">{title}</span>
      </p>
      {note && <p className={cn(nodeNote, "mt-1 [overflow-wrap:break-word]")}>{note}</p>}
    </div>
  );
}

/**
 * Per drawing width: the hint shows only while the drawing is wider than the
 * column, and the edge shadows are switched off once it fits (otherwise a 1px
 * sliver of the shadow shows at the right edge).
 */
const hintHiddenAt = {
  600: "@min-[600px]/scroll:hidden",
  820: "@min-[820px]/scroll:hidden",
} as const;
const shadowOffAt = {
  600: "@min-[600px]/scroll:bg-none!",
  820: "@min-[820px]/scroll:bg-none!",
} as const;

/**
 * Lets a fixed-width SVG scroll inside its own box, so its labels never shrink
 * below 12.5px. The box is a labelled, focusable region only while the drawing
 * is wider than the column. Above it, a visible hint says so for that width.
 * Edge shadows come from `.scroll-x`. On phones the box runs to the screen
 * edges; the drawing still starts on the text edge.
 */
export function ScrollArea({
  children,
  minWidth,
  label,
  locale,
  className,
}: {
  children: ReactNode;
  minWidth: keyof typeof hintHiddenAt;
  label: string;
  locale: Locale;
  className?: string;
}) {
  return (
    <div className={cn("@container/scroll", className)}>
      <p className={cn("mb-3 flex items-center gap-1.5 text-sm leading-5 text-ink-2", hintHiddenAt[minWidth])}>
        {typo(locale, ui.project.scrollHint[locale])}
        <ArrowRight aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
      </p>
      <ScrollRegion
        className={cn("scroll-x focus-visible:-outline-offset-2 max-sm:-mx-[var(--pad)] max-sm:px-[var(--pad)]", shadowOffAt[minWidth])}
        label={label}
      >
        <div style={{ minWidth }}>{children}</div>
      </ScrollRegion>
    </div>
  );
}

/** One entry on a rail: a title, an optional identifier and one note line. */
export interface RailEntry {
  title: ReactNode;
  mono?: ReactNode;
  note?: ReactNode;
  /** The one emphasised step of the drawing: boxed in the accent, over the rule. */
  accent?: boolean;
}

export interface RailStep {
  key: string;
  /** Usually one; parallel parts of the same step (two inputs, two outcomes) share a stretch of the rule. */
  entries: RailEntry[];
  /** A contract without an implementation: its stretch of the rule is dashed. */
  dashed?: boolean;
}

/**
 * A flow when there is no room to draw it across: a list along one vertical
 * rule, with no box per step. Only the emphasised step keeps a box. A numbered
 * rail carries the step numbers left of the rule; an unnumbered one (`arrows`)
 * marks the direction with an arrowhead on the rule between steps.
 * `split` sets title and note side by side once the figure is 512px wide.
 * `tail` runs the rule on below the last step, into whatever follows.
 * `indexColumn` overrides the width of the number column, so a rail nested in
 * a padded box can keep its rule on the line of the rail outside it.
 */
export function Rail({
  steps,
  numbered = false,
  start = 1,
  split = false,
  tail = false,
  indexColumn = "grid-cols-[2.25rem_minmax(0,1fr)]",
  className,
}: {
  steps: RailStep[];
  numbered?: boolean;
  start?: number;
  split?: boolean;
  tail?: boolean;
  indexColumn?: string;
  className?: string;
}) {
  return (
    <ol start={numbered && start !== 1 ? start : undefined} className={className}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.key} className={cn("grid items-baseline", numbered ? indexColumn : "grid-cols-1")}>
            {numbered && (
              <span aria-hidden className="nums font-serif text-sm leading-5 text-ink-2">
                {pad2(start + i)}
              </span>
            )}
            <div
              className={cn(
                "relative min-w-0 border-l pl-4",
                step.dashed ? "border-dashed border-ink-2" : numbered ? "border-line-strong" : "border-ink-2",
                last ? (tail ? "pb-3" : "") : numbered ? "pb-4" : "pb-6",
              )}
            >
              {step.entries.map((entry, j) => (
                <RailEntryBody key={j} entry={entry} split={split} className={j > 0 ? "mt-3" : undefined} />
              ))}
              {!numbered && !last && (
                <svg aria-hidden viewBox="0 0 8 7" className="absolute -left-[3.5px] bottom-1 h-[7px] w-2 fill-ink-2">
                  <path d="M0,0 L8,0 L4,7 z" />
                </svg>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function RailEntryBody({ entry, split, className }: { entry: RailEntry; split: boolean; className?: string }) {
  return (
    <div
      className={cn(
        split && "@lg:grid @lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] @lg:items-baseline @lg:gap-x-6",
        // Boxed over the rule; the text stays on the line of the other steps.
        entry.accent && "-ml-[17px] rounded-[2px] border-[1.5px] border-accent bg-accent-wash py-2.5 pl-[15.5px] pr-3.5",
        className,
      )}
    >
      <div className="min-w-0">
        <p className={cn(nodeTitle, "[overflow-wrap:break-word]")}>{entry.title}</p>
        {entry.mono && <p className={cn(monoIdent, "mt-0.5 [overflow-wrap:anywhere]")}>{entry.mono}</p>}
      </div>
      {entry.note && <p className={cn(nodeNote, "mt-0.5 [overflow-wrap:break-word]", split && "@lg:mt-0")}>{entry.note}</p>}
    </div>
  );
}

/** A connector pointing down, used between stacked layers. */
export function DownArrow({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex justify-center py-1.5 text-ink-2", className)}>
      <ArrowDown className="size-4" strokeWidth={1.5} />
    </span>
  );
}

/**
 * typo() plus three rules for drawing labels: a "·" separator or a "→" never
 * starts a line, "≥" stays with the value after it ("≥ 0.8") and a numeric range
 * ("1–12,000") never splits.
 */
export function dtypo(locale: Locale, s: string): string {
  return typo(
    locale,
    s
      .replace(/ ([·→]) /g, "\u00A0$1 ")
      .replace(/([≥≤]) (?=\S)/g, "$1\u00A0")
      .replace(/(\d)–(?=\d)/g, "$1–\u2060"),
  );
}

/** "01", "02" … for node indexes. */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Turns a list of labels into one sentence: "Correctness, groundedness … and robustness."
 * Used instead of pills.
 */
export function listSentence(locale: Locale, items: string[], { capitalize = true }: { capitalize?: boolean } = {}): string {
  // Lower-case the first letter of each item unless it starts an acronym ("JSON validity").
  const lower = (s: string) => (/^\p{Lu}\p{Ll}/u.test(s) ? s.charAt(0).toLocaleLowerCase(locale) + s.slice(1) : s);
  const lowered = items.map((s, i) => (i === 0 && capitalize ? s : lower(s)));
  return `${new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(lowered)}.`;
}

/**
 * Sets code identifiers inside running text in mono: `store.transaction()`,
 * camelCase names such as `nextReviewAt`, and parenthesised field lists such as
 * "(sourceId · versionId · locator)". Everything else stays in the text face.
 */
const IDENT = /(\((?:[a-z][A-Za-z]*[ \u00A0]·[ \u00A0])+[a-z][A-Za-z]*\)|\b[a-z]+\.[a-z]+\(\)|\b[a-z]+[A-Z][A-Za-z]*\b(?:\(\))?)/g;

export function Idents({ text }: { text: string }) {
  const parts = text.split(IDENT);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-mono text-[0.8125rem] text-ink">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
