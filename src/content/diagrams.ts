import type { Localized } from "@/lib/i18n";
import type { DiagramKey } from "./types";

/** Figure titles and captions, shared by every diagram frame. */
/** architecture: drawn from the real code. method / concept / design: honest prefixes in captions. */
export type FigureKind = "architecture" | "method" | "concept" | "design";

export const figures: Record<DiagramKey, { title: Localized; caption: Localized; kind: FigureKind; source?: string }> = {
  "lo-domain": {
    kind: "architecture",
    title: { en: "Domain model", pl: "Model domeny" },
    caption: {
      en: "Sources and shared curriculum on the left, learner-scoped state on the right. Select an entity to see what it holds.",
      pl: "Źródła i wspólny program po lewej, stan przypisany do ucznia po prawej. Wybierz encję, żeby zobaczyć, co przechowuje.",
    },
    source: "packages/domain",
  },
  "lo-loop": {
    kind: "architecture",
    title: { en: "Core loop", pl: "Główna pętla" },
    caption: {
      en: "One attempt, one transaction. Function names are the real entry points.",
      pl: "Jedna odpowiedź, jedna transakcja. Nazwy funkcji to prawdziwe punkty wejścia.",
    },
    source: "packages/data/src/attempts.ts",
  },
  "lo-ladder": {
    kind: "architecture",
    title: { en: "Mastery states", pl: "Stany opanowania" },
    caption: {
      en: "Evaluated from the top down. Thresholds are the actual values in the engine.",
      pl: "Sprawdzane od najwyższego. Progi to rzeczywiste wartości z silnika.",
    },
    source: "packages/learning-engine",
  },
  "lo-architecture": {
    kind: "architecture",
    title: { en: "System architecture", pl: "Architektura systemu" },
    caption: {
      en: "Seven workspace packages. Arrows show dependency direction; dashed boxes are contracts without implementations.",
      pl: "Siedem pakietów w monorepo. Strzałki pokazują kierunek zależności; przerywane ramki to kontrakty bez implementacji.",
    },
    source: "docs/ARCHITECTURE.md",
  },
  "eval-pipeline": {
    kind: "method",
    title: { en: "Evaluation pipeline", pl: "Potok ewaluacji" },
    caption: {
      en: "Every case follows the production path; evaluators score the retrieved context and the response separately.",
      pl: "Każdy przypadek przechodzi ścieżkę produkcyjną; ewaluatory oceniają osobno pobrany kontekst i odpowiedź.",
    },
  },
  "eval-regression": {
    kind: "method",
    title: { en: "Regression gate", pl: "Bramka regresji" },
    caption: {
      en: "A change is accepted only against a recorded baseline.",
      pl: "Zmiana jest przyjmowana tylko względem zapisanej linii bazowej.",
    },
  },
  "eval-evaluators": {
    kind: "method",
    title: { en: "Evaluator types", pl: "Rodzaje ewaluatorów" },
    caption: {
      en: "Each type covers a different blind spot. Cost and speed are relative, qualitative comparisons.",
      pl: "Każdy rodzaj pokrywa inne martwe pole. Koszt i szybkość to względne, jakościowe porównania.",
    },
  },
  "qa-tiers": {
    kind: "concept",
    title: { en: "Quality tiers", pl: "Poziomy jakości" },
    caption: {
      en: "Where each tier probes a generic event-driven system. Topology is illustrative and anonymized.",
      pl: "Miejsca, w których każdy poziom sprawdza przykładowy system zdarzeniowy. Topologia jest poglądowa i zanonimizowana.",
    },
  },
  "qa-cadence": {
    kind: "concept",
    title: { en: "Execution strategy", pl: "Strategia wykonania" },
    caption: {
      en: "Confidence and execution cost rise together. Bars are relative and qualitative — no measurements implied.",
      pl: "Pewność i koszt wykonania rosną razem. Słupki są względne i jakościowe — nie przedstawiają pomiarów.",
    },
  },
  "resilience-matrix": {
    kind: "concept",
    title: { en: "Execution matrix", pl: "Macierz wykonania" },
    caption: {
      en: "How the framework's suites combine scenarios with conditions. Cells describe what is asserted; no results are published.",
      pl: "Jak zestawy frameworka łączą scenariusze z warunkami. Komórki opisują, co jest sprawdzane; wyniki nie są publikowane.",
    },
  },
  "agent-loop": {
    kind: "design",
    title: { en: "Agent execution loop", pl: "Pętla wykonania agenta" },
    caption: {
      en: "Every result passes an evaluator before the run continues, replans, asks a human or completes.",
      pl: "Każdy wynik przechodzi przez ewaluator, zanim przebieg będzie kontynuowany, zaplanowany od nowa, przekazany człowiekowi lub zakończony.",
    },
  },
};

export interface DomainEntity {
  id: string;
  name: Localized;
  def: Localized;
  fields: string[];
}

export const domainModel = {
  groups: [
    {
      id: "sources",
      title: { en: "Sources", pl: "Źródła" },
      entities: ["source", "version"],
    },
    {
      id: "curriculum",
      title: { en: "Shared curriculum", pl: "Wspólny program" },
      entities: ["course", "topic", "objective", "atom", "requirement"],
    },
    {
      id: "learner",
      title: { en: "Learner-scoped · (tenant, user)", pl: "Stan ucznia · (tenant, użytkownik)" },
      entities: ["attempt", "evidence", "state", "misconception", "session"],
    },
  ] satisfies { id: string; title: Localized; entities: string[] }[],
  links: [
    { en: "Knowledge Atom → cites → Source Version (sourceId · versionId · locator)", pl: "Atom wiedzy → cytuje → wersję źródła (sourceId · versionId · locator)" },
    { en: "Attempt → answers → Knowledge Atom", pl: "Odpowiedź → dotyczy → atomu wiedzy" },
    { en: "Assessment Requirement → covers → Knowledge Atoms", pl: "Wymaganie egzaminacyjne → obejmuje → atomy wiedzy" },
  ] satisfies Localized[],
  selectHint: { en: "Selected entity", pl: "Wybrana encja" },
  fieldsLabel: { en: "Key fields", pl: "Kluczowe pola" },
  entities: [
    {
      id: "source",
      name: { en: "Source", pl: "Źródło" },
      def: {
        en: "Imported material with a truth context — exam truth or industry truth — and a status: current, legacy, to-verify, conflicting or external-current.",
        pl: "Zaimportowany materiał z kontekstem prawdy — wymagania egzaminu lub praktyka branżowa — i statusem: aktualne, przestarzałe, do weryfikacji, sprzeczne lub zewnętrzne aktualne.",
      },
      fields: ["truth", "status", "conflicts"],
    },
    {
      id: "version",
      name: { en: "Source Version", pl: "Wersja źródła" },
      def: {
        en: "An immutable snapshot of a source's normalized text, identified by a SHA-256 checksum. Citations point here, not to the mutable source.",
        pl: "Niezmienna migawka znormalizowanego tekstu źródła, identyfikowana sumą SHA-256. Cytaty wskazują tutaj, a nie na zmienne źródło.",
      },
      fields: ["sourceId", "checksum", "text", "importedAt"],
    },
    {
      id: "course",
      name: { en: "Course", pl: "Kurs" },
      def: {
        en: "The top of the shared curriculum hierarchy. Topics belong to a course; assessment requirements describe its coverage.",
        pl: "Szczyt wspólnej hierarchii programu. Tematy należą do kursu; wymagania egzaminacyjne opisują jego zakres.",
      },
      fields: ["id", "title", "topics"],
    },
    {
      id: "topic",
      name: { en: "Topic", pl: "Temat" },
      def: {
        en: "A section of a course. Learning objectives and knowledge atoms are bound to a topic.",
        pl: "Część kursu. Cele kształcenia i atomy wiedzy są przypisane do tematu.",
      },
      fields: ["id", "courseId", "title"],
    },
    {
      id: "objective",
      name: { en: "Learning Objective", pl: "Cel kształcenia" },
      def: {
        en: "A topic-bound competency the learner should be able to demonstrate.",
        pl: "Przypisana do tematu kompetencja, którą uczeń powinien umieć wykazać.",
      },
      fields: ["id", "topicId", "dimension"],
    },
    {
      id: "atom",
      name: { en: "Knowledge Atom", pl: "Atom wiedzy" },
      def: {
        en: "The smallest independently assessable concept: a question, a rubric of expected terms, prerequisites, related atoms, a difficulty from 1 to 5 and at least one citation.",
        pl: "Najmniejsze pojęcie, które da się ocenić samodzielnie: pytanie, rubryka oczekiwanych terminów, wymagania wstępne, powiązane atomy, trudność od 1 do 5 i co najmniej jeden cytat.",
      },
      fields: ["question", "rubric[]", "prerequisiteIds[]", "relatedIds[]", "citations[] (min 1)", "difficulty 1–5"],
    },
    {
      id: "requirement",
      name: { en: "Assessment Requirement", pl: "Wymaganie egzaminacyjne" },
      def: {
        en: "Course coverage for an assessment: which atoms are required, which are teacher-important, the target and its provenance.",
        pl: "Zakres kursu dla egzaminu: które atomy są wymagane, które wskazał prowadzący, cel i pochodzenie wymagań.",
      },
      fields: ["atomIds[]", "teacherImportantIds[]", "target", "provenance"],
    },
    {
      id: "attempt",
      name: { en: "Attempt", pl: "Odpowiedź" },
      def: {
        en: "The learner's answer to an atom's question, written from memory, with session, score, feedback and timestamp.",
        pl: "Odpowiedź ucznia na pytanie atomu, napisana z pamięci, z sesją, wynikiem, informacją zwrotną i znacznikiem czasu.",
      },
      fields: ["atomId", "answer", "score", "feedback", "createdAt"],
    },
    {
      id: "evidence",
      name: { en: "Evidence", pl: "Dowód" },
      def: {
        en: "Typed proof for one atom and one dimension, with a score, a verifier, a delay and citations. Who verified it decides what it can unlock.",
        pl: "Typowane potwierdzenie dla jednego atomu i jednego wymiaru, z wynikiem, weryfikatorem, odroczeniem i cytatami. To, kto je zweryfikował, decyduje, co może odblokować.",
      },
      fields: ["dimension", "score 0–1", "verifiedBy: fake | keyword | model | human | test", "delayDays", "citations[]"],
    },
    {
      id: "state",
      name: { en: "Learning State", pl: "Stan nauki" },
      def: {
        en: "Per-learner mastery for one atom: the state, five dimension scores, the evidence it rests on and the next review date. Never shared between learners.",
        pl: "Opanowanie jednego atomu przez jednego ucznia: stan, wyniki w pięciu wymiarach, dowody, na których się opiera, i termin powtórki. Nigdy nie jest współdzielony.",
      },
      fields: ["mastery", "scores{5}", "evidenceIds[]", "nextReviewAt"],
    },
    {
      id: "misconception",
      name: { en: "Misconception", pl: "Błędne przekonanie" },
      def: {
        en: "A recurring wrong belief with a lifecycle: recurrence count, correction history and a delayed retest before it can be verified as fixed.",
        pl: "Powracające błędne przekonanie z cyklem życia: licznik nawrotów, historia korekt i odroczony test, zanim zostanie uznane za naprawione.",
      },
      fields: ["status", "recurrenceCount", "correctionAttempts", "retestAt"],
    },
    {
      id: "session",
      name: { en: "Learning Session", pl: "Sesja nauki" },
      def: {
        en: "A strict state machine around one attempt: QUESTION → ATTEMPTED → GRADED → COMPLETED.",
        pl: "Ścisła maszyna stanów wokół jednej odpowiedzi: QUESTION → ATTEMPTED → GRADED → COMPLETED.",
      },
      fields: ["status", "attemptId", "startedAt"],
    },
  ] satisfies DomainEntity[],
};

export const loopDiagram = {
  steps: [
    {
      name: { en: "Attempt", pl: "Odpowiedź" },
      fn: "submitAttempt()",
      note: {
        en: "Learner, feature flag and a 1–12,000 character answer are checked first.",
        pl: "Najpierw sprawdzane są uczeń, flaga funkcji i odpowiedź o długości 1–12 000 znaków.",
      },
    },
    {
      name: { en: "Grading", pl: "Ocena" },
      fn: "ModelGateway.grade()",
      note: {
        en: "Output is schema-validated; every citation must resolve to the task's sources.",
        pl: "Wynik jest walidowany schematem; każdy cytat musi wskazywać źródła zadania.",
      },
    },
    {
      name: { en: "Evidence", pl: "Dowód" },
      fn: "EvidenceSchema.parse()",
      note: {
        en: "Recorded with its verifier. Keyword evidence stays provisional.",
        pl: "Zapisany razem z weryfikatorem. Dowód z dopasowania słów pozostaje tymczasowy.",
      },
    },
    {
      name: { en: "Mastery update", pl: "Aktualizacja opanowania" },
      fn: "evaluateMastery()",
      note: {
        en: "Mean of the latest three records per dimension, then gated states.",
        pl: "Średnia z trzech najnowszych dowodów w każdym wymiarze, potem stany z bramkami.",
      },
    },
    {
      name: { en: "Review scheduling", pl: "Planowanie powtórki" },
      fn: "scheduleReview()",
      note: {
        en: "Fail → tomorrow. Pass → interval from score, retention and difficulty.",
        pl: "Porażka → jutro. Sukces → odstęp zależny od wyniku, utrwalenia i trudności.",
      },
    },
  ],
  transaction: {
    en: "store.transaction() — Attempt, Evidence, Learning State, Session and Usage are committed together, or not at all.",
    pl: "store.transaction() — odpowiedź, dowód, stan nauki, sesja i rekord użycia są zapisywane razem albo wcale.",
  },
  loop: {
    en: "When nextReviewAt ≤ now, the atom returns to the daily mission.",
    pl: "Gdy nextReviewAt ≤ teraz, atom wraca do misji dnia.",
  },
} satisfies {
  steps: { name: Localized; fn: string; note: Localized }[];
  transaction: Localized;
  loop: Localized;
};

export const ladderDiagram = {
  states: [
    { id: "EXPOSED", rule: { en: "Default", pl: "Stan domyślny" } },
    { id: "UNDERSTOOD", rule: { en: "explanation ≥ 0.6", pl: "wyjaśnianie ≥ 0,6" } },
    { id: "RECALLED", rule: { en: "recall ≥ 0.7", pl: "przypominanie ≥ 0,7" } },
    { id: "APPLIED", rule: { en: "application ≥ 0.7", pl: "zastosowanie ≥ 0,7" } },
    {
      id: "VERIFIED",
      rule: {
        en: "verified practical work · application & recall ≥ 0.8",
        pl: "zweryfikowana praca praktyczna · zastosowanie i przypominanie ≥ 0,8",
      },
    },
    {
      id: "MASTERED",
      rule: {
        en: "all 5 dimensions ≥ 0.8 · verified practical, transfer and delayed recall ≥ 7 days",
        pl: "wszystkie 5 wymiarów ≥ 0,8 · zweryfikowana praktyka, transfer i odroczone przypomnienie ≥ 7 dni",
      },
    },
  ],
  gate: {
    en: "Trust gate: beyond APPLIED, a human- or test-verified practical result (≥ 0.8) is required.",
    pl: "Bramka zaufania: powyżej APPLIED wymagany jest wynik praktyczny ≥ 0,8 zweryfikowany przez człowieka lub test.",
  },
  dimensions: {
    en: "Dimensions: recall · explanation · application · transfer · retention",
    pl: "Wymiary: przypominanie · wyjaśnianie · zastosowanie · transfer · utrwalenie",
  },
} satisfies { states: { id: string; rule: Localized }[]; gate: Localized; dimensions: Localized };

export const architectureDiagram = {
  layers: [
    {
      id: "web",
      name: "apps/web",
      note: { en: "Next.js routes · authoring forms · staged mutations · recovery UI", pl: "Widoki Next.js · formularze · przygotowane mutacje · ekran odzyskiwania" },
    },
    {
      id: "data",
      name: "packages/data",
      note: { en: "LocalStore · repositories · snapshot validation · attempt transaction", pl: "LocalStore · repozytoria · walidacja migawek · transakcja odpowiedzi" },
    },
  ],
  middle: [
    { id: "ai", name: "packages/ai", note: { en: "ModelGateway · providers · eval contract", pl: "ModelGateway · dostawcy · kontrakt ewaluacji" } },
    {
      id: "engine",
      name: "packages/learning-engine",
      note: { en: "Pure policies: mastery, review, misconceptions, readiness, missions", pl: "Czyste reguły: opanowanie, powtórki, błędne przekonania, gotowość, misje" },
    },
  ],
  domain: {
    id: "domain",
    name: "packages/domain",
    note: { en: "Zod entities · scope invariants · citations", pl: "Encje Zod · niezmienniki zakresu · cytaty" },
  },
  side: [
    { id: "ingestion", name: "packages/ingestion", note: { en: "TXT / MD adapters (Node + browser) · SHA-256", pl: "Adaptery TXT / MD (Node + przeglądarka) · SHA-256" } },
    { id: "config", name: "packages/config", note: { en: "Feature & cost policy · adapter contracts", pl: "Polityka funkcji i kosztów · kontrakty adapterów" } },
    { id: "ui", name: "packages/ui", note: { en: "Presentation primitives", pl: "Prymitywy prezentacji" } },
  ],
  sideLabel: { en: "Adapters & policy", pl: "Adaptery i polityka" },
  nextLabel: { en: "Next — contracts exist, implementations deferred", pl: "Dalej — kontrakty istnieją, implementacje odłożone" },
  adapters: ["AuthAdapter", "StorageAdapter", "RetrievalAdapter", "WorkflowAdapter", "ObservabilityAdapter"],
} satisfies {
  layers: { id: string; name: string; note: Localized }[];
  middle: { id: string; name: string; note: Localized }[];
  domain: { id: string; name: string; note: Localized };
  side: { id: string; name: string; note: Localized }[];
  sideLabel: Localized;
  nextLabel: Localized;
  adapters: string[];
};

export const evalPipelineDiagram = {
  stages: [
    { name: { en: "Evaluation dataset", pl: "Zbiór ewaluacyjny" }, note: { en: "Versioned cases and slices", pl: "Wersjonowane przypadki i wycinki" } },
    { name: { en: "Query", pl: "Zapytanie" }, note: { en: "Real or adversarial input", pl: "Wejście realne lub adwersaryjne" } },
    { name: { en: "Retrieval", pl: "Wyszukiwanie" }, note: { en: "Context + source versions", pl: "Kontekst + wersje źródeł" } },
    { name: { en: "LLM", pl: "LLM" }, note: { en: "Prompt and model, both versioned", pl: "Prompt i model, oba wersjonowane" } },
    { name: { en: "Response", pl: "Odpowiedź" }, note: { en: "Structured output + citations", pl: "Ustrukturyzowany wynik + cytaty" } },
    { name: { en: "Automated evaluators", pl: "Automatyczne ewaluatory" }, note: { en: "Score context and answer separately", pl: "Oceniają osobno kontekst i odpowiedź" } },
    { name: { en: "Metrics", pl: "Metryki" }, note: { en: "Per dimension and per slice", pl: "Dla każdego wymiaru i wycinka" } },
    { name: { en: "Regression decision", pl: "Decyzja regresyjna" }, note: { en: "Accept or reject vs. baseline", pl: "Akceptacja lub odrzucenie vs. linia bazowa" } },
  ],
  contextTap: { en: "context", pl: "kontekst" },
  answerTap: { en: "answer", pl: "odpowiedź" },
  dimensionsLabel: { en: "Evaluation dimensions", pl: "Wymiary ewaluacji" },
  dimensions: {
    en: [
      "Correctness",
      "Groundedness",
      "Source relevance",
      "Context relevance",
      "Retrieval quality",
      "Hallucination",
      "Completeness",
      "Structure validity",
      "Tool correctness",
      "Safety",
      "Robustness",
    ],
    pl: [
      "Poprawność",
      "Ugruntowanie",
      "Trafność źródeł",
      "Trafność kontekstu",
      "Jakość wyszukiwania",
      "Halucynacje",
      "Kompletność",
      "Poprawność struktury",
      "Poprawność narzędzi",
      "Bezpieczeństwo",
      "Odporność",
    ],
  },
} satisfies {
  stages: { name: Localized; note: Localized }[];
  contextTap: Localized;
  answerTap: Localized;
  dimensionsLabel: Localized;
  dimensions: Localized<string[]>;
};

export const regressionDiagram = {
  baseline: { name: { en: "Baseline", pl: "Linia bazowa" }, note: { en: "Recorded results of the current version", pl: "Zapisane wyniki obecnej wersji" } },
  change: { name: { en: "Candidate change", pl: "Zmiana kandydująca" }, note: { en: "Prompt · model · retrieval parameters", pl: "Prompt · model · parametry wyszukiwania" } },
  suite: { name: { en: "Evaluation suite", pl: "Zestaw ewaluacyjny" }, note: { en: "Same dataset, same evaluators", pl: "Ten sam zbiór, te same ewaluatory" } },
  compare: { name: { en: "Compare", pl: "Porównanie" }, note: { en: "Per dimension and per slice", pl: "Dla każdego wymiaru i wycinka" } },
  accept: { name: { en: "Accept", pl: "Akceptacja" }, note: { en: "Every gate within threshold", pl: "Każda bramka w granicach progu" } },
  reject: { name: { en: "Reject", pl: "Odrzucenie" }, note: { en: "Any gate fails — the change goes back", pl: "Któraś bramka nie przechodzi — zmiana wraca" } },
  policyLabel: {
    en: "Example gate policy — illustrative rules, not measured results",
    pl: "Przykładowa polityka bramki — poglądowe reguły, a nie zmierzone wyniki",
  },
  policy: [
    { gate: { en: "Structure validity", pl: "Poprawność struktury" }, rule: { en: "No new schema failures", pl: "Brak nowych błędów schematu" } },
    { gate: { en: "Critical cases", pl: "Przypadki krytyczne" }, rule: { en: "Every case tagged critical passes", pl: "Każdy przypadek oznaczony jako krytyczny przechodzi" } },
    { gate: { en: "Groundedness", pl: "Ugruntowanie" }, rule: { en: "No drop beyond tolerance on any slice", pl: "Brak spadku poza tolerancję w żadnym wycinku" } },
    { gate: { en: "Retrieval recall", pl: "Recall wyszukiwania" }, rule: { en: "Not below baseline on any slice", pl: "Nie niżej niż linia bazowa w żadnym wycinku" } },
    { gate: { en: "Cost & latency", pl: "Koszt i opóźnienie" }, rule: { en: "Within the declared budget", pl: "W ramach zadeklarowanego budżetu" } },
  ],
} satisfies Record<string, unknown>;

export const evaluatorsDiagram = {
  bestFor: { en: "Best for", pl: "Najlepsze zastosowanie" },
  blindSpot: { en: "Blind spot", pl: "Martwe pole" },
  cost: { en: "Cost", pl: "Koszt" },
  speed: { en: "Speed", pl: "Szybkość" },
  costLevels: {
    low: { en: "Low", pl: "Niski" },
    medium: { en: "Medium", pl: "Średni" },
    high: { en: "High", pl: "Wysoki" },
  },
  speedLevels: {
    fast: { en: "Fast", pl: "Wysoka" },
    medium: { en: "Medium", pl: "Średnia" },
    slow: { en: "Slow", pl: "Niska" },
  },
  types: [
    {
      name: { en: "Deterministic", pl: "Testy deterministyczne" },
      bestFor: {
        en: ["Schemas", "JSON validity", "Expected references", "Required fields", "Tool outputs", "Format rules"],
        pl: ["Schematy", "Poprawność JSON", "Oczekiwane referencje", "Wymagane pola", "Wyniki narzędzi", "Reguły formatu"],
      },
      blindSpot: {
        en: "Sees structure, not meaning — a well-formed wrong answer passes.",
        pl: "Widzi strukturę, nie znaczenie — poprawnie sformatowana błędna odpowiedź przechodzi.",
      },
      cost: "low",
      speed: "fast",
    },
    {
      name: { en: "LLM-as-a-judge", pl: "LLM w roli sędziego" },
      bestFor: {
        en: ["Relevance", "Quality", "Groundedness", "Semantic correctness"],
        pl: ["Trafność", "Jakość", "Ugruntowanie", "Poprawność semantyczna"],
      },
      blindSpot: {
        en: "Has its own bias and variance; must be calibrated against human labels.",
        pl: "Ma własne uprzedzenia i wariancję; wymaga kalibracji względem ocen ludzi.",
      },
      cost: "medium",
      speed: "medium",
    },
    {
      name: { en: "Retrieval metrics", pl: "Metryki wyszukiwania" },
      bestFor: {
        en: ["Recall", "Precision", "Ranking relevance", "Context relevance"],
        pl: ["Recall", "Precyzja", "Trafność rankingu", "Trafność kontekstu"],
      },
      blindSpot: {
        en: "Needs labeled relevance and says nothing about the final answer.",
        pl: "Wymaga oznaczonej trafności i nic nie mówi o końcowej odpowiedzi.",
      },
      cost: "medium",
      speed: "fast",
    },
    {
      name: { en: "Human evaluation", pl: "Ocena przez ludzi" },
      bestFor: {
        en: ["Cases automation cannot judge", "Calibrating LLM judges", "High-stakes outputs"],
        pl: ["Przypadki, których automat nie oceni", "Kalibracja sędziów LLM", "Wyniki o wysokiej stawce"],
      },
      blindSpot: {
        en: "Slow and expensive; inconsistent between reviewers without clear guidelines.",
        pl: "Wolna i droga; niespójna między recenzentami bez jasnych wytycznych.",
      },
      cost: "high",
      speed: "slow",
    },
  ],
} satisfies Record<string, unknown>;

export const tiersDiagram = {
  tiers: [
    {
      id: "T1",
      name: { en: "Contract validation", pl: "Walidacja kontraktów" },
      scope: { en: "Requests, responses, event payloads", pl: "Żądania, odpowiedzi, treść zdarzeń" },
      runs: { en: "Every change", pl: "przy każdej zmianie" },
    },
    {
      id: "T2",
      name: { en: "API / service validation", pl: "Walidacja API i usług" },
      scope: { en: "One service: rules, errors, state, idempotency", pl: "Jedna usługa: reguły, błędy, stan, idempotentność" },
      runs: { en: "Pull requests", pl: "przy pull requestach" },
    },
    {
      id: "T3",
      name: { en: "Distributed flow validation", pl: "Walidacja przepływów rozproszonych" },
      scope: { en: "Events, ordering, side effects across services", pl: "Zdarzenia, kolejność, efekty uboczne między usługami" },
      runs: { en: "After merge · scheduled", pl: "po scaleniu i według harmonogramu" },
    },
  ],
  runsLabel: { en: "Runs", pl: "Uruchamiane" },
  nodes: {
    client: { en: "API consumer", pl: "Konsument API" },
    serviceA: { en: "Service A", pl: "Usługa A" },
    stream: { en: "Event stream", pl: "Strumień zdarzeń" },
    serviceB: { en: "Service B", pl: "Usługa B" },
    db: { en: "Persistence", pl: "Baza danych" },
    external: { en: "External integration", pl: "Integracja zewnętrzna" },
  },
  flowLabel: { en: "T3 · end-to-end flow", pl: "T3 · przepływ end-to-end" },
} satisfies Record<string, unknown>;

export const cadenceDiagram = {
  stages: [
    { name: { en: "Fast checks", pl: "Szybkie testy" }, when: { en: "Local · every commit", pl: "Lokalnie · każdy commit" }, level: 1 },
    { name: { en: "PR validation", pl: "Walidacja PR" }, when: { en: "Pull request", pl: "Pull request" }, level: 2 },
    { name: { en: "Integration validation", pl: "Walidacja integracyjna" }, when: { en: "After merge", pl: "Po scaleniu" }, level: 3 },
    { name: { en: "Scheduled heavy validation", pl: "Ciężka walidacja wg harmonogramu" }, when: { en: "Nightly · on demand", pl: "W nocy · na żądanie" }, level: 4 },
  ],
  confidence: { en: "Confidence", pl: "Pewność" },
  cost: { en: "Execution cost", pl: "Koszt wykonania" },
} satisfies Record<string, unknown>;

export const matrixDiagram = {
  scenarioLabel: { en: "Scenario", pl: "Scenariusz" },
  conditions: [
    { en: "Baseline network", pl: "Sieć bazowa" },
    { en: "Throttled network", pl: "Ograniczona sieć" },
    { en: "Unstable conditions", pl: "Niestabilne warunki" },
  ],
  rows: [
    {
      scenario: { en: "File upload", pl: "Wysyłanie pliku" },
      cells: [
        { en: "File arrives intact", pl: "Plik dociera w całości" },
        { en: "Progress reported, UI responsive", pl: "Postęp raportowany, UI responsywne" },
        { en: "Fails visibly or recovers — never silently", pl: "Zawodzi jawnie albo wraca do działania — nigdy po cichu" },
      ],
    },
    {
      scenario: { en: "File download", pl: "Pobieranie pliku" },
      cells: [
        { en: "Content verified, not just started", pl: "Zawartość sprawdzona, nie tylko start" },
        { en: "Completes; size and content match", pl: "Kończy się; rozmiar i zawartość się zgadzają" },
        { en: "Partial file detected and reported", pl: "Niepełny plik wykryty i zgłoszony" },
      ],
    },
    {
      scenario: { en: "Core user flows", pl: "Główne ścieżki użytkownika" },
      cells: [
        { en: "Functional assertions", pl: "Asercje funkcjonalne" },
        { en: "Loading states and timeouts as designed", pl: "Stany ładowania i limity zgodne z projektem" },
        { en: "Error states visible and recoverable", pl: "Stany błędów widoczne i odwracalne" },
      ],
    },
  ],
  suiteNote: {
    en: "A TestNG XML suite = test classes × parameters (network profile, grouping, runner configuration).",
    pl: "Zestaw XML TestNG = klasy testów × parametry (profil sieci, grupowanie, konfiguracja runnera).",
  },
} satisfies Record<string, unknown>;

export const agentDiagram = {
  goal: { en: "User goal", pl: "Cel użytkownika" },
  planner: { en: "Planner", pl: "Planista" },
  agent: { en: "Agent", pl: "Agent" },
  tools: { en: "Tools / APIs", pl: "Narzędzia / API" },
  result: { en: "Result", pl: "Wynik" },
  evaluator: { en: "Evaluator", pl: "Ewaluator" },
  human: { en: "Human approval", pl: "Akceptacja człowieka" },
  done: { en: "Completion", pl: "Zakończenie" },
  state: { en: "State & memory", pl: "Stan i pamięć" },
  replan: { en: "fail → replan", pl: "błąd → nowy plan" },
  call: { en: "call / observe", pl: "wywołanie / wynik" },
  pass: { en: "verified", pl: "zweryfikowano" },
  approval: { en: "irreversible / uncertain", pl: "nieodwracalne / niepewne" },
  approved: { en: "approved", pl: "zatwierdzono" },
  guardrailsTitle: { en: "Guardrails", pl: "Zabezpieczenia" },
  guardrails: {
    en: "step & cost budgets · tool allow-list · typed arguments",
    pl: "limity kroków i kosztów · dozwolone narzędzia · typowane argumenty",
  },
  stateNote: { en: "read / write", pl: "odczyt / zapis" },
  trace: {
    en: "Observability: every step, tool call and decision is traced",
    pl: "Obserwowalność: każdy krok, wywołanie narzędzia i decyzja są śledzone",
  },
} satisfies Record<string, Localized>;
