import { learningOsRun } from "@/content/evidence";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { formatDate, type Locale } from "@/lib/i18n";
import { typo } from "@/lib/typo";

type Suite = (typeof learningOsRun.suites)[number];

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
}

export function runCaption(locale: Locale) {
  return typo(locale, fill(ui.project.runCaption[locale], { date: formatDate(learningOsRun.date, locale) }));
}

/** 4px bar: solid pass, hatched fail. Decorative; the numbers are in the text. */
export function ResultsBar({ suite, locale }: { suite: Suite; locale: Locale }) {
  const failed = suite.total - suite.passed;
  return (
    <>
      <div aria-hidden className="mt-2 flex h-1 w-full bg-line">
        <span className="bg-pass" style={{ width: `${(suite.passed / suite.total) * 100}%` }} />
        {failed > 0 && <span className="results-fail" style={{ width: `${(failed / suite.total) * 100}%` }} />}
      </div>
      <p className="sr-only">{fill(ui.project.passedOf[locale], { passed: suite.passed, total: suite.total, failed })}</p>
    </>
  );
}

/** "✕ 8 failing — 7 in the new EN/PL localization suite…" in the fail colour. */
export function FailLine({ suite, locale, className }: { suite: Suite; locale: Locale; className?: string }) {
  const failed = suite.total - suite.passed;
  if (failed === 0) return null;
  const note = "failNote" in suite && suite.failNote ? suite.failNote[locale] : undefined;
  return (
    <p className={cn("mt-2 text-sm font-semibold leading-5 text-fail", className)}>
      <span aria-hidden>✕ </span>
      {typo(locale, ui.project.failing(locale, failed))}
      {note && <>{"\u00a0— "}{typo(locale, note)}</>}
    </p>
  );
}

function Fraction({ suite }: { suite: Suite }) {
  return (
    <span className="t-num-xl text-ink">
      {suite.passed}/{suite.total}
    </span>
  );
}

/** Homepage summary: unit/integration/eval and browser suites, same face and size. */
export function ResultsSummary({ locale, className }: { locale: Locale; className?: string }) {
  const suites = learningOsRun.suites.filter((s) => s.id !== "evals");
  return (
    <div className={className}>
      <p className="text-sm font-medium leading-5 text-ink-2">{runCaption(locale)}</p>
      <ul className="mt-3 grid gap-4">
        {suites.map((s) => (
          <li key={s.id}>
            <Fraction suite={s} />
            <p className="mt-1 text-[0.9375rem] leading-[1.4667] text-ink">{typo(locale, s.label[locale])}</p>
            <ResultsBar suite={s} locale={locale} />
            <FailLine suite={s} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Case-study table: every suite with its notes, then the clean checks. */
export function ResultsTable({ locale }: { locale: Locale }) {
  const p = ui.project;
  return (
    <div>
      <table className="w-full border-collapse bg-raised text-left max-sm:block">
        <caption className="mb-3 text-left text-[0.9375rem] font-semibold leading-6 text-ink max-sm:block">{runCaption(locale)}</caption>
        <thead className="max-sm:hidden">
          <tr className="border-b border-line text-sm leading-5 text-ink-2">
            <th scope="col" className="px-4 py-3 font-medium">
              {p.suite[locale]}
            </th>
            <th scope="col" className="w-[38%] px-4 py-3 font-medium">
              {p.result[locale]}
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              {p.notes[locale]}
            </th>
          </tr>
        </thead>
        <tbody className="max-sm:block">
          {learningOsRun.suites.map((s) => (
            <tr key={s.id} className="border-b border-line align-top last:border-0 max-sm:block max-sm:px-4 max-sm:py-4">
              <th scope="row" className="px-4 py-4 text-base font-medium leading-6 text-ink max-sm:block max-sm:p-0">
                {typo(locale, s.label[locale])}
              </th>
              <td className="px-4 py-4 max-sm:block max-sm:px-0 max-sm:pb-0 max-sm:pt-2">
                <span className="nums font-serif text-[2rem] leading-none text-ink">
                  {s.passed}/{s.total}
                </span>
                <ResultsBar suite={s} locale={locale} />
                <FailLine suite={s} locale={locale} />
              </td>
              <td className="px-4 py-4 text-[0.9375rem] leading-6 text-ink-2 max-sm:block max-sm:px-0 max-sm:pb-0 max-sm:pt-2">
                {typo(locale, s.detail[locale])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-4 grid gap-1">
        {learningOsRun.checks[locale].map((c) => (
          <li key={c} className="text-[0.9375rem] leading-6 text-ink">
            <span aria-hidden className="mr-2 text-pass">
              ✓
            </span>
            {typo(locale, c)}
          </li>
        ))}
      </ul>
    </div>
  );
}
