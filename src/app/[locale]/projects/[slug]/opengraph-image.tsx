export const dynamic = "force-static";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project case study — Robert Leszczyński";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export default async function ProjectOpenGraphImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const project = getProject(slug) ?? projects[0]!;
  return renderOg({
    locale,
    eyebrow: project.statusLine[locale],
    title: project.title[locale],
    subtitle: project.question[locale],
    footer: profile.name,
  });
}
