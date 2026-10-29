"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { locales, switchLocalePath, type Locale } from "@/lib/i18n";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "decoration-accent decoration-2 underline-offset-[6px] transition-colors duration-150 hover:text-ink",
        active ? "text-ink underline" : "text-ink-2",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** EN / PL as two 44px text targets. Switching keeps the page, query string and anchor. */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      <ul className="flex items-center">
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={switchLocalePath(pathname, l)}
              onClick={(event) => {
                // Keep native new-tab gestures; otherwise carry query and hash across.
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                window.location.assign(switchLocalePath(window.location.pathname, l) + window.location.search + window.location.hash);
              }}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              className={cn(
                // The two-letter codes are the only uppercase text on the site.
                "flex size-11 items-center justify-center text-sm font-medium uppercase decoration-[1.5px] underline-offset-[5px] transition-colors duration-150",
                l === locale ? "text-ink underline decoration-accent" : "text-ink-2 hover:text-ink",
              )}
            >
              <span aria-hidden>{l}</span>
              <span className="sr-only">{l === "en" ? "English" : "Polski"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function MobileMenu({
  items,
  labels,
  footer,
}: {
  items: { href: string; label: string }[];
  labels: { open: string; close: string; nav: string; menu: string; closeShort: string };
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  // The header is static, so the panel starts at its current bottom edge, measured on open.
  const [panelTop, setPanelTop] = useState(56);
  const open = openOn === pathname;
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current || !toggleRef.current) return;
      // Keep Tab cycling between the toggle and the links in the panel.
      const focusables = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")];
      const i = focusables.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? focusables.length - 1 : i - 1) : i === focusables.length - 1 ? 0 : i + 1;
      e.preventDefault();
      focusables[next]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        ref={toggleRef}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => {
          if (!open) setPanelTop(Math.max(0, Math.round(toggleRef.current?.closest("header")?.getBoundingClientRect().bottom ?? 56)));
          setOpenOn(open ? null : pathname);
        }}
        className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-[2px] px-2 text-sm font-medium text-ink hover:bg-paper-dim"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-4">
          {open ? (
            <path d="M3 3 L13 13 M13 3 L3 13" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M2 5.5 H14 M2 10.5 H14" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
        <span className="max-[379px]:sr-only">{open ? labels.closeShort : labels.menu}</span>
      </button>
      <div
        id={panelId}
        ref={panelRef}
        hidden={!open}
        style={{ top: panelTop }}
        className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-line bg-raised motion-safe:animate-[fade_160ms_ease-out]"
      >
        <nav aria-label={labels.nav} className="px-[var(--pad)] pb-10 pt-4">
          <ul className="[@media(max-height:500px)]:grid [@media(max-height:500px)]:grid-cols-2 [@media(max-height:500px)]:gap-x-[var(--gap)]">
            {items.map((item) => (
              <li key={item.href} className="border-b border-line">
                <NavLink
                  href={item.href}
                  className="flex min-h-14 items-center py-2 font-serif text-[2rem] leading-10 text-ink [@media(max-height:500px)]:min-h-12 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-2xl [@media(max-height:500px)]:leading-8"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {footer && <div className="t-meta pt-6 [@media(max-height:500px)]:pt-3">{footer}</div>}
        </nav>
      </div>
    </div>
  );
}
