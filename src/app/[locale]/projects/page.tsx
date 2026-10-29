import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink, PageOpening, StatusLine, shapeForStatus } from "@/components/ui";
import { categories, projects } from "@/content/projects";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { href, type Locale } from "@/lib/i18n";
import { localeStaticParams, pageMetadata, resolveLocale, type LocaleParams } from "@/lib/page";
import { typo } from "@/lib/typo";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/projects", title: ui.projectsPage.title[locale], description: ui.projectsPage.intro[locale] });
}

/**
 * "Working MVP · in active development" breaks only after the dot (or after a "/"),
 * never inside a phrase and never with the dot starting a line.
 */
const glueStatus = (s: string) =>
  s
    .split(/\s·\s/)
    .map((part) => part.split(/\s\/\s/).map((words) => words.replace(/\s/g, "\u00a0")).join("\u00a0/ "))
    .join("\u00a0· ");

/** "3 projects" / "3 projekty" / "5 projektów": the spoken half of each filter option. */
const projectCount: Record<Locale, (n: number) => string> = {
  en: (n) => `${n} ${n === 1 ? "project" : "projects"}`,
  pl: (n) => {
    const form = new Intl.PluralRules("pl").select(n);
    return `${n} ${form === "one" ? "projekt" : form === "few" ? "projekty" : "projektów"}`;
  },
};

/** Rows share the page columns: 4 / 8 / 12 with the page gap. */
const columns = "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-[var(--gap)]";

export default async function ProjectsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const p = ui.projectsPage;
  const filters = [
    { value: "all", label: p.all[locale], count: projects.length },
    ...categories.map((c) => ({ value: c, label: ui.category[c][locale], count: projects.filter((x) => x.categories.includes(c)).length })),
  ];

  return (
    <>
      <PageOpening title={typo(locale, p.title[locale])} lead={typo(locale, p.intro[locale])} />

      <section className="page-grid pb-24 lg:pb-36">
        {/*
          The filter is pure CSS: each checked radio hides the rows outside its area (globals.css).
          Each option carries its row count, so the result is known before choosing and is read
          with the option's name; there is no live announcement because nothing runs on the client.
          The padding makes every option a 44px target; the negative margin keeps the text on the grid.
        */}
        <fieldset className="project-filter">
          <legend className="text-sm font-medium leading-5 text-ink-2">{p.filter[locale]}</legend>
          <div className="-mx-2 mt-1 flex flex-wrap sm:-mx-3.5">
            {filters.map((f) => (
              <label key={f.value} className="relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-2 sm:px-3.5">
                <input type="radio" name="project-filter" value={f.value} defaultChecked={f.value === "all"} className="peer sr-only" />
                <span
                  className={cn(
                    "t-ui rounded-[2px] text-ink-2 decoration-accent decoration-2 underline-offset-[6px] motion-safe:transition-colors motion-safe:duration-150",
                    "hover:text-ink peer-checked:text-ink peer-checked:underline",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-accent peer-focus-visible:outline-solid",
                  )}
                >
                  <span>{f.label}</span>
                  {/* inline-block keeps the count out of the checked underline. */}
                  <span aria-hidden className="nums ml-1 inline-block text-sm font-normal text-ink-2">
                    {f.count}
                  </span>
                  <span className="sr-only">, {projectCount[locale](f.count)}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <ul className="project-list mt-6 border-b border-line lg:mt-8" aria-label={ui.nav.projects[locale]}>
          {projects.map((project) => {
            // The year never starts a line on its own after a wrapped "·".
            const meta = [project.categories.map((c) => ui.category[c][locale]).join(", "), project.year].filter(Boolean).join("\u00a0· ");
            return (
              <li
                key={project.slug}
                data-categories={project.categories.join(" ")}
                data-testid="project-row"
                className={cn(
                  columns,
                  "row-link group items-baseline border-t border-line py-7 sm:py-8",
                  "motion-safe:transition-colors motion-safe:duration-150 active:bg-paper-dim",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "nums col-start-1 row-start-1 font-serif text-2xl leading-8 text-ink-2 group-hover:text-accent motion-safe:transition-colors motion-safe:duration-150",
                  )}
                >
                  {project.index}
                </span>

                <h2
                  className={cn(
                    "t-h3 col-span-full sm:col-[2/-1] lg:col-[2/span_4] xl:col-[2/span_5]",
                    "mt-3 sm:mt-0",
                  )}
                >
                  <Link
                    href={href(locale, `/projects/${project.slug}`)}
                    className="decoration-accent decoration-2 underline-offset-[6px] after:absolute after:inset-0 group-hover:underline"
                  >
                    {typo(locale, project.title[locale])}
                  </Link>
                </h2>

                <p
                  className={cn(
                    "col-span-full mt-3 text-base leading-[1.625] text-ink sm:col-[2/span_6] sm:text-[1.0625rem] sm:leading-7 lg:col-[6/span_4] lg:mt-0 xl:col-[7/span_3]",
                  )}
                >
                  {typo(locale, project.question[locale])}
                </p>

                {/* Phones: the status shares the number's line (indented past it). From 640px the two lines stack in one column. */}
                <div className={cn("contents sm:col-[2/-1] sm:mt-4 sm:block lg:col-[10/span_3] lg:mt-0")}>
                  <StatusLine
                    shape={shapeForStatus(project.statuses[0]!)}
                    text={glueStatus(typo(locale, project.statusLine[locale]))}
                    locale={locale}
                    className="col-[1/-1] row-start-1 max-sm:pl-12"
                  />
                  <p className="col-span-full mt-3 text-sm leading-5 text-ink-2 sm:mt-1.5">{meta}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className={cn(columns, "mt-16 lg:mt-24")}>
          <div className="col-span-full sm:col-[2/span_6] lg:col-[2/span_6]">
            <p className="t-lead-sm max-w-[30em] text-ink">{typo(locale, p.labTeaser[locale])}</p>
            <ActionLink href={href(locale, "/lab")} className="mt-4">
              {ui.cta.engineeringLab[locale]}
            </ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
