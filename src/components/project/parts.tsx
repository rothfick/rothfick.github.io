import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { ui } from "@/content/ui";
import type { Decision, FailureMode, GuardState, Term } from "@/content/types";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";
import { Rich } from "../rich";
import { RunIn, StatusMarker, guardShape } from "../ui";

/**
 * Building blocks of the five-part case study. Server components only; the
 * contents rail and chapter bar live in ./contents.tsx.
 *
 * Width rule inside the reading column (c4–c12 from 1024px): wide elements
 * (figures, tables, code) take the whole column; text blocks stop at c10 from
 * 1280px, and running prose at 64ch.
 */
export const textWidth = "xl:max-w-[calc((100%-8*var(--gap))*7/9+6*var(--gap))]";

/** Running prose: paragraphs at the case-study size, 64ch, inline code allowed. */
export function Prose({ paragraphs, locale, className }: { paragraphs: string[]; locale: Locale; className?: string }) {
  return (
    <div className={cn("prose t-prose measure mt-6 text-ink", className)}>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 48)}>
          <Rich text={p} locale={locale} />
        </p>
      ))}
    </div>
  );
}

/**
 * Part opener: hairline, Roman numeral, H2, one-sentence summary.
 * The id sits on the section so a jump lands on the hairline, not mid-opener.
 */
export function Part({
  id,
  numeral,
  title,
  summary,
  first,
  children,
}: {
  id: string;
  numeral: string;
  title: string;
  summary: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={first ? "mt-16 md:mt-24" : "mt-22 md:mt-36"}>
      <div className="border-t border-line pt-6 md:pt-8">
        <p aria-hidden className="nums font-serif text-xl leading-6 text-accent">
          {numeral}
        </p>
        <h2 id={`${id}-title`} tabIndex={-1} className="t-h2 mt-3">
          {title}
        </h2>
        <p className="measure mt-4 text-[1.0625rem] leading-7 text-ink-2">{summary}</p>
      </div>
      {children}
    </section>
  );
}

/** A section inside a part: H3 with 72px above (48px on phones). */
export function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12 md:mt-18">
      <h3 id={id} tabIndex={-1} className="t-h3">
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Splits "Head sentence. The rest." into a run-in head and the rest. For
 * "Head — the rest" the rest keeps its leading space, so typo() can bind the
 * dash to the head with a no-break space.
 */
function splitRunIn(s: string): [string, string] {
  const stop = s.indexOf(". ");
  if (stop > 0) return [s.slice(0, stop + 1), s.slice(stop + 2)];
  const dash = s.indexOf(" — ");
  if (dash > 0) return [s.slice(0, dash), s.slice(dash)];
  return [s, ""];
}

/** Part I constraints: hanging Newsreader numerals, first sentence as a run-in. */
export function Constraints({ items, locale }: { items: string[]; locale: Locale }) {
  return (
    <ol className="measure mt-6 grid gap-6">
      {items.map((c, i) => {
        const [head, rest] = splitRunIn(c);
        return (
          <li key={c} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 md:grid-cols-[2.75rem_minmax(0,1fr)]">
            <span className="nums font-serif text-2xl leading-7 text-ink-2 lg:leading-[1.875rem]">{i + 1}</span>
            <p className="t-prose text-ink">
              {rest.startsWith(" ") ? (
                // A dash run-in: no space of RunIn's own, the dash follows the head on a no-break space.
                <span className="font-semibold text-ink">{typo(locale, head)}</span>
              ) : (
                <RunIn>{typo(locale, head)}</RunIn>
              )}
              {typo(locale, rest)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/** Part II decision record: a ledger of entries, no cards. */
export function DecisionLedger({ decisions, locale }: { decisions: Decision[]; locale: Locale }) {
  const p = ui.project;
  return (
    <ol className={cn("mt-6 border-b border-line", textWidth)}>
      {decisions.map((d, i) => (
        <li key={d.decision.en} data-ledger-entry className="border-t border-line py-6">
          <p className="nums text-sm font-medium leading-5 text-ink-2">{p.decisionN[locale].replace("{n}", String(i + 1))}</p>
          <h4 className="t-h4 mt-2 max-w-[34em]">{typo(locale, d.decision[locale])}</h4>
          <div className="mt-4 grid gap-3 text-base leading-[1.625rem] text-ink md:grid-cols-2 md:gap-x-[var(--gap)]">
            <p>
              <RunIn>{p.whyRunIn[locale]}</RunIn>
              {typo(locale, d.why[locale])}
            </p>
            <p>
              <RunIn>{p.tradeoffRunIn[locale]}</RunIn>
              {typo(locale, d.tradeoff[locale])}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Part III opening list: en-dash markers at the prose size. */
export function ImplementationList({ items, locale }: { items: string[]; locale: Locale }) {
  return (
    <ul className="t-prose measure mt-6 grid gap-3 text-ink">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)]">
          <span aria-hidden className="text-ink-3">
            –
          </span>
          <span>
            <Rich text={item} locale={locale} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Terms of a deep dive: a glossary with the term in 600. */
export function TermList({ terms, locale }: { terms: Term[]; locale: Locale }) {
  return (
    <dl className={cn("t-body mt-8 border-b border-line text-ink", textWidth)}>
      {terms.map((t) => (
        <div key={t.term.en} className="border-t border-line py-4 md:grid md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-x-[var(--gap)]">
          <dt className="font-semibold">{typo(locale, t.term[locale])}</dt>
          <dd className="mt-1 md:mt-0">
            <Rich text={t.def[locale]} locale={locale} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Part IV current status: built (●) and planned (◌). */
export function NowNext({ now, next, locale }: { now: string[]; next: string[]; locale: Locale }) {
  const p = ui.project;
  const column = (title: string, items: string[], shape: "filled" | "dashed") => (
    <div>
      <h4 className="border-b border-line pb-3 text-base font-semibold leading-6 text-ink">{typo(locale, title)}</h4>
      <ul className="mt-4 grid gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-base leading-[1.625rem] text-ink">
            <StatusMarker shape={shape} className="mt-2" />
            <span>{typo(locale, item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className={cn("mt-6 grid gap-10 md:grid-cols-2 md:gap-x-[var(--gap)]", textWidth)}>
      {column(p.nowNote[locale], now, "filled")}
      {column(p.nextNote[locale], next, "dashed")}
    </div>
  );
}

const guardOrder: GuardState[] = ["verified", "partial", "designed", "open"];

/** Marker and label never part: "◌ W projekcie" stays on one line. */
function GuardMark({ state, locale, className }: { state: GuardState; locale: Locale; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap", className)}>
      <StatusMarker shape={guardShape[state]} />
      {typo(locale, ui.guard[state][locale])}
    </span>
  );
}

/**
 * Part V failure modes. The legend sits above. ≥1024px: a four-column table.
 * Below: one block per failure with run-in paragraphs.
 */
export function FailureTable({ modes, locale, caption }: { modes: FailureMode[]; locale: Locale; caption: string }) {
  const p = ui.project;
  return (
    <div className="mt-6">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] font-medium leading-6 text-ink">
        {guardOrder.map((state) => (
          <li key={state}>
            <GuardMark state={state} locale={locale} />
          </li>
        ))}
      </ul>
      <p className="mt-2 max-w-[64ch] text-sm leading-5 text-ink-2">{typo(locale, ui.guardLegend[locale])}</p>

      <table className="mt-8 w-full table-fixed border-collapse text-left max-lg:hidden">
        <caption className="sr-only">{caption}</caption>
        {/* The State column is sized for its longest label ("Zweryfikowane", "Verified guard"),
            which never wraps; the guard column takes what is left. */}
        <colgroup>
          <col className="w-[21%]" />
          <col className="w-[26%]" />
          <col />
          <col className="w-[9.5rem]" />
        </colgroup>
        <thead>
          <tr className="border-b border-line-strong text-sm leading-5 text-ink-2">
            <th scope="col" className="pb-3 pr-6 font-medium">
              {p.failure[locale]}
            </th>
            <th scope="col" className="pb-3 pr-6 font-medium">
              {p.symptom[locale]}
            </th>
            <th scope="col" className="pb-3 pr-6 font-medium">
              {p.guard[locale]}
            </th>
            <th scope="col" className="pb-3 font-medium">
              {p.state[locale]}
            </th>
          </tr>
        </thead>
        <tbody>
          {modes.map((m) => (
            <tr key={m.name.en} className="border-b border-line align-top">
              <th scope="row" className="py-4 pr-6 text-base font-semibold leading-6 text-ink">
                {typo(locale, m.name[locale])}
              </th>
              <td className="py-4 pr-6 text-[0.9375rem] leading-6 text-ink">{typo(locale, m.symptom[locale])}</td>
              <td className="py-4 pr-6 text-[0.9375rem] leading-6 text-ink">{typo(locale, m.guard[locale])}</td>
              <td className="py-4 text-[0.9375rem] font-medium leading-6 text-ink">
                <GuardMark state={m.state} locale={locale} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="mt-6 border-b border-line lg:hidden">
        {modes.map((m) => (
          <li key={m.name.en} className="border-t border-line py-5">
            <p className="text-[1.0625rem] font-semibold leading-6 text-ink">{typo(locale, m.name[locale])}</p>
            <p className="mt-1 text-sm font-medium leading-5 text-ink-2">
              <GuardMark state={m.state} locale={locale} />
            </p>
            <p className="mt-3 text-base leading-[1.625rem] text-ink">
              <RunIn>{p.symptomRunIn[locale]}</RunIn>
              {typo(locale, m.symptom[locale])}
            </p>
            <p className="mt-2 text-base leading-[1.625rem] text-ink">
              <RunIn>{p.guardRunIn[locale]}</RunIn>
              {typo(locale, m.guard[locale])}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Part V lessons: numbered paragraphs with small hanging Newsreader numerals. */
export function Lessons({ items, locale }: { items: string[]; locale: Locale }) {
  return (
    <ol className="measure mt-6 grid gap-6">
      {items.map((l, i) => (
        <li key={l} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3">
          <span className="nums font-serif text-lg leading-7 text-ink-2 lg:leading-[1.875rem]">{i + 1}</span>
          <p className="t-prose text-ink">
            <Rich text={l} locale={locale} />
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Part V next iteration: a plain ordered list. */
export function NextIteration({ items, locale }: { items: string[]; locale: Locale }) {
  return (
    <ol className="t-prose measure mt-6 grid list-decimal gap-2 pl-6 text-ink marker:nums marker:text-ink-2">
      {items.map((n) => (
        <li key={n} className="pl-1">
          <Rich text={n} locale={locale} />
        </li>
      ))}
    </ol>
  );
}

/** "Open full size": below 768px, where screenshots show a detail, links to the real PNG. */
export function FullSizeLink({ src, locale, className }: { src: string; locale: Locale; className?: string }) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex min-h-11 w-fit items-center gap-1.5 text-sm font-medium leading-5 text-ink underline decoration-accent decoration-1 underline-offset-[0.2em] motion-safe:transition-colors motion-safe:duration-150 hover:text-accent hover:decoration-2",
        className,
      )}
    >
      {ui.project.openFullSize[locale]}
      <ArrowUpRight aria-hidden strokeWidth={1.75} className="size-4 shrink-0" />
    </a>
  );
}

/** A region of a screenshot, in the image's own pixels. */
export interface ShotRegion {
  x: number;
  y: number;
  height: number;
}

/**
 * A 1:1 detail of a desktop screenshot for screens below 768px, where the whole
 * 1280px capture would shrink its text to 3–4px. The same PNG, offset inside a
 * clipping window as tall as the region and as wide as the screen allows; it is
 * meant to bleed off the right edge, so the cut reads as "continues".
 */
export function ShotDetail({
  src,
  width,
  height,
  alt,
  region,
  priority,
  className,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  region: ShotRegion;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("relative isolate overflow-hidden outline outline-1 -outline-offset-1 outline-[rgb(29_28_26/0.14)]", className)}
      style={{ height: region.height }}
    >
      {/* Under the window's hairline, which is drawn on the window itself. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- a crop of a static PNG, served as-is */}
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className="absolute -z-10 max-w-none"
        style={{ left: -region.x, top: -region.y, width, height }}
      />
    </div>
  );
}
