import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { evalPipelineDiagram, evaluatorsDiagram, regressionDiagram } from "@/content/diagrams";
import { cn } from "@/lib/cn";
import { Box, type DiagramProps, dtypo, Figure, listSentence, nodeNote, nodeTitle, OutcomeBox, pad2, Rail, smallHeading } from "./primitives";
import { Schematic } from "./schematic";

// From a 768px-wide figure: a U-shaped pipeline (top row left→right, bottom row right→left).
// Narrower: a numbered rail.
const placement = [
  "@3xl:col-start-1 @3xl:row-start-1",
  "@3xl:col-start-2 @3xl:row-start-1",
  "@3xl:col-start-3 @3xl:row-start-1",
  "@3xl:col-start-4 @3xl:row-start-1",
  "@3xl:col-start-5 @3xl:row-start-1",
  "@3xl:col-start-3 @3xl:col-span-3 @3xl:row-start-3",
  "@3xl:col-start-2 @3xl:row-start-3",
  "@3xl:col-start-1 @3xl:row-start-3",
];

export function EvalPipelineDiagram({ locale, number, className }: DiagramProps) {
  const d = evalPipelineDiagram;
  const t = (s: string) => dtypo(locale, s);
  return (
    <Figure diagram="eval-pipeline" locale={locale} number={number} className={className}>
      <Rail
        numbered
        split
        className="max-w-[44rem] @3xl:hidden"
        steps={d.stages.map((stage, i) => ({
          key: stage.name.en,
          entries: [{ title: t(stage.name[locale]), note: t(stage.note[locale]), accent: i === 5 }],
          dashed: i === 7,
        }))}
      />
      <ol className="hidden @3xl:grid @3xl:grid-cols-5 @3xl:gap-x-8">
        {d.stages.map((stage, i) => (
          <li key={stage.name.en} className={cn("relative flex flex-col", placement[i])}>
            <Box
              index={pad2(i + 1)}
              title={t(stage.name[locale])}
              note={t(stage.note[locale])}
              tone={i === 5 ? "accent" : i === 7 ? "dashed" : "default"}
              className="h-full"
            />
            {i < 4 && (
              <ArrowRight aria-hidden strokeWidth={1.5} className="absolute -right-6 top-1/2 hidden size-4 -translate-y-1/2 text-ink-2 @3xl:block" />
            )}
            {(i === 5 || i === 6) && (
              <ArrowLeft aria-hidden strokeWidth={1.5} className="absolute -left-6 top-1/2 hidden size-4 -translate-y-1/2 text-ink-2 @3xl:block" />
            )}
          </li>
        ))}
        <li aria-hidden className="hidden items-center justify-center gap-1.5 py-2.5 text-sm leading-5 text-ink-2 @3xl:col-start-3 @3xl:row-start-2 @3xl:flex">
          <ArrowDown className="size-4" strokeWidth={1.5} />
          {t(d.contextTap[locale])}
        </li>
        <li aria-hidden className="hidden items-center justify-center gap-1.5 py-2.5 text-sm leading-5 text-ink-2 @3xl:col-start-5 @3xl:row-start-2 @3xl:flex">
          <ArrowDown className="size-4" strokeWidth={1.5} />
          {t(d.answerTap[locale])}
        </li>
      </ol>
      <p className="mt-6 max-w-[64ch] text-sm leading-5 text-ink-2">
        <span className="font-semibold text-ink">{t(d.dimensionsLabel[locale])}.</span> {t(listSentence(locale, d.dimensions[locale]))}
      </p>
    </Figure>
  );
}

/**
 * Case studies: the full gate plus the example policy table.
 * Homepage (`compact`): no policy table; horizontal from 768px, and below 768px
 * the same figure carries a Schematic with the same caption.
 */
export function RegressionGateDiagram({
  locale,
  number,
  className,
  compact,
}: DiagramProps & {
  /** Homepage mode: no policy table; a Schematic replaces the drawing below 768px. */
  compact?: boolean;
}) {
  const d = regressionDiagram;
  const t = (s: string) => dtypo(locale, s);
  const arrow = (
    <span aria-hidden className="flex justify-center px-2 text-ink-2">
      <ArrowRight className="size-4" strokeWidth={1.5} />
    </span>
  );
  const outcome = (kind: "pass" | "fail", name: string): ReactNode => (
    <span className="flex items-baseline gap-2">
      <span aria-hidden className={cn("font-semibold", kind === "pass" ? "text-pass" : "text-fail")}>
        {kind === "pass" ? "✓" : "✕"}
      </span>
      <span className="min-w-0">{t(name)}</span>
    </span>
  );

  const drawing = (
    <>
      {/* Narrower than 512px: the same flow along a rail; the two inputs and the two outcomes each share a stretch of it. */}
      <Rail
        className="@lg:hidden"
        steps={[
          {
            key: "inputs",
            entries: [
              { title: t(d.baseline.name[locale]), note: t(d.baseline.note[locale]) },
              { title: t(d.change.name[locale]), note: t(d.change.note[locale]) },
            ],
          },
          { key: "suite", entries: [{ title: t(d.suite.name[locale]), note: t(d.suite.note[locale]), accent: true }] },
          { key: "compare", entries: [{ title: t(d.compare.name[locale]), note: t(d.compare.note[locale]) }] },
          {
            key: "outcomes",
            entries: [
              { title: outcome("pass", d.accept.name[locale]), note: t(d.accept.note[locale]) },
              { title: outcome("fail", d.reject.name[locale]), note: t(d.reject.note[locale]) },
            ],
          },
        ]}
      />
      <div className="hidden items-center @lg:grid @lg:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1.1fr)]">
        <div className="grid gap-2">
          <Box title={t(d.baseline.name[locale])} note={t(d.baseline.note[locale])} tone="quiet" />
          <Box title={t(d.change.name[locale])} note={t(d.change.note[locale])} />
        </div>
        {arrow}
        <Box title={t(d.suite.name[locale])} note={t(d.suite.note[locale])} tone="accent" />
        {arrow}
        <Box title={t(d.compare.name[locale])} note={t(d.compare.note[locale])} />
        {arrow}
        <div className="grid gap-2">
          <OutcomeBox outcome="pass" title={t(d.accept.name[locale])} note={t(d.accept.note[locale])} />
          <OutcomeBox outcome="fail" title={t(d.reject.name[locale])} note={t(d.reject.note[locale])} />
        </div>
      </div>
    </>
  );

  if (compact) {
    return (
      <Figure diagram="eval-regression" locale={locale} number={number} className={className}>
        <div className="max-md:hidden">{drawing}</div>
        <Schematic
          className="md:hidden"
          steps={[
            { label: t(`${d.baseline.name[locale]} + ${d.change.name[locale]}`) },
            { label: t(d.suite.name[locale]), gate: true },
            { label: t(d.compare.name[locale]) },
            {
              label: (
                <>
                  <span aria-hidden className="text-pass">
                    ✓
                  </span>{" "}
                  {t(d.accept.name[locale])} /{" "}
                  <span aria-hidden className="text-fail">
                    ✕
                  </span>{" "}
                  {t(d.reject.name[locale])}
                </>
              ),
            },
          ]}
        />
      </Figure>
    );
  }

  return (
    <Figure diagram="eval-regression" locale={locale} number={number} className={className}>
      {drawing}
      <table className="mt-8 w-full max-w-[48rem] border-collapse text-left">
        <caption className={cn(smallHeading, "pb-2 text-left")}>{t(d.policyLabel[locale])}</caption>
        <tbody className="border-t border-line">
          {d.policy.map((row) => (
            <tr key={row.gate.en} className="border-b border-line">
              <th scope="row" className="w-2/5 py-2.5 pr-4 align-top text-[0.9375rem] font-medium leading-[1.375rem] text-ink">
                {t(row.gate[locale])}
              </th>
              <td className="py-2.5 align-top text-[0.9375rem] leading-[1.375rem] text-ink-2">{t(row.rule[locale])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  );
}

const costValue = { low: 1, medium: 2, high: 3 } as const;
const speedValue = { slow: 1, medium: 2, fast: 3 } as const;

function Meter({ label, level, text }: { label: string; level: 1 | 2 | 3; text: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm leading-5">
      <dt className="text-ink-2">{label}</dt>
      <dd className="flex items-center gap-2.5 text-ink">
        <span aria-hidden className="flex gap-0.5">
          {[1, 2, 3].map((n) => (
            <span key={n} className={cn("h-2 w-4", n <= level ? "bg-ink" : "border border-line-strong")} />
          ))}
        </span>
        <span className="min-w-[4.25rem] text-right">{text}</span>
      </dd>
    </div>
  );
}

export function EvaluatorTypesDiagram({ locale, number, className }: DiagramProps) {
  const d = evaluatorsDiagram;
  const t = (s: string) => dtypo(locale, s);
  return (
    <Figure diagram="eval-evaluators" locale={locale} number={number} className={className}>
      <ul className="grid gap-x-8 gap-y-8 @lg:grid-cols-2 @lg:gap-y-10 @min-[52rem]:grid-cols-4 @min-[52rem]:gap-x-6">
        {d.types.map((type) => {
          const speedKey = type.speed as "fast" | "medium" | "slow";
          const costKey = type.cost as "low" | "medium" | "high";
          return (
            <li key={type.name.en} className="flex flex-col border-t border-line-strong pt-3">
              <p className={cn(nodeTitle, "font-semibold")}>{t(type.name[locale])}</p>
              {/* Narrow figures: two run-in sentences. Wider: a short list under a small heading. */}
              <p className={cn(nodeNote, "mt-2 @lg:hidden")}>
                <span className="font-semibold text-ink">{t(d.bestFor[locale])}:</span> {t(listSentence(locale, type.bestFor[locale], { capitalize: false }))}
              </p>
              <p className={cn(nodeNote, "mt-2 @lg:hidden")}>
                <span className="font-semibold text-ink">{t(d.blindSpot[locale])}:</span> {t(type.blindSpot[locale])}
              </p>
              <p className={cn(smallHeading, "mt-4 hidden @lg:block")}>{t(d.bestFor[locale])}</p>
              <ul className={cn(nodeNote, "mt-1.5 hidden space-y-1 @lg:block")}>
                {type.bestFor[locale].map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden>–</span>
                    {t(b)}
                  </li>
                ))}
              </ul>
              <p className={cn(smallHeading, "mt-4 hidden @lg:block")}>{t(d.blindSpot[locale])}</p>
              <p className={cn(nodeNote, "mt-1.5 hidden flex-1 @lg:block")}>{t(type.blindSpot[locale])}</p>
              <dl className="mt-3 grid gap-1.5 border-t border-line pt-3 @lg:mt-4">
                <Meter label={t(d.cost[locale])} level={costValue[costKey]} text={t(d.costLevels[costKey][locale])} />
                <Meter label={t(d.speed[locale])} level={speedValue[speedKey]} text={t(d.speedLevels[speedKey][locale])} />
              </dl>
            </li>
          );
        })}
      </ul>
    </Figure>
  );
}
