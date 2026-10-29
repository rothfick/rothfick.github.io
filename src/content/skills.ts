import type { Localized } from "@/lib/i18n";

export interface SkillGroup {
  id: string;
  title: Localized;
  note: Localized;
  items: Localized<string[]>;
}

/**
 * Four short groups, each a sentence-case list tied to where the work shows up.
 * Built work and what is still being studied are kept apart. The About page joins
 * items with "and"/"i", so the last item never contains its own "and".
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "ai-engineering",
    title: { en: "AI engineering", pl: "Inżynieria AI" },
    note: { en: "Built in Learning OS", pl: "Zbudowane w Learning OS" },
    items: {
      en: [
        "Structured outputs with Zod schemas",
        "a provider-neutral model gateway",
        "typed errors and timeouts",
        "eval cases with regression fixtures",
        "deterministic grading",
      ],
      pl: [
        "Ustrukturyzowane odpowiedzi ze schematami Zod",
        "niezależna od dostawcy warstwa dostępu do modeli",
        "typowane błędy i limity czasu",
        "przypadki ewaluacyjne z fiksturami regresji",
        "deterministyczna ocena odpowiedzi",
      ],
    },
  },
  {
    id: "rag-agents",
    title: { en: "RAG and agents", pl: "RAG i agenci" },
    note: {
      en: "Studying: coursework and lab experiments, no published results",
      pl: "W trakcie nauki: studia i eksperymenty, bez opublikowanych wyników",
    },
    items: {
      en: ["RAG and retrieval evaluation", "embeddings", "LLM-as-a-judge calibration", "agent workflows with tool use"],
      pl: ["Ewaluacja RAG i wyszukiwania", "embeddingi", "kalibracja sędziów LLM", "przepływy agentowe z wywoływaniem narzędzi"],
    },
  },
  {
    id: "automation",
    title: { en: "Automation", pl: "Automatyzacja" },
    note: { en: "Years of hands-on work", pl: "Lata praktyki" },
    items: {
      en: ["Java with TestNG and JUnit", "Selenium", "REST Assured", "Playwright with TypeScript", "Cypress", "test framework architecture"],
      pl: ["Java z TestNG i JUnit", "Selenium", "REST Assured", "Playwright z TypeScriptem", "Cypress", "architektura frameworków testowych"],
    },
  },
  {
    id: "engineering",
    title: { en: "Engineering", pl: "Inżynieria" },
    note: { en: "The foundation", pl: "Fundament" },
    items: {
      en: ["Distributed and event-driven systems", "REST APIs", "CI/CD with Jenkins and Azure DevOps", "Docker", "SQL"],
      pl: ["Systemy rozproszone i zdarzeniowe", "REST API", "CI/CD z Jenkinsem i Azure DevOps", "Docker", "SQL"],
    },
  },
];

export const secondarySkills = ["Python", "Spring Boot", "React", "Salesforce", "SOQL", "Apex"];
