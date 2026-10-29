import type { Localized } from "@/lib/i18n";
import type { ProjectStatus } from "./types";

export interface LabItem {
  id: string;
  title: Localized;
  status: ProjectStatus;
  summary: Localized;
  /** What the experiment explores, phrased as questions or topics — not results. */
  explores: Localized<string[]>;
  topics: Localized<string[]>;
  /** Plain statement of what evidence exists for this item. */
  evidence: Localized;
  /** Internal link (without locale) to related work, if any. */
  related?: string;
}

export const labItems: LabItem[] = [
  {
    id: "rag-experiments",
    title: { en: "RAG experiments", pl: "Eksperymenty z RAG" },
    status: "research",
    summary: {
      en: "Small, isolated experiments on the parts of a RAG pipeline that most often decide answer quality. Each one starts from an evaluation question rather than a demo.",
      pl: "Małe, odizolowane eksperymenty na tych elementach potoku RAG, które najczęściej decydują o jakości odpowiedzi. Każdy zaczyna się od pytania ewaluacyjnego, a nie od dema.",
    },
    explores: {
      en: [
        "How does chunking strategy change what the retriever can find?",
        "When do embeddings retrieve semantically close but wrong passages?",
        "How should retrieved context be ordered and cited in the prompt?",
        "Which failures can a deterministic check catch before an LLM judge is needed?",
      ],
      pl: [
        "Jak strategia dzielenia tekstu na fragmenty zmienia to, co wyszukiwarka potrafi znaleźć?",
        "Kiedy embeddingi zwracają fragmenty bliskie semantycznie, ale błędne?",
        "Jak porządkować i cytować pobrany kontekst w prompcie?",
        "Które błędy wyłapie test deterministyczny, zanim potrzebny będzie sędzia LLM?",
      ],
    },
    topics: { en: ["Chunking", "retrieval", "embeddings", "prompt construction", "evaluation"], pl: ["Podział na fragmenty", "wyszukiwanie", "embeddingi", "budowa promptów", "ewaluacja"] },
    evidence: {
      en: "Exploratory work; no results published. Findings feed the AI Reliability Lab.",
      pl: "Prace eksploracyjne; bez opublikowanych wyników. Wnioski trafiają do Laboratorium niezawodności AI.",
    },
    related: "/projects/ai-reliability-lab",
  },
  {
    id: "agent-experiments",
    title: { en: "AI agent experiments", pl: "Eksperymenty z agentami AI" },
    status: "research",
    summary: {
      en: "Minimal agents built to observe one behavior at a time: tool selection, memory, multi-step workflows and how to evaluate each.",
      pl: "Minimalni agenci budowani po to, żeby obserwować jedno zachowanie naraz: wybór narzędzi, pamięć, przepływy wieloetapowe i sposób oceny każdego z nich.",
    },
    explores: {
      en: [
        "How reliably does an agent choose between similar tools?",
        "What state must be explicit rather than left in the prompt?",
        "How do you verify that a multi-step workflow actually completed?",
      ],
      pl: [
        "Jak niezawodnie agent wybiera między podobnymi narzędziami?",
        "Jaki stan musi być jawny, zamiast zostawać w prompcie?",
        "Jak sprawdzić, że wieloetapowy przepływ naprawdę się zakończył?",
      ],
    },
    topics: { en: ["Tools", "memory", "workflows", "evaluation"], pl: ["Narzędzia", "pamięć", "przepływy", "ewaluacja"] },
    evidence: {
      en: "Exploratory work feeding the Agentic Automation Lab; no results published.",
      pl: "Prace eksploracyjne dla Laboratorium automatyzacji agentowej; bez opublikowanych wyników.",
    },
    related: "/projects/agentic-lab",
  },
  {
    id: "solid-oop",
    title: { en: "SOLID / OOP architecture", pl: "Architektura SOLID / OOP" },
    status: "coursework",
    summary: {
      en: "Python exercises in object-oriented design from postgraduate studies: applying SOLID principles, designing class responsibilities, modeling with UML and covering the result with unit tests.",
      pl: "Ćwiczenia z projektowania obiektowego w Pythonie w ramach studiów: stosowanie zasad SOLID, projektowanie odpowiedzialności klas, modelowanie w UML i pokrywanie wyniku testami jednostkowymi.",
    },
    explores: {
      en: [
        "Refactoring toward the open/closed and dependency inversion principles",
        "Liskov substitution in practical class hierarchies",
        "Design patterns: creational, structural, behavioral",
        "Unit testing as a design check",
      ],
      pl: [
        "Refaktoryzacja w stronę zasady otwarte/zamknięte i odwrócenia zależności",
        "Zasada podstawienia Liskov w praktycznych hierarchiach klas",
        "Wzorce projektowe: kreacyjne, strukturalne, czynnościowe",
        "Testy jednostkowe jako sprawdzian projektu",
      ],
    },
    topics: { en: ["Python", "OOP", "SOLID", "UML", "design patterns", "unit testing"], pl: ["Python", "OOP", "SOLID", "UML", "wzorce projektowe", "testy jednostkowe"] },
    evidence: {
      en: "Coursework. Listed for context, not presented as a product.",
      pl: "Projekt w ramach studiów. Podany dla kontekstu, nie jako produkt.",
    },
  },
  {
    id: "automation-experiments",
    title: { en: "Automation experiments", pl: "Eksperymenty z automatyzacją" },
    status: "engineering-lab",
    summary: {
      en: "Testing patterns and framework design ideas tried in isolation before they reach a real suite: structure, fixtures, waiting strategies and reporting.",
      pl: "Wzorce testowe i pomysły na architekturę frameworków sprawdzane w izolacji, zanim trafią do prawdziwego zestawu: struktura, fikstury, strategie oczekiwania i raportowanie.",
    },
    explores: {
      en: [
        "Condition-based waiting instead of fixed delays",
        "Fixture boundaries that keep test data out of runtime code",
        "Reports that record the conditions a test ran under",
      ],
      pl: [
        "Oczekiwanie na warunki zamiast stałych opóźnień",
        "Granice fikstur, które trzymają dane testowe z dala od kodu produkcyjnego",
        "Raporty zapisujące warunki, w jakich działał test",
      ],
    },
    topics: { en: ["Playwright", "TypeScript", "Java", "framework design"], pl: ["Playwright", "TypeScript", "Java", "projektowanie frameworków"] },
    evidence: {
      en: "Patterns used in the Resilience Framework and in this site's own test suite.",
      pl: "Wzorce wykorzystane we frameworku odporności i w testach tej strony.",
    },
    related: "/projects/resilience-framework",
  },
  {
    id: "this-site",
    title: { en: "This portfolio", pl: "To portfolio" },
    status: "engineering-lab",
    summary: {
      en: "The site is built like the projects it describes: typed, centralized EN/PL content, native diagrams instead of images, and tests that guard the content itself.",
      pl: "Strona jest zbudowana tak jak projekty, które opisuje: typowane, scentralizowane treści EN/PL, natywne diagramy zamiast obrazków i testy pilnujące samej treści.",
    },
    explores: {
      en: [
        "Content-integrity tests: every string exists in both languages, every link resolves, no empty contact buttons",
        "A snippet test that checks every code excerpt against the Learning OS source",
        "Playwright tests for navigation, language switching and the mobile menu",
      ],
      pl: [
        "Testy spójności treści: każdy tekst istnieje w obu językach, każdy link prowadzi do istniejącej strony, żadnych pustych przycisków kontaktu",
        "Test porównujący każdy fragment kodu ze źródłem Learning OS",
        "Testy Playwright dla nawigacji, przełączania języka i menu mobilnego",
      ],
    },
    topics: { en: ["Next.js", "TypeScript", "Tailwind CSS", "Vitest", "Playwright"], pl: ["Next.js", "TypeScript", "Tailwind CSS", "Vitest", "Playwright"] },
    evidence: {
      en: "Source and tests are part of this repository.",
      pl: "Kod źródłowy i testy są częścią tego repozytorium.",
    },
  },
];
