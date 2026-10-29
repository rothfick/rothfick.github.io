"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/cn";

export interface ContentsSection {
  id: string;
  label: string;
}

/** One rail row: the overview, or a part with its Roman numeral and sections. */
export interface ContentsEntry {
  id: string;
  label: string;
  numeral?: string;
  sections?: ContentsSection[];
}

/**
 * Scroll-spy. The observer tells us when an anchor crosses the band 20–30%
 * down the viewport; the current item is then the last anchor whose top is
 * above the band's lower edge, which is right in both scroll directions.
 * Instant jumps (anchor links under reduced motion) can skip the band, so a
 * frame-throttled scroll listener settles the same computation.
 */
function useActiveId(entries: ContentsEntry[]) {
  const ids = useMemo(() => entries.flatMap((e) => [e.id, ...(e.sections ?? []).map((s) => s.id)]), [entries]);
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current = ids[0] ?? "";
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };
    const observer = new IntersectionObserver(update, { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((el) => observer.observe(el));
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

/**
 * Arriving with a #section (a link from another page, or the EN/PL switch,
 * which keeps the hash) can leave a long page at the top. Once the fonts are
 * in, so the layout above the target is final, jump to it; its scroll-margin
 * clears the chapter bar. scrollIntoView forces layout itself, so this does
 * not wait for a frame (frames do not run in a background tab).
 */
function useLandOnHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let cancelled = false;
    const land = () => {
      if (cancelled) return;
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    if (document.fonts) void document.fonts.ready.then(land);
    else land();
    return () => {
      cancelled = true;
    };
  }, []);
}

function locate(entries: ContentsEntry[], id: string): { part: ContentsEntry; section?: ContentsSection } {
  for (const entry of entries) {
    if (entry.id === id) return { part: entry };
    const section = entry.sections?.find((s) => s.id === id);
    if (section) return { part: entry, section };
  }
  return { part: entries[0] ?? { id: "", label: "" } };
}

/** Desktop contents rail (≥1024px): sticky, scrolls internally, current item marked. */
export function ContentsRail({ entries, label }: { entries: ContentsEntry[]; label: string }) {
  const active = useActiveId(entries);
  const { part: activePart } = locate(entries, active);
  const navRef = useRef<HTMLElement>(null);

  // Keep the current row inside the rail when the rail itself has to scroll.
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !link) return;
    const top = link.offsetTop; // the sticky nav is the links' offsetParent
    const bottom = top + link.offsetHeight;
    if (top < nav.scrollTop + 48) nav.scrollTop = Math.max(0, top - 48);
    else if (bottom > nav.scrollTop + nav.clientHeight - 24) nav.scrollTop = bottom - nav.clientHeight + 24;
  }, [active]);

  // 36px rows for a mouse; 44px on touch screens (tablets in landscape get the rail).
  const row = "-ml-px flex min-h-9 items-center border-l-2 py-1.5 pointer-coarse:min-h-11 focus-visible:outline-offset-[-2px] motion-safe:transition-colors motion-safe:duration-150 hover:text-ink";
  return (
    <nav ref={navRef} aria-label={label} data-contents className="sticky top-8 max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin]">
      <p className="text-[0.9375rem] font-semibold leading-6 text-ink">{label}</p>
      <ol className="mt-4 border-l border-line">
        {entries.map((entry) => {
          const partCurrent = entry === activePart;
          return (
            <li key={entry.id} className={cn(entry.numeral && "mt-1")}>
              <a
                href={`#${entry.id}`}
                aria-current={active === entry.id ? "location" : undefined}
                className={cn(row, "t-ui pl-4 text-ink", active === entry.id ? "border-accent" : "border-transparent")}
              >
                <span aria-hidden className={cn("nums w-6 shrink-0 font-serif text-base", partCurrent && entry.numeral ? "text-accent" : "text-ink-2")}>
                  {entry.numeral}
                </span>
                {entry.label}
              </a>
              {entry.sections && entry.sections.length > 0 && partCurrent && (
                <ol>
                  {entry.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        aria-current={active === s.id ? "location" : undefined}
                        className={cn(
                          row,
                          "pl-10 text-sm leading-5",
                          active === s.id ? "border-accent font-medium text-ink" : "border-transparent text-ink-2",
                        )}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Phones and tablets (<1024px): a sticky bar naming the current part and
 * section, with a button that opens the contents as a full-height modal sheet.
 */
export function ChapterBar({
  entries,
  labels,
}: {
  entries: ContentsEntry[];
  labels: { contents: string; open: string; close: string };
}) {
  const active = useActiveId(entries);
  const { part, section } = locate(entries, active);
  // The chapter bar is always in the DOM (CSS hides it from 1024px), so it owns the landing.
  useLandOnHash();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigating = useRef(false);
  const titleId = useId();
  const [sheetOpen, setSheetOpen] = useState(false);

  // The page behind the sheet does not scroll while it is open.
  useLayoutEffect(() => {
    if (!sheetOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [sheetOpen]);

  const openSheet = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setSheetOpen(true);
    // Focus without the browser's own scroll (which pins the row to the bottom edge and
    // pushes the header off the top), then bring the current row to the middle.
    const current = dialog.querySelector<HTMLElement>('[aria-current="location"]');
    current?.focus({ preventScroll: true });
    current?.scrollIntoView({ block: "center", behavior: "instant" });
  };

  // Escape, the Close button and a chosen item all end here.
  const onClose = () => {
    setSheetOpen(false);
    if (navigating.current) navigating.current = false;
    else triggerRef.current?.focus();
  };

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigating.current = true;
    // Unlock scrolling synchronously so the jump below is not made on a locked page.
    flushSync(() => setSheetOpen(false));
    dialogRef.current?.close();
    const target = document.getElementById(id);
    if (!target) return;
    const heading = target.matches("h2, h3") ? target : target.querySelector<HTMLElement>("h2, h3");
    target.scrollIntoView({ block: "start" });
    (heading ?? target).focus({ preventScroll: true });
    history.pushState(null, "", `#${id}`);
  };

  const sheetRow = "-ml-px flex min-h-12 items-center border-l-2 py-2";
  return (
    <div data-chapter-bar className="sticky top-0 z-30 border-b border-line bg-raised lg:hidden">
      <div className="page-grid">
        <div className="flex h-12 items-center gap-3">
          <p className="flex min-w-0 flex-1 items-baseline gap-2 leading-6">
            {part.numeral && <span className="nums shrink-0 font-serif text-[1.0625rem] text-accent">{part.numeral}</span>}
            <span className="shrink-0 text-[0.9375rem] font-semibold text-ink">{part.label}</span>
            {section && <span className="min-w-0 truncate text-sm text-ink-2">{section.label}</span>}
          </p>
          <button
            ref={triggerRef}
            type="button"
            aria-label={labels.open}
            aria-haspopup="dialog"
            onClick={openSheet}
            className="group -mr-2 inline-flex h-11 shrink-0 items-center px-2 focus-visible:outline-offset-[-2px]"
          >
            <span className="inline-flex h-8 items-center rounded-[2px] border border-line-strong px-3 text-[0.9375rem] font-medium leading-5 text-ink group-hover:border-ink group-hover:bg-paper-dim">
              {labels.contents}
            </span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={onClose}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none scroll-pb-4 scroll-pt-16 overflow-y-auto overscroll-contain border-0 bg-raised p-0 text-ink backdrop:bg-transparent motion-safe:animate-[fade_160ms_ease-out]"
      >
        {/* The header stays put while the list scrolls under it. */}
        <div className="sticky top-0 z-10 border-b border-line bg-raised">
          <div className="page-grid">
            <div className="flex h-14 items-center justify-between gap-4">
              <p id={titleId} className="text-[0.9375rem] font-semibold leading-6">
                {labels.contents}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="-mr-2 inline-flex h-11 min-w-11 items-center gap-2 rounded-[2px] px-2 text-[0.9375rem] font-medium hover:bg-paper-dim"
              >
                <svg aria-hidden viewBox="0 0 16 16" className="size-4">
                  <path d="M3 3 L13 13 M13 3 L3 13" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {labels.close}
              </button>
            </div>
          </div>
        </div>
        <div className="page-grid">
          <nav aria-labelledby={titleId}>
            <ol className="border-l border-line pb-12 pt-2 [@media(max-height:500px)_and_(min-width:560px)]:columns-2 [@media(max-height:500px)_and_(min-width:560px)]:gap-x-[var(--gap)] [@media(max-height:500px)_and_(min-width:560px)]:border-l-0">
              {entries.map((entry) => (
                <li key={entry.id} className={cn("break-inside-avoid", entry.numeral && "mt-3 border-t border-line pt-1")}>
                  <a
                    href={`#${entry.id}`}
                    onClick={go(entry.id)}
                    aria-current={active === entry.id ? "location" : undefined}
                    className={cn(sheetRow, "pl-4 text-base font-semibold text-ink", active === entry.id ? "border-accent" : "border-transparent")}
                  >
                    <span aria-hidden className={cn("nums w-7 shrink-0 font-serif text-[1.0625rem] font-normal", entry === part && entry.numeral ? "text-accent" : "text-ink-2")}>
                      {entry.numeral}
                    </span>
                    {entry.label}
                  </a>
                  {entry.sections && entry.sections.length > 0 && (
                    <ol>
                      {entry.sections.map((s) => (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            onClick={go(s.id)}
                            aria-current={active === s.id ? "location" : undefined}
                            className={cn(
                              sheetRow,
                              "pl-11 text-[0.9375rem] leading-6",
                              active === s.id ? "border-accent font-medium text-ink" : "border-transparent text-ink-2",
                            )}
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </dialog>
    </div>
  );
}
