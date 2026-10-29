import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContactSection } from "@/components/site/contact-section";
import { ActionLink, PageOpening, RunIn, StatusLine } from "@/components/ui";
import { background, frontierStartsAt, progression, progressionPhases } from "@/content/background";
import { certifications, education } from "@/content/education";
import { secondarySkills, skillGroups } from "@/content/skills";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { href, type Locale } from "@/lib/i18n";
import { localeStaticParams, pageMetadata, resolveLocale, type LocaleParams } from "@/lib/page";
import { typo } from "@/lib/typo";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/about", title: ui.aboutPage.title[locale], description: ui.aboutPage.lead[locale] });
}

const columns = "grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-x-[var(--gap)]";

/** Lower-cases the first letter of a list item so a list reads as one sentence ("Distributed systems" → "distributed systems"). */
function sentenceItem(s: string, first: boolean) {
  if (first || !/^\p{Lu}\p{Ll}/u.test(s)) return s;
  return s[0]!.toLowerCase() + s.slice(1);
}

/** A skill group as one sentence: "Docker, CI/CD, and Git." / "Docker, CI/CD i Git." */
function listSentence(locale: Locale, items: readonly string[]) {
  return `${new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items)}.`;
}

/** A section opened by a hairline and an H2, like the case-study part openers. */
function Part({ id, titleId, title, children }: { id?: string; titleId: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={titleId} className="page-grid mt-24 lg:mt-36">
      <div className="border-t border-line pt-6 lg:pt-8">
        <h2 id={titleId} className="t-h2 max-w-[18em]">
          {title}
        </h2>
        <div className="mt-10 lg:mt-14">{children}</div>
      </div>
    </section>
  );
}

function ProgressionColumn({ locale, title, from, to }: { locale: Locale; title: string; from: number; to: number }) {
  return (
    <div>
      <h3 className="t-h4">{title}</h3>
      <ol start={from + 1} className="mt-4 border-b border-line">
        {progression.slice(from, to).map((step, i) => (
          <li key={step.title.en} className="grid grid-cols-[2.25rem_1fr] items-baseline border-t border-line py-4">
            <span aria-hidden className="nums font-serif text-xl leading-6 text-ink-2">
              {from + i + 1}
            </span>
            <span>
              <span className="block text-[1.0625rem] font-semibold leading-6 text-ink">{typo(locale, step.title[locale])}</span>
              <span className="mt-0.5 block text-[0.9375rem] leading-6 text-ink-2">{typo(locale, step.note[locale])}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const a = ui.aboutPage;
  const themes = background.themes[locale].map((t, i) => sentenceItem(t, i === 0)).join(", ");

  return (
    <>
      <PageOpening title={typo(locale, a.heading[locale])} lead={typo(locale, a.lead[locale])} />

      {/* Story in c4–c10; the honest note sits in the margin from 1280px, inline after the story below that. */}
      <div className="page-grid">
        <div className={columns}>
          <div className="t-prose prose col-span-full max-w-[64ch] text-ink lg:col-[4/span_7] xl:col-[4/span_6] xl:row-start-1">
            {a.story[locale].map((p) => (
              <p key={p.slice(0, 32)}>{typo(locale, p)}</p>
            ))}
          </div>
          <aside className="col-span-full mt-10 max-w-[64ch] border-l-2 border-ink-2 pl-4 text-[0.9375rem] leading-6 text-ink lg:col-[4/span_7] xl:col-[10/span_3] xl:row-start-1 xl:mt-0 xl:self-end">
            {typo(locale, a.honest[locale])}
          </aside>
        </div>
      </div>

      <Part titleId="progression-title" title={typo(locale, a.progressionTitle[locale])}>
        <div className={cn(columns, "gap-y-12")}>
          <div className="col-span-full sm:col-span-4 lg:col-span-6">
            <ProgressionColumn locale={locale} title={typo(locale, progressionPhases.foundation[locale])} from={0} to={frontierStartsAt} />
          </div>
          <div className="col-span-full sm:col-span-4 lg:col-span-6">
            <ProgressionColumn
              locale={locale}
              title={typo(locale, progressionPhases.frontier[locale])}
              from={frontierStartsAt}
              to={progression.length}
            />
          </div>
        </div>
      </Part>

      <Part id="background" titleId="background-title" title={typo(locale, a.factsTitle[locale])}>
        <dl className="grid grid-cols-2 gap-x-[var(--gap)] gap-y-8 lg:grid-cols-4">
          {background.facts.map((f) => (
            <div key={f.label.en} className="flex flex-col border-t border-line pt-4">
              <dt className="order-2 mt-2 text-[0.9375rem] leading-[1.4667] text-ink-2">{typo(locale, f.label[locale])}</dt>
              <dd className="t-num-fact order-1 text-ink">{typo(locale, f.value[locale])}</dd>
            </div>
          ))}
        </dl>
        <p className="t-body mt-10 max-w-[64ch] text-ink">
          <RunIn>{a.themesLead[locale]}</RunIn>
          {typo(locale, themes)}.
        </p>
      </Part>

      <Part titleId="capabilities-title" title={typo(locale, a.capabilitiesTitle[locale])}>
        <ul className={cn(columns, "gap-y-10")}>
          {skillGroups.map((g) => (
            <li key={g.id} className="col-span-full border-t border-line pt-4 sm:col-span-4 lg:col-span-3">
              <h3 className="text-[1.0625rem] font-semibold leading-6 text-ink">{typo(locale, g.title[locale])}</h3>
              <p className="text-sm leading-5 text-ink-2">{typo(locale, g.note[locale])}</p>
              {g.items[locale].length > 0 && (
                <p className="mt-3 text-base leading-[1.625] text-ink">{typo(locale, listSentence(locale, g.items[locale]))}</p>
              )}
            </li>
          ))}
        </ul>
        {secondarySkills.length > 0 && (
          <p className="t-body mt-10 max-w-[64ch] text-ink">
            <RunIn>{a.alsoWorkedWith[locale]}</RunIn>
            {typo(locale, listSentence(locale, secondarySkills))}
          </p>
        )}
      </Part>

      <Part titleId="education-title" title={typo(locale, a.educationTitle[locale])}>
        <dl>
          <div className={cn(columns, "gap-y-3 border-t border-line py-6")}>
            <dt className="col-span-full text-[0.9375rem] font-semibold leading-6 text-ink lg:col-span-3">{a.education[locale]}</dt>
            <dd className="col-span-full lg:col-[4/span_9]">
              <ul className={cn(columns, "gap-y-6 lg:grid-cols-9")}>
                {education.map((e) => (
                  <li key={e.title.en} className="col-span-full sm:col-span-4">
                    <p className="text-[1.0625rem] font-semibold leading-6 text-ink">{typo(locale, e.title[locale])}</p>
                    <p className="text-[0.9375rem] leading-6 text-ink-2">{typo(locale, e.field[locale])}</p>
                    <StatusLine shape="half" text={e.status[locale]} locale={locale} className="mt-2" />
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className={cn(columns, "gap-y-3 border-t border-line py-6")}>
            <dt className="col-span-full text-[0.9375rem] font-semibold leading-6 text-ink lg:col-span-3">{a.certifications[locale]}</dt>
            <dd className="col-span-full lg:col-[4/span_9]">
              <ul className={cn(columns, "gap-y-6 lg:grid-cols-9")}>
                {certifications.map((c) => (
                  <li key={c.title} className="col-span-full sm:col-span-4">
                    <p className="text-[1.0625rem] font-semibold leading-6 text-ink">{c.title}</p>
                    <p className="text-[0.9375rem] leading-6 text-ink-2">{c.issuer}</p>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </Part>

      <div className="page-grid mt-24 pb-24 lg:mt-36 lg:pb-36">
        <div className="border-t border-line pt-8">
          <p className="t-lead-sm max-w-[30em] text-ink">{typo(locale, a.principlesTeaser[locale])}</p>
          <ActionLink href={href(locale, "/principles")} className="mt-4">
            {ui.cta.principles[locale]}
          </ActionLink>
        </div>
      </div>

      <ContactSection locale={locale} variant="band" />
    </>
  );
}
