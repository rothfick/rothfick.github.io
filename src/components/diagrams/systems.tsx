import { Fragment } from "react";
import { agentDiagram, cadenceDiagram, figures, matrixDiagram, tiersDiagram } from "@/content/diagrams";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";
import { type DiagramProps, dtypo, Figure, nodeNote, nodeTitle, ScrollArea, smallHeading } from "./primitives";
import { Schematic } from "./schematic";

/* SVG drawings: Schibsted labels at 12.5 user units or more, 2-unit corners,
   raised nodes on a line-strong outline, ink-2 connectors. */

function SvgNode({
  x,
  y,
  w,
  h = 44,
  label,
  tone = "default",
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  tone?: "default" | "accent" | "quiet" | "outcome";
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={2}
        strokeWidth={tone === "accent" ? 1.5 : 1}
        className={cn(
          tone === "default" && "fill-raised stroke-line-strong",
          tone === "accent" && "fill-accent-wash stroke-accent",
          tone === "quiet" && "fill-none stroke-line",
          tone === "outcome" && "fill-none stroke-ink-2",
        )}
      />
      <text x={x + w / 2} y={y + h / 2} dominantBaseline="central" textAnchor="middle" fontSize={14} className="fill-ink font-medium">
        {tone === "outcome" && <tspan className="fill-pass font-semibold">✓ </tspan>}
        {label}
      </text>
    </g>
  );
}

function Arrowhead({ id, className = "fill-ink-2" }: { id: string; className?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" className={className} />
    </marker>
  );
}

/** A tier marker on the topology: the only accent in this drawing. */
function TierMark({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 15} y={y - 10} width={30} height={20} rx={2} strokeWidth={1} className="fill-paper stroke-accent" />
      <text x={x} y={y} dominantBaseline="central" textAnchor="middle" fontSize={12.5} className="fill-accent font-semibold">
        {label}
      </text>
    </g>
  );
}

function TiersTopology({ locale, idPrefix }: { locale: Locale; idPrefix: string }) {
  const d = tiersDiagram;
  const n = d.nodes;
  const t = (s: string) => dtypo(locale, s);
  const edge = "fill-none stroke-ink-2";
  const [flowId, ...flowRest] = d.flowLabel[locale].split(" · ");
  const marker = `url(#${idPrefix}-ah)`;
  return (
    <svg viewBox="0 0 600 310" role="img" aria-labelledby={`${idPrefix}-title`} className="h-auto w-full font-sans">
      <title id={`${idPrefix}-title`}>{`${figures["qa-tiers"].title[locale]}: ${d.tiers.map((x) => `${x.id} ${x.name[locale]}`).join(", ")}`}</title>
      <defs>
        <Arrowhead id={`${idPrefix}-ah`} />
      </defs>

      {/* T3 boundary: the whole flow. A boundary in ink-2 (longer dashes than T2's); only its tag is in the accent. */}
      <rect x={6} y={8} width={588} height={294} rx={2} strokeWidth={1.25} className="fill-none stroke-ink-2 [stroke-dasharray:6_5]" />
      <TierMark x={37} y={292} label={flowId ?? "T3"} />
      {flowRest.length > 0 && (
        <text x={60} y={292} dominantBaseline="central" fontSize={13} className="fill-ink-2">
          {t(flowRest.join(" · "))}
        </text>
      )}

      <rect x={190} y={26} width={394} height={34} rx={2} strokeWidth={1} className="fill-raised stroke-line-strong" />
      <text x={387} y={43} dominantBaseline="central" textAnchor="middle" fontSize={14} className="fill-ink font-medium">
        {t(n.stream[locale])}
      </text>

      <path d="M146,150 L198,150" strokeWidth={1.25} className={edge} markerEnd={marker} />
      <path d="M265,128 L265,62" strokeWidth={1.25} className={edge} markerEnd={marker} />
      <path d="M495,60 L495,126" strokeWidth={1.25} className={edge} markerEnd={marker} />
      <path d="M495,172 L495,234" strokeWidth={1.25} className={edge} markerEnd={marker} />
      <path d="M424,170 L364,236" strokeWidth={1.25} className={edge} markerEnd={marker} />

      {/* T2 boundary: one service */}
      <rect x={186} y={114} width={158} height={72} rx={2} strokeWidth={1} className="fill-none stroke-ink-2 [stroke-dasharray:3_4]" />
      <SvgNode x={16} y={128} w={130} label={t(n.client[locale])} />
      <SvgNode x={200} y={128} w={130} label={t(n.serviceA[locale])} />
      <SvgNode x={420} y={128} w={150} label={t(n.serviceB[locale])} />
      <SvgNode x={180} y={236} w={184} label={t(n.external[locale])} />
      <SvgNode x={420} y={236} w={150} label={t(n.db[locale])} />

      <TierMark x={172} y={150} label="T1" />
      <TierMark x={265} y={94} label="T1" />
      <TierMark x={330} y={114} label="T2" />
    </svg>
  );
}

/**
 * Case studies: the topology (scrolling inside its own box on phones) with a
 * tier key beside it on wide figures and below it otherwise.
 * Homepage (`compact`): the topology at full width with one legend line from
 * 768px; below 768px a T1 → T2 → T3 Schematic. No tier cards.
 */
export function QualityTiersDiagram({
  locale,
  number,
  className,
  compact,
}: DiagramProps & {
  /** Homepage mode: topology + one legend line; a Schematic replaces it below 768px. */
  compact?: boolean;
}) {
  const d = tiersDiagram;
  const t = (s: string) => dtypo(locale, s);

  if (compact) {
    return (
      <Figure diagram="qa-tiers" locale={locale} number={number} className={className}>
        <div className="max-md:hidden">
          <TiersTopology locale={locale} idPrefix="qa-tiers-compact" />
          <p className="mt-4 text-[0.9375rem] leading-[1.375rem] text-ink">
            {d.tiers.map((tier, i) => (
              <Fragment key={tier.id}>
                {i > 0 && <span className="text-ink-2"> · </span>}
                <span className="whitespace-nowrap font-semibold text-accent">{tier.id}</span> {t(tier.name[locale])}
              </Fragment>
            ))}
          </p>
        </div>
        <Schematic className="md:hidden" steps={d.tiers.map((tier) => ({ mark: tier.id, label: t(tier.name[locale]) }))} />
      </Figure>
    );
  }

  return (
    <Figure diagram="qa-tiers" locale={locale} number={number} className={className}>
      <div className="grid gap-8 @5xl:grid-cols-[minmax(0,47.5rem)_minmax(15rem,20rem)] @5xl:gap-12">
        <ScrollArea minWidth={600} label={t(figures["qa-tiers"].title[locale])} locale={locale} className="max-w-[47.5rem]">
          <TiersTopology locale={locale} idPrefix="qa-tiers" />
        </ScrollArea>
        <ol className="grid gap-5 @xl:grid-cols-3 @xl:gap-8 @5xl:grid-cols-1 @5xl:content-start @5xl:gap-6">
          {d.tiers.map((tier) => (
            <li key={tier.id} className="border-t border-line pt-3">
              <p className={nodeTitle}>
                <span className="mr-2 font-semibold text-accent">{tier.id}</span>
                {t(tier.name[locale])}
              </p>
              <p className={cn(nodeNote, "mt-1")}>{t(tier.scope[locale])}</p>
              <p className={cn(nodeNote, "mt-1")}>
                {t(d.runsLabel[locale])}: {t(tier.runs[locale])}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Figure>
  );
}

const barHeights = ["h-1/4", "h-2/4", "h-3/4", "h-full"];
const barWidths = ["w-1/4", "w-2/4", "w-3/4", "w-full"];

/**
 * Four stages whose confidence (solid ink) and cost (outlined) rise together.
 * Columns of vertical bars from a 576px-wide figure; rows of horizontal bars below that.
 */
export function ExecutionCadenceDiagram({ locale, number, className }: DiagramProps) {
  const d = cadenceDiagram;
  const t = (s: string) => dtypo(locale, s);
  return (
    <Figure diagram="qa-cadence" locale={locale} number={number} className={className}>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm leading-5 text-ink-2">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 bg-ink" />
          {t(d.confidence[locale])}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 border border-ink-2" />
          {t(d.cost[locale])}
        </span>
      </div>
      <ol className="mt-5 grid gap-5 @xl:grid-cols-4 @xl:gap-6">
        {d.stages.map((s) => (
          <li key={s.name.en} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 @xl:flex @xl:flex-col @xl:items-stretch @xl:gap-0">
            <div aria-hidden className="hidden h-36 items-end gap-1 border-b border-line-strong @xl:flex">
              <span className={cn("w-7 bg-ink", barHeights[s.level - 1])} />
              <span className={cn("w-7 border border-b-0 border-ink-2", barHeights[s.level - 1])} />
            </div>
            <div className="@xl:mt-3">
              <p className={nodeTitle}>{t(s.name[locale])}</p>
              <p className={cn(nodeNote, "mt-0.5")}>{t(s.when[locale])}</p>
            </div>
            <div aria-hidden className="grid gap-1 border-l border-line-strong @xl:hidden">
              <span className={cn("h-2.5 bg-ink", barWidths[s.level - 1])} />
              <span className={cn("h-2.5 border border-l-0 border-ink-2", barWidths[s.level - 1])} />
            </div>
          </li>
        ))}
      </ol>
    </Figure>
  );
}

/**
 * Scenario × condition. A ruled table from a 576px-wide figure; narrower, one
 * block per scenario with three "condition: assertion" lines. Never scrolls.
 */
export function ResilienceMatrixDiagram({ locale, number, className }: DiagramProps) {
  const d = matrixDiagram;
  const t = (s: string) => dtypo(locale, s);
  return (
    <Figure diagram="resilience-matrix" locale={locale} number={number} className={className}>
      <table className="hidden w-full border-collapse text-left @xl:table">
        <thead>
          <tr className="border-b border-line-strong">
            <th scope="col" className={cn(smallHeading, "w-[22%] pb-2 pr-4 align-bottom")}>
              {t(d.scenarioLabel[locale])}
            </th>
            {d.conditions.map((c) => (
              <th key={c.en} scope="col" className={cn(smallHeading, "pb-2 pr-4 align-bottom last:pr-0")}>
                {t(c[locale])}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {d.rows.map((row) => (
            <tr key={row.scenario.en} className="border-b border-line">
              <th scope="row" className="py-3 pr-4 align-top text-[0.9375rem] font-semibold leading-[1.375rem] text-ink">
                {t(row.scenario[locale])}
              </th>
              {row.cells.map((cell) => (
                <td key={cell.en} className="py-3 pr-4 align-top text-[0.9375rem] leading-[1.375rem] text-ink last:pr-0">
                  {t(cell[locale])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-6 @xl:hidden">
        {d.rows.map((row) => (
          <div key={row.scenario.en} className="border-t border-line pt-3">
            <p className="text-base font-semibold leading-6 text-ink">{t(row.scenario[locale])}</p>
            <ul className="mt-1.5 grid gap-1.5">
              {row.cells.map((cell, i) => (
                <li key={cell.en} className="text-[0.9375rem] leading-[1.375rem] text-ink">
                  <span className="font-medium text-ink-2">{t(d.conditions[i]![locale])}:</span> {t(cell[locale])}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={cn(nodeNote, "mt-5 max-w-[64ch]")}>{t(d.suiteNote[locale])}</p>
    </Figure>
  );
}

/**
 * The agent loop as an 820-unit SVG (scrolls in its own box when the column is
 * narrower). Below 768px an ordered reading of the same graph follows it.
 */
export function AgentLoopDiagram({ locale, number, className }: DiagramProps) {
  const d = agentDiagram;
  const t = (k: keyof typeof d) => dtypo(locale, d[k][locale]);
  const edge = "fill-none stroke-ink-2";
  const reading: string[][] = [
    [`${t("goal")} → ${t("planner")}`],
    [`${t("planner")} → ${t("agent")}`],
    [`${t("agent")} ⇄ ${t("tools")} (${t("call")})`],
    [`${t("result")} → ${t("evaluator")}`],
    [`${t("pass")} → ${t("done")}`, `${t("replan")} → ${t("planner")}`, `${t("approval")} → ${t("human")} → ${t("approved")} → ${t("agent")}`],
  ].map((lines) => lines.map((line) => dtypo(locale, line)));
  return (
    <Figure diagram="agent-loop" locale={locale} number={number} className={className}>
      <ScrollArea minWidth={820} label={typo(locale, figures["agent-loop"].title[locale])} locale={locale} className="max-w-[60rem]">
        <svg viewBox="0 0 820 430" role="img" aria-labelledby="agent-loop-title agent-loop-desc" className="h-auto w-full font-sans">
          <title id="agent-loop-title">{typo(locale, figures["agent-loop"].title[locale])}</title>
          <desc id="agent-loop-desc">{reading.map((r) => r.join("; ")).join("; ")}</desc>
          <defs>
            <Arrowhead id="ah-agent" />
            <Arrowhead id="ah-agent-pass" className="fill-pass" />
            <Arrowhead id="ah-agent-fail" className="fill-fail" />
          </defs>

          {/* Guardrails boundary around the agent and its tools */}
          <rect x={385} y={8} width={430} height={112} rx={2} strokeWidth={1} className="fill-none stroke-line-strong [stroke-dasharray:6_5]" />
          <text x={400} y={29} fontSize={13} className="fill-ink font-semibold">
            {t("guardrailsTitle")}
          </text>
          <text x={400} y={47} fontSize={12.5} className="fill-ink-2">
            {t("guardrails")}
          </text>

          {/* Main row */}
          <path d="M160,82 L198,82" strokeWidth={1.25} className={edge} markerEnd="url(#ah-agent)" />
          <path d="M340,82 L398,82" strokeWidth={1.25} className={edge} markerEnd="url(#ah-agent)" />
          <path d="M540,76 L638,76" strokeWidth={1.25} className={edge} markerEnd="url(#ah-agent)" />
          <path d="M640,90 L542,90" strokeWidth={1.25} className={edge} markerEnd="url(#ah-agent)" />
          <text x={590} y={114} textAnchor="middle" fontSize={12.5} className="fill-ink-2">
            {t("call")}
          </text>

          {/* State band shared by planner and agent */}
          <rect x={250} y={168} width={300} height={30} rx={2} strokeWidth={1} className="fill-paper stroke-line-strong [stroke-dasharray:4_3]" />
          <text x={400} y={183} dominantBaseline="central" textAnchor="middle" fontSize={12.5} className="fill-ink-2">
            {t("state")} · {t("stateNote")}
          </text>
          <path d="M300,168 L300,106" strokeWidth={1} className="fill-none stroke-line-strong [stroke-dasharray:3_3]" />
          <path d="M470,168 L470,106" strokeWidth={1} className="fill-none stroke-line-strong [stroke-dasharray:3_3]" />

          {/* Result → evaluator */}
          <path d="M720,104 L720,216" strokeWidth={1.25} className={edge} markerEnd="url(#ah-agent)" />
          <path d="M640,240 L542,240" strokeWidth={1.25} className={edge} markerEnd="url(#ah-agent)" />

          {/* Replan loop */}
          <path d="M400,240 L230,240 L230,108" strokeWidth={1.25} className="fill-none stroke-fail [stroke-dasharray:5_4]" markerEnd="url(#ah-agent-fail)" />
          <text x={222} y={200} textAnchor="end" fontSize={12.5} className="fill-fail font-medium">
            {t("replan")}
          </text>

          {/* Evaluator outcomes */}
          <path d="M470,262 L470,328" strokeWidth={1.25} className={edge} markerEnd="url(#ah-agent)" />
          <text x={460} y={300} textAnchor="end" fontSize={12.5} className="fill-ink-2">
            {t("approval")}
          </text>
          <path d="M532,262 L640,330" strokeWidth={1.25} className="fill-none stroke-pass" markerEnd="url(#ah-agent-pass)" />
          <text x={602} y={286} fontSize={12.5} className="fill-pass font-medium">
            {t("pass")}
          </text>
          <path d="M535,352 L638,352" strokeWidth={1.25} className={edge} markerEnd="url(#ah-agent)" />
          <text x={587} y={343} textAnchor="middle" fontSize={12.5} className="fill-ink-2">
            {t("approved")}
          </text>

          <SvgNode x={20} y={60} w={140} label={t("goal")} tone="quiet" />
          <SvgNode x={200} y={60} w={140} label={t("planner")} />
          <SvgNode x={400} y={60} w={140} label={t("agent")} />
          <SvgNode x={640} y={60} w={160} label={t("tools")} />
          <SvgNode x={640} y={218} w={160} label={t("result")} />
          <SvgNode x={400} y={218} w={140} label={t("evaluator")} tone="accent" />
          <SvgNode x={360} y={330} w={175} label={t("human")} />
          <SvgNode x={640} y={330} w={160} label={t("done")} tone="outcome" />

          {/* Observability spans everything */}
          <rect x={20} y={394} width={780} height={28} rx={2} strokeWidth={1} className="fill-raised stroke-line" />
          <text x={34} y={408} dominantBaseline="central" fontSize={12.5} className="fill-ink-2">
            {t("trace")}
          </text>
        </svg>
      </ScrollArea>
      <ol className="mt-6 grid gap-2.5 md:hidden">
        {reading.map((lines, i) => (
          <li key={i} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2 text-[0.9375rem] leading-[1.375rem] text-ink">
            <span aria-hidden className="nums font-serif text-base leading-[1.375rem] text-ink-2">
              {i + 1}
            </span>
            <span>
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
