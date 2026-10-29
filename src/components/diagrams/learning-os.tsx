import { ArrowRight, RotateCcw } from "lucide-react";
import { architectureDiagram, domainModel, ladderDiagram, loopDiagram } from "@/content/diagrams";
import { cn } from "@/lib/cn";
import { typo } from "@/lib/typo";
import { DomainExplorer } from "./domain-explorer";
import { Box, type DiagramProps, DownArrow, dtypo, Figure, Idents, monoIdent, nodeNote, pad2, Rail, type RailStep, smallHeading } from "./primitives";

/** Lets long identifiers break after a dot or a slash instead of overflowing a node. */
const breakable = (s: string) => s.replace(/([./])(?=[A-Za-z])/g, "$1​");

export function LearningLoopDiagram({ locale, number, className }: DiagramProps) {
  const { steps, transaction, loop } = loopDiagram;
  const t = (s: string) => dtypo(locale, s);
  const [txCode, ...txRest] = transaction[locale].split(" — ");
  return (
    <Figure diagram="lo-loop" locale={locale} number={number} className={className}>
      {/* Five across from an 832px-wide figure; a numbered rail below that, running on into the bracket. */}
      <Rail
        numbered
        split
        tail
        className="max-w-[44rem] @min-[52rem]:hidden"
        steps={steps.map((step, i) => ({
          key: step.fn,
          entries: [{ title: t(step.name[locale]), mono: breakable(step.fn), note: t(step.note[locale]), accent: i === 3 }],
        }))}
      />
      <ol className="hidden @min-[52rem]:grid @min-[52rem]:grid-cols-5 @min-[52rem]:gap-x-6">
        {steps.map((step, i) => (
          <li key={step.fn} className="relative flex flex-col">
            <Box
              index={pad2(i + 1)}
              title={t(step.name[locale])}
              mono={breakable(step.fn)}
              note={t(step.note[locale])}
              tone={i === 3 ? "accent" : "default"}
              className="h-full"
            />
            {i < steps.length - 1 && (
              <ArrowRight aria-hidden strokeWidth={1.5} className="absolute -right-5 top-1/2 hidden size-4 -translate-y-1/2 text-ink-2 @min-[52rem]:block" />
            )}
          </li>
        ))}
      </ol>
      {/* A bracket under the whole loop: everything above commits in one transaction. On the rail it starts on the rule. */}
      <div className="ml-9 max-w-[41.75rem] @min-[52rem]:ml-0 @min-[52rem]:mt-3 @min-[52rem]:max-w-none">
        <div aria-hidden className="h-2 border-x border-b border-ink-2" />
        <p className={cn(nodeNote, "mt-2 max-w-[64ch]")}>
          <span className={monoIdent}>{txCode}</span>
          {txRest.length > 0 && <>{typo(locale, ` — ${txRest.join(" — ")}`)}</>}
        </p>
      </div>
      <p className={cn(nodeNote, "mt-3 flex items-baseline gap-2")}>
        <RotateCcw aria-hidden className="relative top-[3px] size-3.5 shrink-0" strokeWidth={1.75} />
        <span>
          <Idents text={t(loop[locale])} />
        </span>
      </p>
    </Figure>
  );
}

// Rising steps from a 960px-wide figure.
const ladderHeights = [
  "@min-[60rem]:min-h-[6rem]",
  "@min-[60rem]:min-h-[7.5rem]",
  "@min-[60rem]:min-h-[9rem]",
  "@min-[60rem]:min-h-[10.5rem]",
  "@min-[60rem]:min-h-[12rem]",
  "@min-[60rem]:min-h-[13.5rem]",
];

export function MasteryLadderDiagram({ locale, number, className }: DiagramProps) {
  const { states, gate, dimensions } = ladderDiagram;
  const t = (s: string) => dtypo(locale, s);
  const [dimLabel = "", ...dimRest] = dimensions[locale].split(": ");
  const step = (s: (typeof states)[number], i: number) => (
    <li key={s.id} className={cn("flex flex-col justify-end", ladderHeights[i])}>
      <div className="flex flex-1 flex-col rounded-[2px] border border-line-strong bg-raised px-3.5 py-3 @min-[60rem]:justify-between @min-[60rem]:gap-3 @min-[60rem]:px-3">
        {/* Rising steps: the index sits at the top of each step. Stacked: inline with the state. */}
        <p aria-hidden className="nums hidden font-serif text-sm leading-5 text-ink-2 @min-[60rem]:block">
          {pad2(i + 1)}
        </p>
        <div>
          <p className={cn(monoIdent, "font-medium")}>
            <span aria-hidden className="nums mr-2 font-serif text-sm font-normal text-ink-2 @min-[60rem]:hidden">
              {pad2(i + 1)}
            </span>
            {s.id}
          </p>
          <p className={cn(nodeNote, "mt-1 [overflow-wrap:break-word]")}>{t(s.rule[locale])}</p>
        </div>
      </div>
    </li>
  );
  // Narrower than 448px: a numbered rail that runs on into the trust gate and through it.
  const railStep = (s: (typeof states)[number]): RailStep => ({
    key: s.id,
    entries: [{ title: <span className="font-mono text-[0.8125rem]">{s.id}</span>, note: t(s.rule[locale]) }],
  });
  // Inside the gate box (1.5px border + 8px padding) the number column is narrower, so the rule stays on one line.
  const gateIndexColumn = "grid-cols-[calc(2.25rem_-_9.5px)_minmax(0,1fr)]";
  return (
    <Figure diagram="lo-ladder" locale={locale} number={number} className={className}>
      <div className="@md:hidden">
        <Rail numbered tail steps={states.slice(0, 4).map(railStep)} />
        <div className="rounded-[2px] border-[1.5px] border-accent bg-accent-wash pb-3 pl-2 pr-3.5">
          <div className={cn("grid", gateIndexColumn)}>
            <p className="col-start-2 border-l border-line-strong pb-3 pl-4 pt-2.5 text-sm font-semibold leading-5 text-ink">{t(gate[locale])}</p>
          </div>
          <Rail numbered start={5} indexColumn={gateIndexColumn} steps={states.slice(4).map(railStep)} />
        </div>
      </div>
      <div className="hidden gap-3 @md:grid @min-[60rem]:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] @min-[60rem]:items-end">
        <ol className="grid gap-2 @md:grid-cols-2 @min-[60rem]:grid-cols-4 @min-[60rem]:items-end @min-[60rem]:pb-[11.5px]">
          {states.slice(0, 4).map((s, i) => step(s, i))}
        </ol>
        {/* The trust gate is the one emphasised element of this drawing. */}
        <div className="rounded-[2px] border-[1.5px] border-accent bg-accent-wash p-2.5">
          <p className="px-1 pb-2.5 text-sm font-semibold leading-5 text-ink">{t(gate[locale])}</p>
          <ol start={5} className="grid gap-2 @md:grid-cols-2 @min-[60rem]:items-end">
            {states.slice(4).map((s, i) => step(s, i + 4))}
          </ol>
        </div>
      </div>
      <p className={cn(nodeNote, "mt-4")}>
        {dimRest.length > 0 ? (
          <>
            <span className="font-semibold text-ink">{t(dimLabel)}.</span> {t(dimRest.join(": "))}
          </>
        ) : (
          t(dimensions[locale])
        )}
      </p>
    </Figure>
  );
}

export function LearningArchitectureDiagram({ locale, number, className }: DiagramProps) {
  const d = architectureDiagram;
  const t = (s: string) => dtypo(locale, s);
  const path = (name: string) => <span className="font-mono text-[0.8125rem]">{breakable(name)}</span>;
  return (
    <Figure diagram="lo-architecture" locale={locale} number={number} className={className}>
      <div className="grid gap-8 @3xl:grid-cols-[2fr_1fr] @3xl:gap-6">
        {/* Narrower than 512px: the layers along a rail with an arrowhead per dependency; the two middle packages share a stretch. */}
        <Rail
          className="@lg:hidden"
          steps={[
            ...d.layers.map((layer) => ({ key: layer.id, entries: [{ title: path(layer.name), note: t(layer.note[locale]) }] })),
            { key: "middle", entries: d.middle.map((m) => ({ title: path(m.name), note: t(m.note[locale]), accent: m.id === "engine" })) },
            { key: d.domain.id, entries: [{ title: path(d.domain.name), note: t(d.domain.note[locale]) }] },
          ]}
        />
        <div className="hidden @lg:block">
          {d.layers.map((layer) => (
            <div key={layer.id}>
              <Box title={path(layer.name)} note={t(layer.note[locale])} />
              <DownArrow />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2 @md:gap-3">
            {d.middle.map((m) => (
              <div key={m.id} className="flex flex-col">
                <Box title={path(m.name)} note={t(m.note[locale])} tone={m.id === "engine" ? "accent" : "default"} className="h-full" />
                <DownArrow />
              </div>
            ))}
          </div>
          <Box title={path(d.domain.name)} note={t(d.domain.note[locale])} />
        </div>
        <div className="@3xl:border-l @3xl:border-line @3xl:pl-6">
          <p className={cn(smallHeading, "mb-3")}>{t(d.sideLabel[locale])}</p>
          {/* Below 576px a plain list; from there, quiet boxes beside or under the stack. */}
          <div className="grid gap-4 @xl:grid-cols-3 @xl:gap-3 @3xl:grid-cols-1">
            {d.side.map((s) => (
              <Box key={s.id} title={path(s.name)} note={t(s.note[locale])} tone="quiet" className="@max-xl:border-0 @max-xl:p-0" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className={smallHeading}>{t(d.nextLabel[locale])}</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 @lg:grid-cols-3 @3xl:grid-cols-5">
          {d.adapters.map((a) => (
            <li key={a} className={cn(monoIdent, "rounded-[2px] border border-dashed border-ink-2 px-3 py-2.5")}>
              {a.replace(/(?<=[a-z])(?=Adapter$)/, "​")}
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}

export function LearningDomainDiagram({ locale, number, className }: DiagramProps) {
  const t = (s: string) => dtypo(locale, s);
  const groups = domainModel.groups.map((g) => ({
    id: g.id,
    title: t(g.title[locale]),
    entities: g.entities.map((id) => {
      const e = domainModel.entities.find((x) => x.id === id)!;
      return { id: e.id, name: t(e.name[locale]), def: t(e.def[locale]), fields: e.fields };
    }),
  }));
  return (
    <Figure diagram="lo-domain" locale={locale} number={number} className={className}>
      <DomainExplorer
        groups={groups}
        links={domainModel.links.map((l) => (
          <li key={l.en}>
            <Idents text={t(l[locale])} />
          </li>
        ))}
        labels={{ selected: t(domainModel.selectHint[locale]), fields: t(domainModel.fieldsLabel[locale]) }}
        initial="atom"
      />
    </Figure>
  );
}
