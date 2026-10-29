import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { identity, profile } from "@/content/profile";
import { href, isLocale, locales, ogLocale, otherLocale, type Locale } from "./i18n";

export type LocaleParams = { params: Promise<{ locale: string }> };

export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function localeStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Per-page metadata with canonical URL and hreflang alternates for both languages. */
export function pageMetadata({
  locale,
  path = "/",
  title,
  description = identity.seoDescription[locale],
}: {
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
}): Metadata {
  const url = href(locale, path);
  return {
    title: title ?? { absolute: identity.seoTitle[locale] },
    description,
    alternates: {
      canonical: url,
      languages: { en: href("en", path), pl: href("pl", path), "x-default": href("en", path) },
    },
    openGraph: {
      type: "website",
      url,
      siteName: profile.name,
      locale: ogLocale[locale],
      alternateLocale: ogLocale[otherLocale(locale)],
      title: title ? `${title} — ${profile.name}` : identity.seoTitle[locale],
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} — ${profile.name}` : identity.seoTitle[locale],
      description,
    },
  };
}
