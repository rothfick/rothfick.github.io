import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SchematicStep {
  /** Plain text, or rich content when a step carries its own glyphs (✓ Accept / ✕ Reject). */
  label: ReactNode;
  /** The gate or emphasised step: set as a small node (ink, semibold, outlined), never in link colour. */
  gate?: boolean;
  /** Leading tag, e.g. "T1": a small outlined tag, like the tier markers in the drawing. */
  mark?: string;
}

/**
 * A drawing reduced to a typographic flow: "A → B → C", built only from
 * diagrams.ts labels. Used on phones and for the compact homepage entries.
 * Arrows sit only between steps: each one opens the step after it, so a row
 * never ends on an arrow (which would read like a link) and a wrapped row
 * starts with one, showing that the flow continues. A rule on the left, the
 * same as the rails of the full drawings, sets it apart from running text.
 */
export function Schematic({ steps, branch, className }: { steps: SchematicStep[]; branch?: ReactNode; className?: string }) {
  return (
    <div className={cn("border-l border-line-strong pl-3.5", className)}>
      <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 text-[0.9375rem] font-medium leading-6 text-ink">
        {steps.map((step, i) => (
          <li key={i} className="inline-flex items-baseline gap-x-2">
            {i > 0 && <ArrowRight aria-hidden className="size-3.5 shrink-0 self-center text-ink-2" strokeWidth={1.75} />}
            <span className={cn("inline-flex items-baseline gap-1.5", step.gate && "rounded-[2px] border border-ink-2 bg-raised px-1.5 font-semibold")}>
              {step.mark && (
                <span className="nums rounded-[2px] border border-line-strong px-1 text-sm font-semibold leading-5 text-ink">{step.mark}</span>
              )}
              <span>{step.label}</span>
            </span>
          </li>
        ))}
      </ol>
      {branch && <p className="mt-1.5 text-sm leading-5 text-ink-2">{branch}</p>}
    </div>
  );
}
