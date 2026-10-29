import type { Metadata } from "next";
import { contactLinks } from "@/components/site/contact-links";
import { ContactSection } from "@/components/site/contact-section";
import { ActionLink, PageOpening, RunIn } from "@/components/ui";
import { getProject } from "@/content/projects";
import { engagementSteps, services } from "@/content/services";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { href } from "@/lib/i18n";
import { localeStaticParams, pageMetadata, resolveLocale, type LocaleParams } from "@/lib/page";
import { typo } from "@/lib/typo";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/services", title: ui.servicesPage.title[locale], description: ui.servicesPage.intro[locale] });
}

const columns = "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-[var(--gap)]";

export default async function ServicesPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const sp = ui.servicesPage;
  const hasChannels = contactLinks(locale).length > 0;
  return (
    <>
      <PageOpening title={typo(locale, sp.title[locale])} lead={typo(locale, sp.intro[locale])} />

      <section className="page-grid">
        {/* Order alone gives priority: no featured frame. */}
        <ul>
          {services.map((s, i) => {
            const evidence = getProject(s.evidence);
            return (
              <li key={s.id} id={s.id} className={cn(columns, "gap-y-8 border-t border-line py-10 first:border-t-0 first:pt-2 lg:py-14 lg:first:pt-2")}>
                <div className="col-span-full lg:col-[1/span_4]">
                  <p className="nums font-serif text-xl leading-6 text-ink-2">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="t-h3 mt-2">{typo(locale, s.title[locale])}</h2>
                  <p className="t-desc mt-3 max-w-[44ch] text-ink [text-wrap:balance]">{typo(locale, s.headline[locale])}</p>
                </div>

                <div className="col-span-full sm:col-[1/span_5] lg:col-[6/span_4]">
                  <p className="t-body text-ink">{typo(locale, s.body[locale])}</p>
                  <h3 className="mt-6 text-[0.9375rem] font-semibold leading-6 text-ink">{sp.outcomes[locale]}</h3>
                  <ul className="t-body mt-2 grid gap-1.5 text-ink">
                    {s.outcomes[locale].map((o) => (
                      <li key={o} className="grid grid-cols-[1.25em_1fr]">
                        <span aria-hidden className="text-ink-2">
                          –
                        </span>
                        <span>{typo(locale, o)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-[0.9375rem] leading-6 text-ink-2">
                    <RunIn>{sp.includes[locale]}:</RunIn>
                    {typo(locale, s.items[locale].join(", "))}.
                  </p>
                </div>

                {evidence && (
                  <div className="col-span-full sm:col-[6/span_3] lg:col-[10/span_3]">
                    <p className="text-sm font-medium leading-5 text-ink-2">{sp.shownIn[locale]}</p>
                    <ActionLink href={href(locale, `/projects/${evidence.slug}`)} className="mt-1">
                      {typo(locale, evidence.title[locale])}
                    </ActionLink>
                    <p className="mt-2 text-[0.9375rem] leading-6 text-ink-2">{typo(locale, evidence.question[locale])}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="engagement-title" className={cn("page-grid mt-10 lg:mt-16", !hasChannels && "pb-24 lg:pb-36")}>
        <div className="border-t border-line pt-6 lg:pt-8">
          <h2 id="engagement-title" className="t-h2 max-w-[18em]">
            {typo(locale, sp.howLabel[locale])}
          </h2>
          <ol className={cn(columns, "mt-10 gap-y-10 lg:mt-14")}>
            {engagementSteps.map((step, i) => (
              <li key={step.title.en} className="col-span-full lg:col-span-4">
                <span aria-hidden className="nums block font-serif text-[2.5rem] leading-none text-ink-2">
                  {i + 1}
                </span>
                <h3 className="t-h4 mt-4">{typo(locale, step.title[locale])}</h3>
                <p className="t-body mt-2 max-w-[40ch] text-ink">{typo(locale, step.body[locale])}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* With no channel published, /contact has nothing to offer yet, so the page ends on the steps. */}
      {hasChannels && (
        <div className="mt-24 lg:mt-36">
          <ContactSection locale={locale} variant="band" />
        </div>
      )}
    </>
  );
}
