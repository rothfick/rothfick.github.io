import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { ui } from "@/content/ui";
import type { GuardState, ProjectStatus } from "@/content/types";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";

const arrows = { down: ArrowDown, right: ArrowRight, external: ArrowUpRight };

/**
 * Primary: ink at rest, ultramarine on hover — at most one per view.
 * Secondary: outlined. On phones `block` makes the button full width.
 */
export function ButtonLink({
  href,
  children,
  arrow = "right",
  variant = "primary",
  block,
  className,
}: {
  href: string;
  children: ReactNode;
  arrow?: keyof typeof arrows;
  variant?: "primary" | "secondary";
  block?: boolean;
  className?: string;
}) {
  const Icon = arrows[arrow];
  const classes = cn(
    "group inline-flex h-12 items-center gap-3 rounded-[2px] px-[22px] text-base font-semibold leading-5 transition-colors duration-150",
    variant === "primary" && "bg-ink text-paper hover:bg-accent hover:text-accent-ink active:bg-accent-press",
    variant === "secondary" && "border border-line-strong text-ink hover:border-ink hover:bg-paper-dim active:bg-stone",
    block && "w-full justify-between max-sm:h-[52px] sm:w-auto sm:justify-start",
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      <Icon
        aria-hidden
        strokeWidth={1.5}
        className={cn(
          "size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-150",
          arrow === "down" ? "motion-safe:group-hover:translate-y-[3px]" : "motion-safe:group-hover:translate-x-[3px]",
        )}
      />
    </>
  );
  if (arrow === "external")
    return (
      <a href={href} className={classes} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">
        {content}
      </a>
    );
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

/** "Read the case study →": ink text on a 2px ultramarine underline. */
export function ActionLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const classes = cn(
    "group inline-block min-h-11 py-2.5 text-base font-semibold leading-6 text-ink underline decoration-accent decoration-2 underline-offset-[6px]",
    "transition-colors duration-150 hover:text-accent active:text-accent-press",
    className,
  );
  const content = (
    <>
      {children}
      {/* No break opportunity before this span, so the arrow stays with the last word. */}
      <span aria-hidden className="whitespace-nowrap">
        {"\u00a0"}
        <Icon
          strokeWidth={1.75}
          className="inline-block size-4 align-[-0.15em] motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-[3px]"
        />
      </span>
    </>
  );
  if (external)
    return (
      <a href={href} className={classes} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">
        {content}
      </a>
    );
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export type MarkerShape = "filled" | "half" | "ring" | "dashed" | "cross" | "partial";

const statusShape: Record<ProjectStatus, MarkerShape> = {
  "working-mvp": "filled",
  completed: "filled",
  "active-development": "half",
  "engineering-lab": "ring",
  "engineering-project": "ring",
  coursework: "ring",
  research: "ring",
  "architecture-poc": "dashed",
};

export const guardShape: Record<GuardState, MarkerShape> = {
  verified: "filled",
  partial: "partial",
  designed: "dashed",
  open: "cross",
};

export function shapeForStatus(status: ProjectStatus): MarkerShape {
  return statusShape[status];
}

/** A 10×10 shape that always travels with a text label. */
export function StatusMarker({ shape, className }: { shape: MarkerShape; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 10 10" width="10" height="10" className={cn("inline-block shrink-0 overflow-visible", className)}>
      {shape === "filled" && <circle cx="5" cy="5" r="4.5" className="fill-pass" />}
      {shape === "half" && (
        <>
          <path d="M5 0.75 A4.25 4.25 0 0 0 5 9.25 Z" className="fill-ink" />
          <circle cx="5" cy="5" r="4.25" className="fill-none stroke-ink" strokeWidth="1.5" />
        </>
      )}
      {shape === "partial" && (
        <>
          <path d="M5 0.75 A4.25 4.25 0 0 0 5 9.25 Z" className="fill-partial" />
          <circle cx="5" cy="5" r="4.25" className="fill-none stroke-partial" strokeWidth="1.5" />
        </>
      )}
      {shape === "ring" && <circle cx="5" cy="5" r="4.25" className="fill-none stroke-ink-2" strokeWidth="1.5" />}
      {shape === "dashed" && <circle cx="5" cy="5" r="4.25" className="fill-none stroke-ink-2" strokeWidth="1.5" strokeDasharray="2.2 1.8" />}
      {shape === "cross" && <path d="M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5" className="fill-none stroke-fail" strokeWidth="1.75" strokeLinecap="round" />}
    </svg>
  );
}

/** One marker plus the project's status sentence, e.g. "● Working MVP · in active development". */
export function StatusLine({
  shape,
  text,
  locale,
  className,
}: {
  shape: MarkerShape;
  text: string;
  locale: Locale;
  className?: string;
}) {
  return (
    <p className={cn("flex items-start gap-2 text-[0.9375rem] font-medium leading-[1.4667] text-ink", className)}>
      <span className="sr-only">{ui.project.meta.status[locale]}: </span>
      <StatusMarker shape={shape} className="mt-[6px]" />
      <span>{text}</span>
    </p>
  );
}

/** A bold lead-in at the size of the text it opens: "The problem." */
export function RunIn({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-ink">{children} </span>;
}

/** Shared opening for subpages: H1 and lead in c1–c8, closed by a hairline. */
export function PageOpening({
  title,
  lead,
  children,
  id,
  rule = true,
}: {
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Draw the closing hairline (off when the next element brings its own). */
  rule?: boolean;
}) {
  return (
    <header className="page-grid pb-8 pt-8 lg:pb-12 lg:pt-16">
      <div className="lg:col-[2/span_8]">
        <h1 id={id} className="t-h1">
          {title}
        </h1>
        {lead && <p className="t-statement mt-5 max-w-[26em] text-ink">{lead}</p>}
        {children}
      </div>
      {rule && <hr className="mt-8 border-line lg:mt-12" />}
    </header>
  );
}
