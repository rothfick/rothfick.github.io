import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Diagram } from "@/components/diagrams";
import { FigCaption, GatedShot, Plate } from "@/components/figure";
import { CodeBlock } from "@/components/project/code-block";
import { ChapterBar, ContentsRail, type ContentsEntry } from "@/components/project/contents";
import {
  CaseSection,
  Constraints,
  DecisionLedger,
  FailureTable,
  FullSizeLink,
  ImplementationList,
  Lessons,
  NextIteration,
  NowNext,
  Part,
  Prose,
  ShotDetail,
  TermList,
  type ShotRegion,
} from "@/components/project/parts";
import { ResultsTable } from "@/components/project/results";
import { contactLinks } from "@/components/site/contact-links";
import { ActionLink, RunIn, StatusMarker, shapeForStatus } from "@/components/ui";
import { getAdjacentProjects, getProject, projects } from "@/content/projects";
import type { DiagramKey, Project, Screenshot, SnippetKey } from "@/content/types";
import { ui } from "@/content/ui";
import { href, isLocale, locales, type Locale, type Localized } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page";
import { cn } from "@/lib/cn";
import { typo } from "@/lib/typo";

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

async function resolve(params: Params["params"]) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) notFound();
  return { locale, project };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, project } = await resolve(params);
  return pageMetadata({ locale, path: `/projects/${project.slug}`, title: project.title[locale], description: project.subtitle[locale] });
}

/** Contents for the rail and the chapter bar: overview, then five parts with their sections. */
function contentsFor(project: Project, locale: Locale): ContentsEntry[] {
  const s = ui.project.sections;
  const parts = ui.project.parts;
  return [
    { id: "overview", label: ui.project.overview[locale] },
    { id: "problem", numeral: "I", label: parts.problem[locale], sections: [{ id: "constraints", label: s.constraints[locale] }] },
    {
      id: "decisions",
      numeral: "II",
      label: parts.decisions[locale],
      sections: [
        { id: "architecture", label: s.architecture[locale] },
        { id: "decision-record", label: ui.project.decisionRecord[locale] },
      ],
    },
    {
      id: "implementation",
      numeral: "III",
      label: parts.implementation[locale],
      sections: project.deepDives.map((d) => ({ id: d.id, label: typo(locale, d.title[locale]) })),
    },
    {
      id: "results",
      numeral: "IV",
      label: parts.results[locale],
      sections: [
        { id: "verification", label: s.verification[locale] },
        { id: "status", label: s.status[locale] },
      ],
    },
    {
      id: "limitations",
      numeral: "V",
      label: parts.limitations[locale],
      sections: [
        { id: "failure-modes", label: s.failureModes[locale] },
        { id: "lessons", label: s.lessons[locale] },
        { id: "next-iteration", label: s.nextIteration[locale] },
      ],
    },
  ];
}

/** Facts beside the title: status, my part, year, stack, repository. */
function Facts({ project, locale, className }: { project: Project; locale: Locale; className?: string }) {
  const m = ui.project.meta;
  const rows: { term: string; value: React.ReactNode }[] = [
    {
      term: m.status[locale],
      value: (
        <span className="flex items-start gap-2">
          <StatusMarker shape={shapeForStatus(project.statuses[0]!)} className="mt-[7px]" />
          <span>{typo(locale, project.statusLine[locale])}</span>
        </span>
      ),
    },
    { term: ui.project.myPart[locale], value: typo(locale, project.contribution[locale]) },
  ];
  if (project.year) rows.push({ term: m.year[locale], value: <span className="nums">{project.year}</span> });
  rows.push({ term: m.stack[locale], value: project.stack[locale].join(", ") });
  if (project.repository)
    rows.push({
      term: ui.cta.repository[locale],
      value: (
        <a href={project.repository} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-accent/55 underline-offset-[0.2em] [overflow-wrap:anywhere] hover:text-accent hover:decoration-accent hover:decoration-2">
          {project.repository.replace(/^https?:\/\//, "")}
        </a>
      ),
    });
  return (
    <dl className={className}>
      {rows.map((row) => (
        <div key={row.term} className="min-w-0">
          <dt className="text-sm font-medium leading-5 text-ink-2">{row.term}</dt>
          <dd className="mt-1 text-[0.9375rem] leading-6 text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Below 768px a 1280px desktop capture would shrink the product's text to
 * 3–4px, so phones get a 1:1 detail of the same PNG instead (the panel the
 * caption is about), with "Open full size" for the whole screen.
 * Coordinates are in image pixels; the alt text describes the detail.
 */
const phoneDetail: Record<string, ShotRegion & { alt: Localized }> = {
  "/projects/learning-os/overview-desktop.png": {
    x: 264,
    y: 234,
    height: 256,
    alt: {
      en: "Learning OS daily mission panel: one Knowledge Atom, “Idempotent processing”, with the reasons it was chosen and a 15-minute estimate.",
      pl: "Panel misji dnia w Learning OS: jeden atom wiedzy („Idempotent processing”) z powodami wyboru i szacowanym czasem 15 minut.",
    },
  },
  "/projects/learning-os/first-learner-desktop.png": {
    x: 264,
    y: 202,
    height: 320,
    alt: {
      en: "Learning OS first-run panel: a field for the first learner’s name and a “Create learner” button.",
      pl: "Panel pierwszego uruchomienia Learning OS: pole na imię pierwszego uczącego się i przycisk „Create learner”.",
    },
  },
};

/** Caption for a screenshot: bold title, caption, and the full-size link below 768px. */
function ShotCaption({ shot, locale, number, className }: { shot: Screenshot; locale: Locale; number: number; className?: string }) {
  return (
    <FigCaption locale={locale} number={number} title={shot.title && typo(locale, shot.title[locale])} className={className}>
      {typo(locale, shot.caption[locale])}
      <FullSizeLink src={shot.src} locale={locale} className="mt-1" />
    </FigCaption>
  );
}

/**
 * A screenshot for the plate: the whole capture, or, below 768px, its 1:1
 * detail when it has one. Both are the same PNG, so it downloads once.
 */
function Shot({ shot, locale, priority, className }: { shot: Screenshot; locale: Locale; priority?: boolean; className?: string }) {
  const region = phoneDetail[shot.src];
  const full = (
    <GatedShot
      src={shot.src}
      width={shot.width}
      height={shot.height}
      alt={shot.alt[locale]}
      only={region ? "md-up" : undefined}
      priority={priority}
      className={className}
    />
  );
  if (!region) return full;
  return (
    <>
      <ShotDetail src={shot.src} width={shot.width} height={shot.height} alt={region.alt[locale]} region={region} priority={priority} className="md:hidden" />
      {full}
    </>
  );
}

/** A Learning OS screenshot on a stone plate, numbered, with a full-size link below 768px. */
function ShotFigure({
  shot,
  locale,
  number,
  plateClassName,
  frameClassName,
}: {
  shot: Screenshot;
  locale: Locale;
  number: number;
  plateClassName?: string;
  frameClassName?: string;
}) {
  return (
    <figure className="min-w-0">
      <Plate className={plateClassName}>
        <div className={frameClassName}>
          <Shot shot={shot} locale={locale} />
        </div>
      </Plate>
      <ShotCaption shot={shot} locale={locale} number={number} />
    </figure>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { locale, project } = await resolve(params);
  const s = ui.project.sections;
  const parts = ui.project.parts;
  const summaries = ui.project.partSummaries;
  const { previous, next } = getAdjacentProjects(project.slug);
  const contents = contentsFor(project, locale);

  // Learning OS opens on its real interface; every other project on its first drawing,
  // which is then not repeated in Part II.
  const [heroShot, ...overviewShots] = project.screenshots ?? [];
  const heroDiagram = heroShot ? undefined : project.architecture.diagrams[0];
  const architectureDiagrams = heroDiagram ? project.architecture.diagrams.slice(1) : project.architecture.diagrams;
  const desktopShots = overviewShots.filter((shot) => shot.width > shot.height);
  const phoneShots = overviewShots.filter((shot) => shot.width <= shot.height);

  // Figures and listings are numbered in reading order; JSX below is built top to bottom.
  let figures = 0;
  let listings = 0;
  const figure = () => ++figures;
  // Diagram keeps 32px above and below on phones, 48px from 1024px.
  const diagram = (id: DiagramKey) => <Diagram key={id} id={id} locale={locale} number={figure()} />;
  const listing = (id: SnippetKey) => (
    <div key={id} className="my-8 lg:my-12">
      <CodeBlock id={id} locale={locale} number={++listings} />
    </div>
  );

  const showRun = project.verification.showLearningOsRun;
  const nextHref = next ? href(locale, `/projects/${next.slug}`) : href(locale, "/projects");
  // "Get in touch" only once there is a channel to get in touch through.
  const canContact = contactLinks(locale).length > 0;

  return (
    <article>
      {/* Opening: breadcrumb, title and facts. */}
      <header className="page-grid pt-4 md:pt-10 lg:grid-rows-[auto_auto_1fr]">
        <nav aria-label={ui.nav.breadcrumb[locale]}>
          <ol className="flex flex-wrap items-center gap-x-2 text-sm font-medium leading-5 text-ink-2">
            <li>
              <Link
                href={href(locale, "/projects")}
                className="inline-flex min-h-11 items-center text-ink underline decoration-accent/55 decoration-1 underline-offset-[0.2em] motion-safe:transition-colors motion-safe:duration-150 hover:text-accent hover:decoration-accent hover:decoration-2"
              >
                {ui.nav.projects[locale]}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page">
              <span aria-hidden className="nums">
                {project.index}
              </span>
              <span className="sr-only">{project.title[locale]}</span>
            </li>
          </ol>
        </nav>
        <div className="mt-4 md:mt-6 lg:col-[2/span_8] lg:row-start-2">
          <h1 className="t-h1">{typo(locale, project.title[locale])}</h1>
          <p className="t-statement mt-5 max-w-[26em] text-ink">{typo(locale, project.subtitle[locale])}</p>
        </div>
        <Facts
          project={project}
          locale={locale}
          className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-[var(--gap)] sm:gap-y-4 lg:col-[11/span_3] lg:row-span-2 lg:row-start-2 lg:mt-6 lg:grid-cols-1 lg:gap-y-3 lg:self-start"
        />
        <p className="measure mt-8 text-[0.9375rem] leading-6 text-ink lg:col-[2/span_8] lg:row-start-3">
          <RunIn>{ui.project.aboutEvidence[locale]}</RunIn>
          {typo(locale, project.evidenceNote[locale])}
        </p>
      </header>

      {/* Hero figure. */}
      {heroShot ? (
        <figure className="page-grid mt-10 md:mt-16">
          <Plate className="col-[full-start/full-end] pl-[var(--pad)] pt-6 md:col-[2/full-end] md:p-6 md:pr-[var(--pad)] lg:p-10 lg:pr-[var(--pad)]">
            <Shot shot={heroShot} locale={locale} priority className="md:aspect-[20/9] md:max-w-[1280px] md:object-cover md:object-[0_0]" />
          </Plate>
          <ShotCaption shot={heroShot} locale={locale} number={figure()} className="lg:col-[2/span_6]" />
        </figure>
      ) : (
        heroDiagram && (
          <div className="page-grid mt-10 md:mt-16">
            <Diagram id={heroDiagram} locale={locale} number={figure()} className="" />
          </div>
        )
      )}

      <ChapterBar
        entries={contents}
        labels={{ contents: ui.project.onThisPage[locale], open: ui.project.openContents[locale], close: ui.nav.close[locale] }}
      />

      {/* Reading layout: rail c1–c3, content c4–c12 (text to c10 from 1280px). */}
      <div className="page-grid mt-12 md:mt-16 lg:mt-24">
        <aside className="max-lg:hidden lg:col-[2/span_3] lg:row-start-1">
          <ContentsRail entries={contents} label={ui.project.onThisPage[locale]} />
        </aside>

        <div className="min-w-0 lg:col-[5/span_9] lg:row-start-1">
          {/* With a phone screenshot, from 768px it stands in its own column (c10–c12)
              beside the heading, prose and desktop screenshot, so neither column
              leaves a hole under a short figure. */}
          <section
            id="overview"
            aria-labelledby="overview-title"
            className={cn(
              phoneShots.length > 0 &&
                "md:grid md:grid-cols-[minmax(0,1fr)_calc((100%-7*var(--gap))*3/8+2*var(--gap))] md:items-start md:gap-x-[var(--gap)] lg:grid-cols-[minmax(0,1fr)_calc((100%-8*var(--gap))*3/9+2*var(--gap))]",
            )}
          >
            <div className="min-w-0">
              <h2 id="overview-title" tabIndex={-1} className="t-h3">
                {ui.project.overview[locale]}
              </h2>
              <Prose paragraphs={project.overview[locale]} locale={locale} />
              {desktopShots.length > 0 && (
                <div className="mt-10 grid gap-y-10 md:mt-12">
                  {desktopShots.map((shot) => (
                    <ShotFigure
                      key={shot.src}
                      shot={shot}
                      locale={locale}
                      number={figure()}
                      plateClassName={
                        phoneDetail[shot.src]
                          ? "-mx-[var(--pad)] pl-[var(--pad)] pt-6 md:mx-0 md:p-6"
                          : "p-4 max-sm:-mx-[var(--pad)] max-sm:px-[var(--pad)] md:p-6"
                      }
                    />
                  ))}
                </div>
              )}
            </div>
            {phoneShots.length > 0 && (
              <div className="mt-10 grid min-w-0 gap-y-10 md:mt-0">
                {phoneShots.map((shot) => (
                  <ShotFigure
                    key={shot.src}
                    shot={shot}
                    locale={locale}
                    number={figure()}
                    plateClassName="p-6 max-sm:-mx-[var(--pad)] md:p-5"
                    frameClassName="mx-auto max-w-[17.5rem] md:max-w-none"
                  />
                ))}
              </div>
            )}
          </section>

          <Part id="problem" numeral="I" title={parts.problem[locale]} summary={typo(locale, summaries.problem[locale])} first>
            <p className="t-statement mt-10 max-w-[22em] text-ink [text-wrap:balance] md:mt-12">{typo(locale, project.question[locale])}</p>
            <Prose paragraphs={project.problem[locale]} locale={locale} className="mt-8" />
            <CaseSection id="constraints" title={s.constraints[locale]}>
              <Constraints items={project.constraints[locale]} locale={locale} />
            </CaseSection>
          </Part>

          <Part id="decisions" numeral="II" title={parts.decisions[locale]} summary={typo(locale, summaries.decisions[locale])}>
            <CaseSection id="architecture" title={s.architecture[locale]}>
              <Prose paragraphs={project.architecture.body[locale]} locale={locale} />
              {architectureDiagrams.map(diagram)}
            </CaseSection>
            <CaseSection id="decision-record" title={ui.project.decisionRecord[locale]}>
              <DecisionLedger decisions={project.decisions} locale={locale} />
            </CaseSection>
          </Part>

          <Part id="implementation" numeral="III" title={parts.implementation[locale]} summary={typo(locale, summaries.implementation[locale])}>
            {project.implementation.intro && <Prose paragraphs={[project.implementation.intro[locale]]} locale={locale} className="mt-8" />}
            <ImplementationList items={project.implementation.items[locale]} locale={locale} />
            {project.deepDives.map((d) => (
              <CaseSection key={d.id} id={d.id} title={typo(locale, d.title[locale])}>
                <Prose paragraphs={d.body[locale]} locale={locale} />
                {d.terms && <TermList terms={d.terms} locale={locale} />}
                {d.diagram && diagram(d.diagram)}
                {d.snippets?.map(listing)}
              </CaseSection>
            ))}
          </Part>

          <Part id="results" numeral="IV" title={parts.results[locale]} summary={typo(locale, summaries.results[locale])}>
            <CaseSection id="verification" title={s.verification[locale]}>
              {!showRun && (
                <p className="measure mt-6 text-lg font-medium leading-[1.875rem] text-ink">
                  {typo(locale, (project.resultsNote ?? ui.project.noResults)[locale])}
                </p>
              )}
              <Prose paragraphs={project.verification.body[locale]} locale={locale} />
              {showRun && (
                <div className="my-8 lg:my-12">
                  <ResultsTable locale={locale} />
                </div>
              )}
              {project.verification.snippets?.map(listing)}
            </CaseSection>
            <CaseSection id="status" title={s.status[locale]}>
              <NowNext now={project.now[locale]} next={project.next[locale]} locale={locale} />
            </CaseSection>
          </Part>

          <Part id="limitations" numeral="V" title={parts.limitations[locale]} summary={typo(locale, summaries.limitations[locale])}>
            <CaseSection id="failure-modes" title={s.failureModes[locale]}>
              <FailureTable modes={project.failureModes} locale={locale} caption={s.failureModes[locale]} />
            </CaseSection>
            <CaseSection id="lessons" title={s.lessons[locale]}>
              <Lessons items={project.lessons[locale]} locale={locale} />
            </CaseSection>
            <CaseSection id="next-iteration" title={s.nextIteration[locale]}>
              <NextIteration items={project.nextIteration[locale]} locale={locale} />
            </CaseSection>
          </Part>
        </div>
      </div>

      {/* End of the page: previous, next project, one line of contact. */}
      <div className="page-grid mt-22 pb-16 md:mt-36 md:pb-24">
        <nav aria-label={ui.nav.projects[locale]}>
          {previous && (
            <Link
              href={href(locale, `/projects/${previous.slug}`)}
              className="group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium leading-6 text-ink motion-safe:transition-colors motion-safe:duration-150 hover:text-accent"
            >
              <ArrowLeft aria-hidden strokeWidth={1.75} className="size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-x-[3px]" />
              <span>
                {ui.project.previousPrefix[locale]} <span className="underline decoration-accent/55 underline-offset-[0.2em] group-hover:decoration-accent">{typo(locale, previous.title[locale])}</span>
              </span>
            </Link>
          )}
          <Link href={nextHref} className="group mt-4 block border-t border-line pb-8 pt-6 md:pb-10 md:pt-8">
            {next && (
              <span className="block text-sm font-medium leading-5 text-ink-2">
                {ui.project.nextProject[locale].replace("{index}", next.index)}
              </span>
            )}
            <span className="t-h2 mt-3 block text-ink">
              <span className="underline decoration-transparent decoration-2 underline-offset-[0.14em] motion-safe:transition-colors motion-safe:duration-150 group-hover:decoration-accent">
                {typo(locale, next ? next.title[locale] : ui.cta.allProjects[locale])}
              </span>
              <ArrowRight
                aria-hidden
                strokeWidth={1.5}
                className="ml-3 inline-block size-[0.62em] align-[-0.06em] motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-[3px]"
              />
            </span>
          </Link>
        </nav>
        {canContact && (
          <p className="flex flex-wrap items-center gap-x-4 border-t border-line pt-4 text-base leading-6 text-ink">
            <span>{ui.project.questions[locale]}</span>
            <ActionLink href={href(locale, "/contact")}>{ui.project.getInTouch[locale]}</ActionLink>
          </p>
        )}
      </div>
    </article>
  );
}
