"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * A horizontal scroller that is a keyboard stop (role="region", tabIndex 0,
 * labelled) only while its content overflows. When the content fits, as with
 * code that wraps on phones, it is a plain div and not a dead tab stop.
 * It renders as a region until measured, so without JavaScript overflowing
 * content can still be reached. A ResizeObserver re-checks on every size
 * change, and again once the web fonts are in.
 */
export function ScrollRegion({
  label,
  className,
  style,
  html,
  children,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
  /** Pre-rendered markup (highlighted code), in place of children. */
  html?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let alive = true;
    const check = () => {
      if (alive) setOverflows(el.scrollWidth > el.clientWidth + 1);
    };
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    void document.fonts?.ready.then(check);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  const region = overflows ? { role: "region", tabIndex: 0, "aria-label": label } : {};
  return html !== undefined ? (
    <div ref={ref} {...region} className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <div ref={ref} {...region} className={className} style={style}>
      {children}
    </div>
  );
}
