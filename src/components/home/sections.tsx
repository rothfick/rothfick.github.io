import Link from "next/link";
import { Fragment } from "react";
import { ActionLink, ButtonLink, StatusMarker, shapeForStatus } from "@/components/ui";
import { background } from "@/content/background";
import { identity, profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { ui } from "@/content/ui";
import { href, type Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";
import { Hairline } from "./hairline";
import { statusText } from "./status-text";

export { WorkSection } from "./work";

/* ---------------------------------------------------------------------------
   S1. The name, one statement and one action. From 1024px the right-hand
   column is the real project index, not a graphic.
--------------------------------------------------------------------------- */
export function Hero({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="hero-title" className="page-grid pb-8 pt-7 md:py-10">
      <div className="lg:col-[2/span_8]">
        <h1 id="hero-title" className="t-display text-ink">
          {profile.name}
        </h1>
        <p className="t-statement mt-4 max-w-[24em] text-ink md:mt-5">{typo(locale, identity.statement[locale])}</p>
        <div className="mt-6 md:mt-7">
          <ButtonLink href="#work" arrow="down" block>
            {ui.cta.exploreProjects[locale]}
          </ButtonLink>
        </div>
      </div>
      <HeroIndex locale={locale} />
    </section>
  );
}

function HeroIndex({ locale }: { locale: Locale }) {
  return (
    <nav aria-labelledby="hero-index-title" className="mt-1 max-lg:hidden lg:col-[10/span_4]">
      <h2 id="hero-index-title" className="border-b border-line pb-2.5 text-[0.9375rem] font-semibold leading-5 text-ink">
        {ui.home.indexTitle[locale]}
      </h2>
      <ol>
        {projects.map((project) => (
          <li
            key={project.slug}
            className="row-link group grid min-h-[52px] grid-cols-[36px_1fr] border-b border-line py-1.5 has-[a:active]:bg-paper-dim"
          >
            <span aria-hidden className="nums font-serif text-[1.0625rem] leading-[22px] text-ink-2 motion-safe:transition-colors group-hover:text-accent">
              {project.index}
            </span>
            <span className="min-w-0">
              <Link
                href={href(locale, `/projects/${project.slug}`)}
                className="block text-base font-medium leading-[22px] text-ink decoration-accent decoration-2 underline-offset-4 after:absolute after:inset-0 group-hover:underline"
              >
                {typo(locale, project.title[locale])}
              </Link>
              <span className="flex items-start gap-2 text-sm leading-5 text-ink-2">
                <span className="sr-only">{ui.project.meta.status[locale]}: </span>
                <StatusMarker shape={shapeForStatus(project.statuses[0]!)} className="mt-[5px]" />
                <span>{statusText(locale, project.statusLine[locale])}</span>
              </span>
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------------------------
   S3. Where the experience comes from, in a few facts and one sentence about
   services, each linked to its entry.
--------------------------------------------------------------------------- */
function ServicesSentence({ locale }: { locale: Locale }) {
  const parts = ui.home.servicesSentence[locale].split(/\{(\d)\}/);
  return (
    <p className="prose t-body max-w-[60ch] text-ink">
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{typo(locale, part)}</Fragment>;
        const service = services[Number(part)];
        if (!service) return null;
        return (
          <Link key={i} href={href(locale, `/services#${service.id}`)}>
            {typo(locale, service.inlineName[locale])}
          </Link>
        );
      })}
    </p>
  );
}

export function BackgroundSection({ locale }: { locale: Locale }) {
  const h = ui.home;
  const facts = [background.facts[0]!, background.facts[1]!, background.facts[3]!, h.studiesFact];
  return (
    <section id="background" aria-labelledby="background-title" className="mt-22 pb-22 md:mt-32 lg:mt-40 lg:pb-30">
      <Hairline />
      <div className="page-grid pt-6 md:pt-8">
        <h2 id="background-title" className="t-h2 lg:col-[2/span_4]">
          {typo(locale, h.backgroundTitle[locale])}
        </h2>
        <div className="mt-6 lg:col-[7/span_7] lg:mt-1.5 lg:grid lg:grid-cols-subgrid">
          <p className="t-statement max-w-[30em] text-ink md:text-[1.375rem] md:leading-[1.36] lg:col-span-6">
            {typo(locale, h.backgroundLead[locale])}
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-5 md:grid-cols-4 lg:col-span-7 lg:gap-x-6 lg:max-xl:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label.en} className="flex flex-col">
                <dt className="t-num-fact text-ink">{typo(locale, fact.value[locale])}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-[1.4667] text-ink-2">{typo(locale, fact.label[locale])}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 lg:col-span-6">
            <ServicesSentence locale={locale} />
            <div className="mt-5">
              <ActionLink href={href(locale, "/services")}>{h.workTogether[locale]}</ActionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
