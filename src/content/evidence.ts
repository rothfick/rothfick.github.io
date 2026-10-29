import type { Localized } from "@/lib/i18n";

/**
 * Verification results for Learning OS, recorded from an actual local run.
 * Update these numbers only by re-running the suites — never by estimate.
 *
 *   pnpm exec vitest run                       → 5 files, 78 tests passed
 *   pnpm exec vitest run evals                 → 2 files, 7 tests passed
 *   pnpm exec tsc --noEmit / pnpm exec eslint .→ clean
 *   pnpm build                                 → passed (Next.js 16.4.3)
 *   E2E_PRODUCTION=1 pnpm exec playwright test → 20 tests: 12 passed, 8 failed
 */
export const learningOsRun = {
  date: "2026-10-29",
  suites: [
    {
      id: "unit",
      label: { en: "Unit, integration & eval tests", pl: "Testy jednostkowe, integracyjne i ewaluacyjne" },
      passed: 78,
      total: 78,
      detail: {
        en: "Vitest · 5 files: core engine, cleanup & persistence, localization, false-mastery evals, regression evals",
        pl: "Vitest · 5 plików: rdzeń silnika, czyszczenie i zapis, lokalizacja, ewaluacje fałszywego opanowania, ewaluacje regresji",
      },
    },
    {
      id: "evals",
      label: { en: "Eval checks (subset)", pl: "Testy ewaluacyjne (podzbiór)" },
      passed: 7,
      total: 7,
      detail: {
        en: "3 false-mastery checks + 4 grading regression fixtures",
        pl: "3 testy fałszywego opanowania + 4 fikstury regresji oceniania",
      },
    },
    {
      id: "e2e",
      label: { en: "Browser tests (production build)", pl: "Testy w przeglądarce (build produkcyjny)" },
      passed: 12,
      total: 20,
      failNote: {
        en: "7 in the new EN/PL localization suite; 1 feature-control test that cannot find the “Enable it in Settings” link.",
        pl: "7 w nowym zestawie lokalizacji EN/PL; 1 test flagi funkcji, który nie znajduje linku „Enable it in Settings”.",
      },
      detail: {
        en: "Playwright · Chromium · 2 files: the main learning flows (12 tests) and the newer EN/PL localization suite (8 tests).",
        pl: "Playwright · Chromium · 2 pliki: główne przepływy nauki (12 testów) i nowszy zestaw lokalizacji EN/PL (8 testów).",
      },
    },
  ],
  checks: {
    en: ["Strict typecheck: clean", "ESLint: clean", "Production build: passed"],
    pl: ["Ścisłe sprawdzanie typów: bez błędów", "ESLint: bez błędów", "Build produkcyjny: zaliczony"],
  },
} satisfies {
  date: string;
  suites: { id: string; label: Localized; passed: number; total: number; detail: Localized; failNote?: Localized }[];
  checks: Localized<string[]>;
};
