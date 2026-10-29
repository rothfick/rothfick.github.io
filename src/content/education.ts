import type { Localized } from "@/lib/i18n";

export const education: { title: Localized; field: Localized; status: Localized }[] = [
  {
    title: { en: "Computer Science", pl: "Informatyka" },
    field: { en: "Artificial Intelligence and Machine Learning", pl: "Sztuczna inteligencja i uczenie maszynowe" },
    status: { en: "In progress", pl: "W trakcie" },
  },
  {
    title: { en: "Postgraduate studies", pl: "Studia podyplomowe" },
    field: { en: "AI Engineering", pl: "AI Engineering" },
    status: { en: "In progress", pl: "W trakcie" },
  },
];

export const certifications: { title: string; issuer: string }[] = [
  { title: "ISTQB Foundation Level", issuer: "ISTQB" },
  { title: "ISTQB Test Automation Engineer", issuer: "ISTQB" },
];
