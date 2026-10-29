export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/profile";
import { projects } from "@/content/projects";
import { href, locales } from "@/lib/i18n";

const staticPaths = ["/", "/projects", "/lab", "/services", "/about", "/principles", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticPaths, ...projects.map((p) => `/projects/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}${href(locale, path)}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path.startsWith("/projects") ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${href(l, path)}`])),
      },
    })),
  );
}
