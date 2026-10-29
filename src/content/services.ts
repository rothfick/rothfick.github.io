import type { Localized } from "@/lib/i18n";

export interface Service {
  id: string;
  featured?: boolean;
  title: Localized;
  headline: Localized;
  body: Localized;
  items: Localized<string[]>;
  /** What a client walks away with. */
  outcomes: Localized<string[]>;
  /** Project slug that serves as evidence for this service. */
  evidence: string;
  evidenceLabel: Localized;
  /** Name as used inside the homepage sentence "I help teams with …". */
  inlineName: Localized;
}

export const services: Service[] = [
  {
    id: "ai-quality-audit",
    inlineName: { en: "an AI quality audit", pl: "audycie jakości AI" },
    featured: true,
    title: { en: "AI Quality Audit", pl: "Audyt jakości AI" },
    headline: {
      en: "Find failures before your users do.",
      pl: "Wykryj błędy, zanim trafią do użytkowników.",
    },
    body: {
      en: "I review how your LLM or RAG feature can fail, build an evaluation set from real cases, and set up automated checks so the next prompt, model or retrieval change is accepted on evidence — not on a quick demo.",
      pl: "Analizuję, jak może zawieść twoja funkcja oparta na LLM lub RAG, buduję zbiór ewaluacyjny z prawdziwych przypadków i konfiguruję automatyczne testy, żeby kolejna zmiana promptu, modelu czy wyszukiwania była przyjmowana na podstawie dowodów — a nie szybkiego dema.",
    },
    items: {
      en: [
        "Hallucination and groundedness testing",
        "retrieval evaluation",
        "prompt and model regression",
        "output schema validation",
        "evaluation datasets",
      ],
      // Polish lists after "Zwykle obejmuje:" continue the sentence, so they start in lower case.
      pl: [
        "testy halucynacji i ugruntowania w źródłach",
        "ewaluację wyszukiwania",
        "regresję promptów i modeli",
        "walidację schematu odpowiedzi",
        "zbiory ewaluacyjne",
      ],
    },
    outcomes: {
      en: [
        "A failure-mode review of your feature",
        "A versioned evaluation set seeded from real usage",
        "Automated evaluators with declared thresholds",
        "A regression check wired into your CI",
      ],
      pl: [
        "Analiza trybów awarii twojej funkcji",
        "Wersjonowany zbiór ewaluacyjny oparty na realnym użyciu",
        "Automatyczne ewaluatory z zadeklarowanymi progami",
        "Test regresji podłączony do twojego CI",
      ],
    },
    evidence: "ai-reliability-lab",
    evidenceLabel: { en: "See the AI Reliability Lab", pl: "Zobacz Laboratorium niezawodności AI" },
  },
  {
    id: "ai-automation",
    inlineName: { en: "AI automation", pl: "automatyzacji z AI" },
    title: { en: "AI Automation", pl: "Automatyzacja z AI" },
    headline: {
      en: "Automate the repetitive work.",
      pl: "Zautomatyzuj powtarzalną pracę.",
    },
    body: {
      en: "I start with the workflow, not the model. Deterministic code handles what it can, AI handles what genuinely needs judgment, and a human approves what is uncertain or irreversible.",
      pl: "Zaczynam od procesu, nie od modelu. Kod deterministyczny robi to, co potrafi, AI zajmuje się tym, co naprawdę wymaga oceny, a człowiek zatwierdza to, co niepewne lub nieodwracalne.",
    },
    items: {
      en: ["Document workflows", "email automation", "classification and data extraction", "API workflows", "human approval steps"],
      pl: ["obieg dokumentów", "automatyzację poczty", "klasyfikację i ekstrakcję danych", "przepływy oparte na API", "kroki z akceptacją człowieka"],
    },
    outcomes: {
      en: [
        "A map of which steps are deterministic, AI-assisted or human-approved",
        "A working automation with logging and failure handling",
        "An evaluation set to check it keeps working",
      ],
      pl: [
        "Mapa kroków: deterministyczne, wspierane przez AI, zatwierdzane przez człowieka",
        "Działająca automatyzacja z logowaniem i obsługą błędów",
        "Zbiór ewaluacyjny sprawdzający, że nadal działa",
      ],
    },
    evidence: "agentic-lab",
    evidenceLabel: { en: "See the Agentic Automation Lab", pl: "Zobacz Laboratorium automatyzacji agentowej" },
  },
  {
    id: "rag",
    inlineName: { en: "RAG and internal AI", pl: "budowie systemów RAG i wewnętrznych asystentów AI" },
    title: { en: "RAG & internal AI", pl: "RAG i wewnętrzne AI" },
    headline: {
      en: "Answers you can trace to a source.",
      pl: "Odpowiedzi z weryfikowalnym źródłem.",
    },
    body: {
      en: "Most RAG failures happen before the model writes a word: the wrong passage is retrieved, the right one is missing, or sources conflict. I help teams design retrieval they can measure and answers they can trace back to a source, with retrieval evaluated separately from generation.",
      pl: "Większość błędów RAG dzieje się, zanim model napisze pierwsze słowo: pobrany zostaje zły fragment, brakuje właściwego albo źródła sobie przeczą. Pomagam zespołom zaprojektować mierzalne wyszukiwanie i odpowiedzi, które da się powiązać ze źródłem — oraz oceniać wyszukiwanie osobno od generowania.",
    },
    items: {
      en: ["Documentation assistants", "internal knowledge search", "customer support assistants", "document analysis"],
      pl: ["asystentów dokumentacji", "wyszukiwanie wiedzy wewnętrznej", "asystentów obsługi klienta", "analizę dokumentów"],
    },
    outcomes: {
      en: [
        "Retrieval evaluated separately from generation",
        "Answers with citations to source versions",
        "A regression suite for future changes",
      ],
      pl: [
        "Wyszukiwanie oceniane osobno od generowania",
        "Odpowiedzi z cytatami do wersji źródeł",
        "Zestaw regresji na kolejne zmiany",
      ],
    },
    evidence: "ai-reliability-lab",
    evidenceLabel: { en: "See the evaluation methodology", pl: "Zobacz metodykę ewaluacji" },
  },
  {
    id: "ai-product",
    inlineName: { en: "AI product engineering", pl: "inżynierii produktów AI" },
    title: { en: "AI product engineering", pl: "Inżynieria produktów AI" },
    headline: {
      en: "Build a product with clear AI boundaries.",
      pl: "Zbuduj produkt z kontrolą nad AI.",
    },
    body: {
      en: "I design the domain first, keep core logic testable without a live model, and put AI behind a gateway that validates every output. The product survives model and vendor changes.",
      pl: "Najpierw projektuję domenę, utrzymuję logikę biznesową testowalną bez działającego modelu i umieszczam AI za warstwą, która waliduje każdy wynik. Produkt przetrwa zmianę modelu i dostawcy.",
    },
    items: {
      en: ["Domain modeling", "model gateways", "structured outputs", "cost and feature governance", "test strategy"],
      pl: ["modelowanie domeny", "warstwę dostępu do modeli", "ustrukturyzowane odpowiedzi", "kontrolę kosztów i funkcji", "strategię testów"],
    },
    outcomes: {
      en: ["An architecture with clear AI boundaries", "A working MVP with real tests", "A documented path from local to production"],
      pl: ["Architektura z jasnymi granicami AI", "Działające MVP z prawdziwymi testami", "Udokumentowana ścieżka od lokalnej wersji do produkcji"],
    },
    evidence: "learning-os",
    evidenceLabel: { en: "See Learning OS", pl: "Zobacz Learning OS" },
  },
  {
    id: "automation-architecture",
    inlineName: { en: "automation architecture", pl: "architekturze automatyzacji testów" },
    title: { en: "Automation architecture", pl: "Architektura automatyzacji testów" },
    headline: {
      en: "Repeatable checks for every release.",
      pl: "Powtarzalne testy przy każdym wydaniu.",
    },
    body: {
      en: "Years of building and leading automation work, applied to your stack: test architecture, quality gates and suites that validate the boundaries where systems actually fail.",
      pl: "Lata budowania i prowadzenia automatyzacji testów, zastosowane do twojego stosu technologicznego: architektura testów, bramki jakości i zestawy walidujące granice, na których systemy naprawdę zawodzą.",
    },
    items: {
      en: ["Playwright and Java automation", "API testing", "CI/CD integration", "quality gates", "distributed-system testing"],
      pl: ["automatyzację w Playwright i Javie", "testy API", "integrację z CI/CD", "bramki jakości", "testowanie systemów rozproszonych"],
    },
    outcomes: {
      en: ["A test architecture mapped to risk and cost", "Gates rolled out without blocking teams", "Suites your team can maintain"],
      pl: ["Architektura testów dopasowana do ryzyka i kosztu", "Bramki wdrożone bez blokowania zespołów", "Zestawy, które zespół utrzyma sam"],
    },
    evidence: "distributed-qa",
    evidenceLabel: { en: "See the QA layer for distributed systems", pl: "Zobacz warstwę zapewnienia jakości" },
  },
];

export const engagementSteps: { title: Localized; body: Localized }[] = [
  {
    title: { en: "Map the workflow and its failures", pl: "Mapa procesu i jego awarii" },
    body: {
      en: "What the system does, where it can fail, and what failure would cost.",
      pl: "Co robi system, gdzie może zawieść i ile kosztowałaby awaria.",
    },
  },
  {
    title: { en: "Define how we will measure it", pl: "Ustalenie sposobu pomiaru" },
    body: {
      en: "Evaluation cases and thresholds agreed before building, not after.",
      pl: "Przypadki ewaluacyjne i progi ustalone przed budową, a nie po niej.",
    },
  },
  {
    title: { en: "Build, test, hand over", pl: "Budowa, testy, przekazanie" },
    body: {
      en: "Working software with its tests and evaluation suite, documented so your team can own it.",
      pl: "Działające oprogramowanie z testami i zestawem ewaluacji, udokumentowane tak, żeby zespół mógł je przejąć.",
    },
  },
];
