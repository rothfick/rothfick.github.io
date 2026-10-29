import Link from "next/link";
import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { href, type Locale } from "@/lib/i18n";
import { LocaleSwitch, MobileMenu, NavLink } from "./client";
import { navItems } from "./nav-items";

export function Header({ locale }: { locale: Locale }) {
  const items = navItems.map((item) => ({ href: href(locale, item.path), label: item.label[locale] }));
  const menuItems = [...items.slice(0, 4), { href: href(locale, "/principles"), label: ui.nav.principles[locale] }, items[4]!];

  return (
    <header data-site-header className="page-grid relative z-40 bg-paper">
      <div className="flex h-14 items-center gap-2 lg:h-16 lg:gap-7">
        <Link
          href={href(locale)}
          aria-label={`${profile.name} — ${ui.nav.home[locale]}`}
          className="mr-auto inline-flex min-h-11 min-w-0 items-center whitespace-nowrap font-serif text-base font-medium tracking-[-0.01em] text-ink min-[360px]:text-lg lg:text-xl"
        >
          {profile.name}
        </Link>

        <nav aria-label={ui.nav.main[locale]} className="hidden lg:block">
          <ul className="flex items-center gap-4">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="t-ui inline-flex min-h-11 min-w-11 items-center justify-center px-1.5">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <span aria-hidden className="hidden h-5 w-px bg-line lg:block" />

        <div className="-mr-1 flex items-center lg:-mr-3">
          <LocaleSwitch locale={locale} label={ui.nav.language[locale]} />
        </div>

        <MobileMenu
          items={menuItems}
          labels={{
            open: ui.nav.openMenu[locale],
            close: ui.nav.closeMenu[locale],
            closeShort: ui.nav.close[locale],
            nav: ui.nav.main[locale],
            menu: ui.nav.menu[locale],
          }}
          footer={profile.availability[locale]}
        />
      </div>
    </header>
  );
}
