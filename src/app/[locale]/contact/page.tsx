import type { Metadata } from "next";
import { ContactSection } from "@/components/site/contact-section";
import { ui } from "@/content/ui";
import { localeStaticParams, pageMetadata, resolveLocale, type LocaleParams } from "@/lib/page";

export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({ locale, path: "/contact", title: ui.contactPage.title[locale], description: ui.contact.body[locale] });
}

/** The page variant renders the H1, the channels (or an honest "not published yet") and the checklist. */
export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  return <ContactSection locale={locale} variant="page" />;
}
