"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ButtonLink, PageOpening } from "@/components/ui";
import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { defaultLocale, href, isLocale } from "@/lib/i18n";
import { typo } from "@/lib/typo";

export default function NotFound() {
  const segment = usePathname()?.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const title = `${ui.notFound.title[locale].replace(/\.$/, "")} — ${profile.name}`;

  // The browser tab and screen readers should say the page is missing (WCAG 2.4.2). A client
  // not-found can't export metadata, and a React <title> lands after the layout's own title,
  // which then still wins, so the title is set here and handed back on the way out unless the
  // next page has already set its own.
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      if (document.title === title) document.title = previous;
    };
  }, [title]);

  return (
    // The footer's hairline closes this short page, so the opening draws no rule of its own.
    <div className="pb-8 lg:pb-16">
      <PageOpening rule={false} title={typo(locale, ui.notFound.title[locale])} lead={typo(locale, ui.notFound.body[locale])}>
        <div className="mt-8">
          <ButtonLink href={href(locale, "/projects")} block>
            {ui.cta.exploreProjects[locale]}
          </ButtonLink>
        </div>
      </PageOpening>
    </div>
  );
}
