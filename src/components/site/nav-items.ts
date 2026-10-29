import { ui } from "@/content/ui";

export const navItems = [
  { path: "/projects", label: ui.nav.projects },
  { path: "/lab", label: ui.nav.lab },
  { path: "/services", label: ui.nav.services },
  { path: "/about", label: ui.nav.about },
  { path: "/contact", label: ui.nav.contact },
] as const;
