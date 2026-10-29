import type { ReactNode } from "react";
import type { FigureKind } from "@/content/diagrams";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";

/**
 * Caption anatomy, the same for every figure on the site:
 * "Fig. N" (accent) · "Title." (ink 600) · kind prefix (ink 600) · caption (ink-2) · source path.
 */
export function FigCaption({
  locale,
  number,
  title,
  kind,
  children,
  source,
  className,
}: {
  locale: Locale;
  number?: number;
  title?: ReactNode;
  kind?: FigureKind;
  children?: ReactNode;
  source?: string;
  className?: string;
}) {
  const prefix = kind && kind !== "architecture" ? ui.figure.kindPrefix[kind][locale] : undefined;
  return (
    <figcaption className={cn("mt-4 max-w-[46ch] text-sm leading-5 text-ink-2", className)}>
      {number !== undefined && (
        <span className="font-semibold text-ink">
          {ui.figure.label[locale]}&nbsp;{number}
          {" "}
        </span>
      )}
      {title && <span className="font-semibold text-ink">{title}. </span>}
      {prefix && <span className="font-semibold text-ink-2">{prefix} </span>}
      {children}
      {source && <span className="mt-1 block font-mono text-[0.8125rem] leading-5 text-ink-2 [overflow-wrap:anywhere]">{source}</span>}
    </figcaption>
  );
}

/** Stone mount for screenshots. Plates hold images only, never text. */
export function Plate({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("bg-stone", className)}>{children}</div>;
}

/** Transparent 1×1 GIF used to stop a gated <picture> variant from downloading. */
export const BLANK_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * A screenshot shown on only one side of 768px. The other side gets a blank
 * source, so the hidden variant never downloads. The PNGs are small and lossy
 * recompression would blur UI text, so they are served as-is.
 */
export function GatedShot({
  src,
  width,
  height,
  alt,
  only,
  priority,
  className,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** "md-up": shown from 768px. "below-md": shown below 768px. */
  only?: "md-up" | "below-md";
  priority?: boolean;
  className?: string;
}) {
  return (
    <picture className={cn(only === "md-up" && "max-md:hidden", only === "below-md" && "md:hidden")}>
      {only === "md-up" && <source media="(max-width: 767px)" srcSet={BLANK_GIF} />}
      {only === "below-md" && <source media="(min-width: 768px)" srcSet={BLANK_GIF} />}
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("w-full outline outline-1 -outline-offset-1 outline-[rgb(29_28_26/0.14)]", className)}
      />
    </picture>
  );
}
