"use client";

import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/cn";

interface Entity {
  id: string;
  name: string;
  def: string;
  fields: string[];
}

/**
 * Interactive domain model: pick an entity to read what it holds.
 * Entities are text toggles (aria-pressed); the pressed one is ink on a 2px
 * ultramarine underline. Field names stay mono because they are identifiers.
 */
export function DomainExplorer({
  groups,
  links,
  labels,
  initial,
}: {
  groups: { id: string; title: string; entities: Entity[] }[];
  links: ReactNode[];
  labels: { selected: string; fields: string };
  initial: string;
}) {
  const [selected, setSelected] = useState(initial);
  const panelId = useId();
  const entity = groups.flatMap((g) => g.entities).find((e) => e.id === selected);

  return (
    <div>
      <div className="grid gap-6 @min-[40rem]:grid-cols-[1fr_1.15fr_1.15fr] @min-[40rem]:gap-x-8 @min-[40rem]:gap-y-0">
        {groups.map((group) => (
          <div key={group.id} className="min-w-0 @min-[40rem]:row-span-2 @min-[40rem]:grid @min-[40rem]:grid-rows-subgrid">
            <p className="border-b border-line pb-2 text-sm font-semibold leading-5 text-ink-2 @min-[40rem]:self-end">{group.title}</p>
            <ul className="mt-1 flex flex-wrap content-start gap-x-5 @min-[40rem]:flex-col @min-[40rem]:items-start">
              {group.entities.map((e) => {
                const active = e.id === selected;
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      aria-controls={panelId}
                      onClick={() => setSelected(e.id)}
                      className={cn(
                        "inline-flex min-h-11 min-w-11 cursor-pointer items-center text-left text-[0.9375rem] font-medium leading-[1.375rem] underline underline-offset-[6px]",
                        "motion-safe:transition-colors motion-safe:duration-150",
                        active ? "text-ink decoration-accent decoration-2" : "text-ink-2 decoration-line-strong decoration-1 hover:text-ink hover:decoration-ink",
                      )}
                    >
                      {e.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <ul className="mt-6 grid gap-1.5 text-sm leading-5 text-ink-2">{links}</ul>

      {entity && (
        <div id={panelId} aria-live="polite" className="mt-6 rounded-[2px] border border-line-strong bg-raised px-4 py-4 @lg:px-5">
          <p className="text-sm font-semibold leading-5 text-ink-2">{labels.selected}</p>
          <p className="mt-1.5 text-[1.0625rem] font-semibold leading-[1.625rem] text-ink">{entity.name}</p>
          <p className="mt-1 max-w-[64ch] text-[0.9375rem] leading-6 text-ink-2">{entity.def}</p>
          <p className="mt-4 text-sm font-semibold leading-5 text-ink-2">{labels.fields}</p>
          <ul className="mt-1.5 grid max-w-[36rem] gap-x-8 gap-y-1 @lg:grid-cols-2">
            {entity.fields.map((f) => (
              <li key={f} className="font-mono text-[0.8125rem] leading-5 text-ink [overflow-wrap:anywhere]">
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
