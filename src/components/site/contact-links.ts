import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

/** Contact channels that are actually configured. Empty values never produce a link. */
export function contactLinks(locale: Locale) {
  const links: { id: string; label: string; href: string }[] = [];
  if (profile.email) links.push({ id: "email", label: profile.email, href: `mailto:${profile.email}` });
  if (profile.linkedin) links.push({ id: "linkedin", label: ui.cta.linkedin[locale], href: profile.linkedin });
  if (profile.github) links.push({ id: "github", label: ui.cta.github[locale], href: profile.github });
  if (profile.cv) links.push({ id: "cv", label: ui.cta.cv[locale], href: profile.cv });
  return links;
}
