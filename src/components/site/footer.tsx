import Link from "next/link";
import { identity, profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { href, type Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";
import { contactLinks } from "./contact-links";
import { navItems } from "./nav-items";

export function Footer({ locale }: { locale: Locale }) {
  const links = contactLinks(locale);
  const pages = [...navItems.slice(0, 4), { path: "/principles", label: ui.nav.principles }, navItems[4]!];
  return (
    <footer className="page-grid border-t border-line pb-8 pt-12 lg:pb-10 lg:pt-14">
      <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <p className="font-serif text-2xl leading-8 text-ink">{profile.name}</p>
          <p className="mt-2 text-[0.9375rem] leading-6 text-ink-2">{typo(locale, identity.role[locale])}</p>
          <p className="mt-2 max-w-[40ch] text-[0.9375rem] leading-6 text-ink-2">{typo(locale, profile.availability[locale])}</p>
        </div>
        <nav aria-label={ui.nav.footer[locale]} className="lg:col-span-3 lg:col-start-6">
          <ul className="grid grid-cols-2 gap-x-6">
            {pages.map((item) => (
              <li key={item.path}>
                <Link
                  href={href(locale, item.path)}
                  className="t-ui flex min-h-11 items-center text-ink-2 decoration-accent decoration-2 underline-offset-[6px] hover:text-ink hover:underline"
                >
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-3 lg:col-start-10">
          {links.length > 0 && (
            <ul className="mb-4">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.href}
                    className="t-ui flex min-h-11 items-center text-ink decoration-accent decoration-2 underline-offset-[6px] hover:underline"
                    rel="noopener noreferrer"
                    target={l.id === "email" ? undefined : "_blank"}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="t-meta max-w-[34ch]">{typo(locale, ui.footer.colophon[locale])}</p>
        </div>
      </div>
      <p className="t-meta mt-10 lg:mt-12">
        © {new Date().getUTCFullYear()} {profile.name}
      </p>
    </footer>
  );
}
