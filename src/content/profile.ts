import type { Localized } from "@/lib/i18n";

/**
 * Contact channels. Leave a value empty and every button or link that uses it
 * is hidden — the site never renders a broken or invented link.
 */
export const profile = {
  name: "Robert Leszczyński",
  email: "rothfick@icloud.com",
  github: "",
  linkedin: "",
  /** Public URL or /public path to a CV file. */
  cv: "",
  /** Where and how Robert works with clients. */
  availability: {
    en: "Remote collaboration in any time zone, with clients anywhere in the world.",
    pl: "Możliwość zdalnej współpracy w dowolnej strefie czasowej, dla klienta z każdego miejsca na Ziemi.",
  } satisfies Localized,
};

/** Absolute site URL, used for canonical links, OpenGraph and the sitemap. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rothfick.github.io").replace(/\/$/, "");

export const identity = {
  role: {
    en: "AI Reliability & Automation Engineer",
    pl: "Inżynier niezawodności AI i automatyzacji",
  },
  roleLong: {
    en: "AI Engineer focused on reliable AI systems, RAG, LLM evaluation, agentic workflows and intelligent automation.",
    pl: "Inżynier AI skupiony na niezawodnych systemach AI, RAG, ewaluacji LLM, przepływach agentowych i inteligentnej automatyzacji.",
  },
  statement: {
    en: "AI engineer with roots in quality engineering. I build AI applications and automation — and the tests that show where they fail.",
    pl: "Inżynier AI wywodzący się z inżynierii jakości. Buduję aplikacje AI i automatyzacje — oraz testy, które pokazują, gdzie te systemy zawodzą.",
  },
  seoTitle: {
    en: "Robert Leszczyński — AI Reliability & Automation Engineer",
    pl: "Robert Leszczyński — Niezawodność AI i automatyzacja",
  },
  seoDescription: {
    en: "AI Engineering, LLM evaluation, RAG, agentic workflows and automation — with a strong software quality engineering foundation.",
    pl: "Inżynieria AI, ewaluacja LLM, RAG, przepływy agentowe i automatyzacja — na solidnym fundamencie inżynierii jakości oprogramowania.",
  },
} satisfies Record<string, Localized | Localized<string[]>>;
