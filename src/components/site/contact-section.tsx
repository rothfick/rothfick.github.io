import { ui } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";
import { ButtonLink } from "../ui";
import { contactLinks } from "./contact-links";

/**
 * Contact content. As a band (homepage, services) it renders only when a
 * channel is configured; on /contact it always renders and says honestly
 * that no channel is published yet. Nothing is invented and no link is empty.
 */
export function ContactSection({ locale, variant = "band" }: { locale: Locale; variant?: "band" | "page" }) {
  const links = contactLinks(locale);
  if (variant === "band" && links.length === 0) return null;
  const c = ui.contact;
  const page = variant === "page";
  const Heading = page ? "h1" : "h2";
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={page ? "page-grid pb-16 pt-8 lg:pb-24 lg:pt-16" : "page-grid bg-stone py-16 lg:py-24"}
    >
      <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-8">
          <Heading id="contact-title" className="t-h2">
            {typo(locale, c.title[locale])}
          </Heading>
          <p className="t-body mt-5 max-w-[46ch] text-ink">{typo(locale, c.body[locale])}</p>
          {links.length > 0 ? (
            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-testid="contact-links">
              {links.map((l, i) => (
                <li key={l.id}>
                  <ButtonLink href={l.href} arrow="external" variant={i === 0 ? "primary" : "secondary"} block>
                    {l.label}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-lg leading-[1.67] text-ink" data-testid="contact-empty">
              {typo(locale, c.noChannels[locale])}
            </p>
          )}
        </div>
        <div className="lg:col-span-3 lg:col-start-10">
          <h2 className="text-[0.9375rem] font-semibold leading-6 text-ink">{c.helpful[locale]}</h2>
          <ol className="mt-3 border-t border-line">
            {c.helpfulItems[locale].map((item, i) => (
              <li key={item} className="flex gap-4 border-b border-line py-3 text-[0.9375rem] leading-6 text-ink">
                <span className="nums font-serif text-lg leading-6 text-ink-2">{i + 1}</span>
                {typo(locale, item)}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
