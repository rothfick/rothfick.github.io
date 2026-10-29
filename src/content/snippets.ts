import type { Localized } from "@/lib/i18n";
import data from "./snippets.json";
import type { SnippetKey } from "./types";

/**
 * Code excerpts copied verbatim from the Learning OS repository by
 * scripts/extract-snippets.mjs. Never edit snippets.json by hand.
 */
export interface Snippet {
  key: SnippetKey;
  file: string;
  start: number;
  end: number;
  code: string;
  title: Localized;
  note: Localized;
}

const captions: Record<SnippetKey, { title: Localized; note: Localized }> = {
  "lo-mastery": {
    title: { en: "Mastery gates", pl: "Bramki opanowania" },
    note: {
      en: "Only human- or test-verified evidence scoring ≥ 0.8 counts as reliable. VERIFIED and MASTERED depend on it.",
      pl: "Za wiarygodne uznawane są tylko dowody zweryfikowane przez człowieka lub test z wynikiem ≥ 0,8. Od nich zależą VERIFIED i MASTERED.",
    },
  },
  "lo-gateway": {
    title: { en: "Model gateway", pl: "Warstwa dostępu do modeli" },
    note: {
      en: "No grading without an attempt, a hard timeout with abort, schema validation of output and metadata, typed errors.",
      pl: "Brak oceny bez odpowiedzi, twardy limit czasu z przerwaniem, walidacja schematu wyniku i metadanych, typowane błędy.",
    },
  },
  "lo-keyword": {
    title: { en: "Deterministic keyword provider", pl: "Deterministyczny dostawca słów kluczowych" },
    note: {
      en: "The runtime grader states its own limits: null confidence, zero tokens and cost, no invented misconception.",
      pl: "Oceniacz w aplikacji sam mówi o swoich ograniczeniach: pewność null, zero tokenów i kosztów, żadnych wymyślonych błędnych przekonań.",
    },
  },
  "lo-eval-contract": {
    title: { en: "Evaluation contract", pl: "Kontrakt ewaluacji" },
    note: {
      en: "Typed eval cases with explicit categories — the seed of the evaluation lab.",
      pl: "Typowane przypadki ewaluacyjne z jawnymi kategoriami — zalążek laboratorium ewaluacji.",
    },
  },
  "lo-false-mastery": {
    title: { en: "False-mastery eval", pl: "Ewaluacja fałszywego opanowania" },
    note: {
      en: "Perfect scores in all five dimensions from fake, keyword or model verifiers must never yield MASTERED.",
      pl: "Idealne wyniki we wszystkich pięciu wymiarach od weryfikatorów fake, keyword lub model nigdy nie mogą dać MASTERED.",
    },
  },
  "lo-atom-schema": {
    title: { en: "Knowledge Atom schema", pl: "Schemat atomu wiedzy" },
    note: {
      en: "A rubric of at least one term, explicit prerequisites and relations, bounded difficulty and at least one citation.",
      pl: "Rubryka z co najmniej jednym terminem, jawne wymagania wstępne i powiązania, ograniczona trudność i co najmniej jeden cytat.",
    },
  },
  "lo-schedule": {
    title: { en: "Review scheduling", pl: "Planowanie powtórek" },
    note: {
      en: "A pure function of the last attempt, score, difficulty and retention.",
      pl: "Czysta funkcja ostatniej odpowiedzi, wyniku, trudności i utrwalenia.",
    },
  },
};

export const repositoryLabel = "learning-os";

export const snippets: Snippet[] = (data as Omit<Snippet, "title" | "note">[]).map((s) => ({
  ...s,
  ...captions[s.key],
}));

export function getSnippet(key: SnippetKey): Snippet {
  const snippet = snippets.find((s) => s.key === key);
  if (!snippet) throw new Error(`Unknown snippet: ${key}`);
  return snippet;
}
