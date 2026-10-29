export const dynamic = "force-static";
import { identity, profile } from "@/content/profile";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { ogSize, renderOg } from "@/lib/og";
import { localeStaticParams } from "@/lib/page";

export const generateStaticParams = localeStaticParams;
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Robert Leszczyński — AI engineer with roots in quality engineering";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  return renderOg({ locale, title: profile.name, subtitle: identity.statement[locale] });
}
