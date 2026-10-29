import type { Localized } from "@/lib/i18n";

/**
 * Aggregate, anonymized background only. No employers, clients, dates,
 * internal systems or job titles tied to companies — by design.
 */
export const background = {
  intro: {
    en: "Before moving deeper into AI engineering, I spent years building and validating production software systems. That is where the habits on this site come from: assume things fail, find out where, and make the check repeatable.",
    pl: "Zanim zająłem się głębiej inżynierią AI, przez lata budowałem i walidowałem produkcyjne systemy oprogramowania. Stąd biorą się nawyki widoczne na tej stronie: zakładać, że coś zawiedzie, ustalić gdzie, i sprawić, żeby sprawdzenie było powtarzalne.",
  },
  facts: [
    { value: { en: "~7 years", pl: "~7 lat" }, label: { en: "in software quality engineering", pl: "w inżynierii jakości oprogramowania" } },
    { value: { en: "~6 years", pl: "~6 lat" }, label: { en: "in test automation", pl: "w automatyzacji testów" } },
    { value: { en: "Senior-level", pl: "Senior" }, label: { en: "QA and automation experience", pl: "doświadczenie w QA i automatyzacji" } },
    { value: { en: "~5 people", pl: "~5 osób" }, label: { en: "automation stream led", pl: "w prowadzonym zespole automatyzacji" } },
  ],
  themes: {
    en: [
      "Production software systems",
      "Distributed systems",
      "API-heavy architectures",
      "Automation framework design",
      "Test architecture",
      "CI/CD and quality gates",
      "Quality strategy",
      "Mentoring and technical leadership",
    ],
    pl: [
      // Lower case: on About the list follows "Główne obszary:" as one sentence.
      "produkcyjne systemy oprogramowania",
      "Systemy rozproszone",
      "Architektury oparte na API",
      "Projektowanie frameworków automatyzacji",
      "Architektura testów",
      "CI/CD i bramki jakości",
      "Strategia jakości",
      "Mentoring i przywództwo techniczne",
    ],
  },
} satisfies {
  intro: Localized;
  facts: { value: Localized; label: Localized }[];
  themes: Localized<string[]>;
};

/** The engineering progression that the site is built around. */
export const progression: { title: Localized; note: Localized }[] = [
  {
    title: { en: "Software quality", pl: "Jakość oprogramowania" },
    note: { en: "How systems fail", pl: "Jak systemy zawodzą" },
  },
  {
    title: { en: "Automation", pl: "Automatyzacja" },
    note: { en: "Making checks repeatable", pl: "Powtarzalne sprawdzanie" },
  },
  {
    title: { en: "Reliability engineering", pl: "Inżynieria niezawodności" },
    note: { en: "Gates, risk, cost of confidence", pl: "Bramki, ryzyko, koszt pewności" },
  },
  {
    title: { en: "AI evaluation", pl: "Ewaluacja AI" },
    note: { en: "Testing probabilistic outputs", pl: "Testowanie wyników probabilistycznych" },
  },
  {
    title: { en: "RAG", pl: "RAG" },
    note: { en: "Retrieval as a measurable system", pl: "Wyszukiwanie jako mierzalny system" },
  },
  {
    title: { en: "AI systems", pl: "Systemy AI" },
    note: { en: "Domain first, model behind a boundary", pl: "Najpierw domena, model w wydzielonej warstwie" },
  },
  {
    title: { en: "Agentic workflows", pl: "Przepływy agentowe" },
    note: { en: "Actions, limits, approval", pl: "Działania, limity, akceptacja" },
  },
];

/** Index of the first progression step that is shown through projects rather than years of practice. */
export const frontierStartsAt = 3;

export const progressionPhases = {
  foundation: { en: "Foundation — years of practice", pl: "Fundament — lata praktyki" },
  frontier: { en: "Frontier — shown through projects", pl: "Nowy obszar — pokazany w projektach" },
} satisfies Record<string, Localized>;
