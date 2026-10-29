import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { RegressionGateDiagram } from "@/components/diagrams/evaluation";
import { Schematic } from "@/components/diagrams/schematic";
import { QualityTiersDiagram } from "@/components/diagrams/systems";
import { FigCaption, GatedShot, Plate } from "@/components/figure";
import { ResultsSummary } from "@/components/project/results";
import { ActionLink, RunIn, StatusLine, shapeForStatus } from "@/components/ui";
import { agentDiagram, figures, matrixDiagram } from "@/content/diagrams";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { href, type Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";
import { Hairline } from "./hairline";
import { statusText } from "./status-text";

/** "01" … "05": Newsreader numerals in the accent, the only accent mark at rest in each block. */
function ProjectNumber({ project }: { project: Project }) {
  return (
    <p aria-hidden className="nums font-serif text-xl leading-6 text-accent">
      {project.index}
    </p>
  );
}

function CaseStudyLink({ project, locale, className }: { project: Project; locale: Locale; className?: string }) {
  return (
    <div className={className}>
      <ActionLink href={href(locale, `/projects/${project.slug}`)}>
        {ui.cta.readCaseStudy[locale]}
        <span className="sr-only"> — {project.title[locale]}</span>
      </ActionLink>
    </div>
  );
}

/** Status marker + sentence, then the short honest note (projects 02–05). */
function StatusAndNote({ project, locale, className }: { project: Project; locale: Locale; className?: string }) {
  return (
    <div className={className}>
      <StatusLine shape={shapeForStatus(project.statuses[0]!)} text={statusText(locale, project.statusLine[locale])} locale={locale} />
      {project.homeNote && <p className="mt-1 max-w-[46ch] text-sm leading-5 text-ink-2">{typo(locale, project.homeNote[locale])}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   2a. Learning OS: an asymmetric spread. Text in c1–c3 and the plate bleeding
   right from c4 at ≥1280px; a title row over a wide plate at 1024–1279px; a
   phone screenshot on a full-bleed plate below 768px.
--------------------------------------------------------------------------- */
function FeatureProject({ locale }: { locale: Locale }) {
  const project = projects[0]!;
  const feature = project.feature!;
  const desktop = project.screenshots![0]!;
  const mobile = project.screenshots![2]!;
  const title = (shot: typeof desktop) => shot.title && typo(locale, shot.title[locale]);
  const caption = (shot: typeof desktop) => typo(locale, shot.caption[locale]);

  return (
    <article aria-labelledby="feature-title">
      <Hairline />
      <div className="page-grid pt-6 md:pt-8 xl:grid-rows-[auto_auto_1fr_auto]">
        <div className="lg:col-[2/span_6] xl:col-[2/span_3] xl:row-start-1">
          <ProjectNumber project={project} />
          {/* In the c1–c3 spread the title follows the column width (≈5.3em for
              "Learning OS"), so it stays on one line from 1280px, and it may
              overflow into the gutter rather than ever split inside a word. */}
          <h2
            id="feature-title"
            className="t-h2 mt-1 [overflow-wrap:normal] xl:text-[length:min(1.6667rem_+_2.037vw,4.2vw_-_4px,3.5rem)]"
          >
            {typo(locale, project.title[locale])}
          </h2>
        </div>

        <div className="lg:col-[8/span_6] lg:self-end xl:col-[2/span_3] xl:row-start-2 xl:self-start">
          <p className="t-desc mt-4 max-w-[40ch] text-ink lg:mt-0 xl:mt-4">{typo(locale, feature.summary[locale])}</p>
          <StatusLine
            shape={shapeForStatus(project.statuses[0]!)}
            text={statusText(locale, project.statusLine[locale])}
            locale={locale}
            className="mt-3"
          />
          <CaseStudyLink project={project} locale={locale} className="mt-4" />
        </div>

        {/* ≥768px: the overview screen at a 20:9 crop. The figure dissolves into the
            page grid so its plate and caption can sit in different columns. */}
        <figure className="max-md:hidden md:contents">
          <Plate className="md:col-[2/full-end] md:mt-6 md:grid md:grid-cols-subgrid md:py-6 md:pl-6 lg:py-8 lg:pl-8 xl:col-[5/full-end] xl:row-[1/span_3] xl:mt-0 xl:py-10 xl:pl-10">
            <div className="col-[1/-2]">
              <GatedShot
                src={desktop.src}
                width={desktop.width}
                height={desktop.height}
                alt={desktop.alt[locale]}
                only="md-up"
                priority
                className="aspect-[20/9] object-cover object-left-top"
              />
            </div>
          </Plate>
          <FigCaption
            locale={locale}
            number={1}
            title={title(desktop)}
            className="md:col-[content] lg:col-[2/span_3] lg:mt-10 xl:row-start-3 xl:mb-10 xl:mt-6 xl:self-end"
          >
            {caption(desktop)}
          </FigCaption>
        </figure>

        {/* Below 768px: the phone screen, cropped flush with the plate bottom.
            The 39:70 window starts just under the app's top bar (52% of the
            overflow, ≈y 228 of 1141) and runs from the "Sources" heading through
            the import form to the imported source marked "Needs review", which
            is what the caption describes. */}
        <figure className="col-[full-start/full-end] mt-6 md:hidden">
          <Plate className="pl-[var(--pad)] pt-6">
            <div className="w-[calc((100%+var(--pad))*0.78)] max-w-[21rem] [@media(orientation:landscape)]:max-w-[44svh]">
              <GatedShot
                src={mobile.src}
                width={mobile.width}
                height={mobile.height}
                alt={mobile.alt[locale]}
                only="below-md"
                priority
                className="aspect-[39/70] object-cover object-[50%_52%]"
              />
            </div>
          </Plate>
          <FigCaption locale={locale} number={1} title={title(mobile)} className="mx-[var(--pad)]">
            {caption(mobile)}
          </FigCaption>
        </figure>

        <div className="t-body mt-8 max-w-[64ch] text-ink md:col-[2/span_5] lg:col-[5/span_5] lg:mt-10 xl:row-start-4">
          <p>
            <RunIn>{ui.home.problem[locale]}</RunIn>
            {typo(locale, feature.problem[locale])}
          </p>
          <p className="mt-4">
            <RunIn>{ui.home.myPart[locale]}</RunIn>
            {typo(locale, project.contribution[locale])}
          </p>
        </div>

        <ResultsSummary locale={locale} className="mt-10 md:col-[7/span_3] md:mt-8 lg:col-[10/span_4] lg:mt-10 xl:col-[11/span_3] xl:row-start-4" />
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------------
   2b / 2c. One project per row with its drawing. 03 mirrors 02 on desktop;
   the DOM order is always text first, then the figure.
   All five project titles are H2s, siblings in the outline, whatever their
   visual size.
--------------------------------------------------------------------------- */
function RowText({ project, locale, className }: { project: Project; locale: Locale; className?: string }) {
  return (
    <div className={className}>
      <ProjectNumber project={project} />
      <h2 id={`${project.slug}-title`} className="t-h3 mt-2">
        {typo(locale, project.title[locale])}
      </h2>
      <p className="t-lead-sm mt-3 max-w-[30em] text-ink">{typo(locale, project.question[locale])}</p>
      <p className="mt-4 max-w-[46ch] text-base leading-[1.625] text-ink">
        <RunIn>{ui.home.myPart[locale]}</RunIn>
        {typo(locale, project.contribution[locale])}
      </p>
      <StatusAndNote project={project} locale={locale} className="mt-5" />
      <CaseStudyLink project={project} locale={locale} className="mt-4" />
    </div>
  );
}

function ProjectRow({ locale, index, mirrored }: { locale: Locale; index: number; mirrored?: boolean }) {
  const project = projects[index]!;
  return (
    <article aria-labelledby={`${project.slug}-title`} className={mirrored ? "mt-16 md:mt-24 lg:mt-30" : "mt-22 md:mt-28 lg:mt-36"}>
      <Hairline />
      <div className="page-grid pt-6 md:pt-8">
        <RowText
          project={project}
          locale={locale}
          className={cn(
            "md:col-[2/span_6] lg:row-start-1",
            mirrored ? "lg:col-[10/span_4] xl:col-[9/span_5] xl:pl-6" : "lg:col-[2/span_4]",
          )}
        />
        {/* Side by side from 1024px. The 600-unit topology keeps its 14px labels at
            14px or more only from 600px, so at 1024–1279px each drawing takes eight
            columns (c5–c12, mirrored c1–c8; ≈620px at 1024) next to four of text.
            From 1280px it takes seven and a column of air opens between them; the
            mirrored text then runs c8–c12 behind a 24px inset, so the long Polish
            title sets in two lines. Below 1024px the figure sits under the text. */}
        <div
          className={cn(
            "mt-8 min-w-0 md:mt-12 md:max-w-[48rem] lg:row-start-1 lg:mt-0 lg:max-w-none",
            mirrored ? "lg:col-[2/span_8] xl:col-[2/span_7]" : "lg:col-[6/span_8] xl:col-[7/span_7]",
          )}
        >
          {mirrored ? (
            <QualityTiersDiagram locale={locale} number={3} compact />
          ) : (
            <RegressionGateDiagram locale={locale} number={2} compact />
          )}
        </div>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------------------
   2d. 04 and 05 as a compact pair; their drawings are typographic schematics.
--------------------------------------------------------------------------- */

/** The Schematic's own arrow, for use inside a step or a line of text. */
function FlowArrow() {
  return <ArrowRight aria-hidden className="inline-block size-3.5 shrink-0 self-center align-[-0.15em] text-ink-2" strokeWidth={1.75} />;
}

/**
 * "A → B" drawn with the Schematic's arrow, tied to the word on each side so it
 * never ends or starts a line: "irreversible / uncertain → Human approval".
 */
function ArrowJoin({ locale, text }: { locale: Locale; text: string }) {
  const [from = "", ...rest] = text.split(" → ");
  const to = rest.join(" → ");
  if (!to) return typo(locale, text);
  const a = typo(locale, from);
  const b = typo(locale, to);
  const i = a.lastIndexOf(" ");
  const j = b.indexOf(" ");
  return (
    <>
      {a.slice(0, i + 1)}
      <span className="whitespace-nowrap">
        {a.slice(i + 1)} <FlowArrow />
        <span className="sr-only">→</span> {j < 0 ? b : b.slice(0, j)}
      </span>
      {j < 0 ? "" : b.slice(j)}
    </>
  );
}

function PairItem({ project, locale, figure, className }: { project: Project; locale: Locale; figure: ReactNode; className?: string }) {
  return (
    <article aria-labelledby={`${project.slug}-title`} className={cn("flex flex-col", className)}>
      <ProjectNumber project={project} />
      <h2 id={`${project.slug}-title`} className="t-h3 mt-2">
        {typo(locale, project.title[locale])}
      </h2>
      <p className="t-lead-sm mt-3 max-w-[30em] text-ink">{typo(locale, project.question[locale])}</p>
      {figure}
      {/* mt-auto: status and link share one line across the two columns, whatever the text above. */}
      <StatusAndNote project={project} locale={locale} className="mt-auto pt-6" />
      <CaseStudyLink project={project} locale={locale} className="mt-4" />
    </article>
  );
}

function ProjectPair({ locale }: { locale: Locale }) {
  const resilience = projects[3]!;
  const agentic = projects[4]!;
  const a = agentDiagram;
  const matrixFig = figures["resilience-matrix"];
  const agentFig = figures["agent-loop"];

  /* 04 and 05 carry one-line typographic schematics, not drawings, so they are
     not numbered figures: the caption keeps only the title and the "as designed"
     prefix. Their case studies draw the full matrix and loop. */
  const matrixFigure = (
    <figure className="mt-6">
      <p className="text-[0.9375rem] leading-6 text-ink-2">{typo(locale, ui.home.sameSuiteUnder[locale])}</p>
      <ul className="text-[0.9375rem] font-medium leading-6 text-ink lg:flex lg:flex-wrap lg:gap-x-2">
        {matrixDiagram.conditions.map((c, i, all) => (
          <li key={c.en} className="lg:whitespace-nowrap">
            {typo(locale, c[locale])}
            {/* The separator closes its item, so a wrapped row never starts with "·". */}
            {i < all.length - 1 && (
              <span aria-hidden className="ml-2 text-ink-2 max-lg:hidden">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>
      <FigCaption locale={locale} title={typo(locale, matrixFig.title[locale])} kind={matrixFig.kind} className="mt-3" />
    </figure>
  );

  // The last two steps travel together, so "Completion" never sits alone on a
  // line. The evaluator keeps the Schematic's gate node style.
  const lastSteps = (
    <span className="inline-flex items-baseline gap-x-2 whitespace-nowrap">
      <span className="rounded-[2px] border border-ink-2 bg-raised px-1.5 font-semibold">{typo(locale, a.evaluator[locale])}</span>
      <span className="sr-only">, </span>
      <FlowArrow />
      <span>{typo(locale, a.done[locale])}</span>
    </span>
  );

  const agentFigure = (
    <figure className="mt-6">
      <Schematic
        steps={[
          { label: typo(locale, a.goal[locale]) },
          { label: typo(locale, a.planner[locale]) },
          { label: typo(locale, `${a.agent[locale]} ⇄ ${a.tools[locale]}`) },
          { label: lastSteps },
        ]}
        branch={
          <>
            <ArrowJoin locale={locale} text={a.replan[locale]} />
            {"\u00a0· "}
            <ArrowJoin locale={locale} text={`${a.approval[locale]} → ${a.human[locale]}`} />
          </>
        }
      />
      <FigCaption locale={locale} title={typo(locale, agentFig.title[locale])} kind={agentFig.kind} className="mt-3" />
    </figure>
  );

  return (
    <div className="mt-16 md:mt-24 lg:mt-30">
      <Hairline />
      <div className="page-grid pt-6 md:pt-8">
        <PairItem project={resilience} locale={locale} figure={matrixFigure} className="md:col-[2/span_4] lg:col-[2/span_6] lg:pr-6" />
        <PairItem
          project={agentic}
          locale={locale}
          figure={agentFigure}
          className="max-md:mt-16 md:col-[6/span_4] md:row-start-1 lg:col-[8/span_6] lg:pr-6"
        />
        <div className="mt-12 md:col-[content]">
          <ActionLink href={href(locale, "/projects")}>{ui.home.allProjectsAndLab[locale]}</ActionLink>
        </div>
      </div>
    </div>
  );
}

/** S2: the projects, Learning OS first and largest. */
export function WorkSection({ locale }: { locale: Locale }) {
  return (
    <section id="work">
      <FeatureProject locale={locale} />
      <ProjectRow locale={locale} index={1} />
      <ProjectRow locale={locale} index={2} mirrored />
      <ProjectPair locale={locale} />
    </section>
  );
}
