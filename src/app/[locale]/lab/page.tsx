import type { Metadata } from "next";
import { ActionLink, PageOpening, RunIn, StatusLine, shapeForStatus } from "@/components/ui";
import { labItems } from "@/content/lab";
import { getProject } from "@/content/projects";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { href } from "@/lib/i18n";
import { localeStaticParams, pageMetadata, resolveLocale, type LocaleParams } from "@/lib/page";
import { typo } from "@/lib/typo";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/lab", title: ui.labPage.title[locale], description: ui.labPage.intro[locale] });
}

const columns = "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-[var(--gap)]";

export default async function LabPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const l = ui.labPage;
  return (
    <>
      <PageOpening title={typo(locale, l.title[locale])} lead={typo(locale, l.intro[locale])} />

      <section className="page-grid pb-12 lg:pb-20">
        <ul>
          {labItems.map((item, i) => {
            const related = item.related ? getProject(item.related.replace("/projects/", "")) : undefined;
            return (
              <li key={item.id} id={item.id} className={cn(columns, "border-t border-line py-10 first:border-t-0 first:pt-2 lg:py-14 lg:first:pt-2")}>
                <div className="col-span-full sm:col-[1/span_6] lg:col-[1/span_4]">
                  <p className="nums font-serif text-xl leading-6 text-ink-2">L{i + 1}</p>
                  <h2 className="t-h3 mt-2">{typo(locale, item.title[locale])}</h2>
                  <StatusLine shape={shapeForStatus(item.status)} text={ui.status[item.status][locale]} locale={locale} className="mt-4" />
                  <p className="mt-4 max-w-[40ch] text-[0.9375rem] leading-6 text-ink">
                    <RunIn>{l.evidence[locale]}.</RunIn>
                    {typo(locale, item.evidence[locale])}
                  </p>
                </div>

                <div className="col-span-full mt-8 sm:col-[1/span_7] lg:col-[6/span_7] lg:mt-0">
                  <p className="t-body max-w-[64ch] text-ink">{typo(locale, item.summary[locale])}</p>
                  <h3 className="mt-8 text-[0.9375rem] font-semibold leading-6 text-ink">{l.explores[locale]}</h3>
                  <ul className="mt-3 grid max-w-[34em] gap-3">
                    {item.explores[locale].map((e) => (
                      <li key={e} className="t-lead-sm grid grid-cols-[1.25em_1fr] text-ink">
                        <span aria-hidden className="text-ink-2">
                          –
                        </span>
                        <span>{typo(locale, e)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm leading-5 text-ink-2">{typo(locale, item.topics[locale].join(", "))}</p>
                  {related && item.related && (
                    <div className="mt-6">
                      <p className="text-sm font-medium leading-5 text-ink-2">{l.related[locale]}</p>
                      <ActionLink href={href(locale, item.related)}>{typo(locale, related.title[locale])}</ActionLink>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
