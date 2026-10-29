import type { Metadata } from "next";
import { BackgroundSection, Hero, WorkSection } from "@/components/home/sections";
import { ContactSection } from "@/components/site/contact-section";
import { identity, profile, siteUrl } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { href } from "@/lib/i18n";
import { pageMetadata, resolveLocale, type LocaleParams } from "@/lib/page";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const sameAs = [profile.github, profile.linkedin].filter(Boolean);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: identity.role[locale],
    description: identity.seoDescription[locale],
    url: `${siteUrl}${href(locale)}`,
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    knowsAbout: skillGroups.slice(0, 1).flatMap((g) => g.items[locale]),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <Hero locale={locale} />
      <WorkSection locale={locale} />
      <BackgroundSection locale={locale} />
      <ContactSection locale={locale} variant="band" />
    </>
  );
}
