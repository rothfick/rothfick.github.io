import type { Metadata } from "next";
import { ActionLink, PageOpening, RunIn } from "@/components/ui";
import { principles } from "@/content/principles";
import { getProject } from "@/content/projects";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { href } from "@/lib/i18n";
import { localeStaticParams, pageMetadata, resolveLocale, type LocaleParams } from "@/lib/page";
import { typo } from "@/lib/typo";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/principles", title: ui.principlesPage.title[locale], description: ui.principlesPage.intro[locale] });
}

const columns = "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-[var(--gap)]";

export default async function PrinciplesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const pp = ui.principlesPage;
  return (
    <>
      <PageOpening title={typo(locale, pp.title[locale])} lead={typo(locale, pp.intro[locale])} />

      <section className="page-grid pb-12 lg:pb-20">
        <ol>
          {principles.map((p, i) => {
            const project = p.link ? getProject(p.link.replace("/projects/", "")) : undefined;
            return (
              <li key={p.id} id={p.id} className={cn(columns, "gap-y-5 border-t border-line py-10 first:border-t-0 first:pt-2 lg:py-14 lg:first:pt-2")}>
                <div className="col-span-full sm:col-span-6 lg:col-span-5">
                  <span aria-hidden className="nums block font-serif text-2xl leading-8 text-ink-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="t-h3 mt-2">{typo(locale, p.title[locale])}</h2>
                </div>
                <div className="col-span-full sm:col-span-7 lg:col-[6/span_6] lg:pt-10">
                  <p className="t-body max-w-[64ch] text-ink">{typo(locale, p.body[locale])}</p>
                  <p className="t-body mt-4 max-w-[64ch] text-ink">
                    <RunIn>{pp.inPractice[locale]}.</RunIn>
                    {typo(locale, p.inPractice[locale])}
                  </p>
                  {project && p.link && (
                    <ActionLink href={href(locale, p.link)} className="mt-3">
                      {typo(locale, project.title[locale])}
                    </ActionLink>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
