import type { Localized } from "@/lib/i18n";

export interface Principle {
  id: string;
  title: Localized;
  body: Localized;
  inPractice: Localized;
  /** Internal path (without locale) to where the principle is applied. */
  link?: string;
}

export const principles: Principle[] = [
  {
    id: "evidence",
    title: { en: "Evidence over intuition", pl: "Dowody zamiast intuicji" },
    body: {
      en: "If we cannot measure whether something improved, we do not know if it improved. A demo that looks better is an anecdote, not a result.",
      pl: "Jeśli nie potrafimy zmierzyć, czy coś się poprawiło, to nie wiemy, czy się poprawiło. Demo, które wygląda lepiej, to anegdota, a nie wynik.",
    },
    inPractice: {
      en: "Learning OS derives mastery from recorded evidence, never from lesson completion.",
      pl: "Learning OS wyprowadza opanowanie z zapisanych dowodów, nigdy z ukończenia lekcji.",
    },
    link: "/projects/learning-os",
  },
  {
    id: "failure-path",
    title: { en: "Test the failure path", pl: "Testuj ścieżkę porażki" },
    body: {
      en: "Happy paths are demos. Production systems fail at boundaries — between services, at timeouts, in malformed data, in the second browser tab.",
      pl: "Scenariusze pozytywne to dema. Systemy produkcyjne zawodzą na granicach — między usługami, na limitach czasu, w źle sformatowanych danych, w drugiej karcie przeglądarki.",
    },
    inPractice: {
      en: "Every case study on this site has a Failure Modes section.",
      pl: "Każdy opis projektu na tej stronie ma sekcję trybów awarii.",
    },
    link: "/projects/distributed-qa",
  },
  {
    id: "vendors",
    title: { en: "Separate domain logic from vendors", pl: "Oddziel logikę domeny od dostawców" },
    body: {
      en: "Models and providers change. Core domain logic should survive them, and stay testable without a network call.",
      pl: "Modele i dostawcy się zmieniają. Rdzeń logiki domeny powinien to przetrwać i pozostać testowalny bez wywołania sieciowego.",
    },
    inPractice: {
      en: "The Learning OS engine is pure functions; the AI sits behind a gateway that validates every output.",
      pl: "Silnik Learning OS to czyste funkcje; dostęp do AI przechodzi przez warstwę, która waliduje każdy wynik.",
    },
    link: "/projects/learning-os",
  },
  {
    id: "deterministic",
    title: { en: "Automate repeatable reasoning", pl: "Automatyzuj powtarzalne rozumowanie" },
    body: {
      en: "Not every workflow needs AI. Use deterministic code where deterministic code is enough, and reserve models for the steps that genuinely need judgment.",
      pl: "Nie każdy proces potrzebuje AI. Używaj kodu deterministycznego tam, gdzie wystarcza, a modele zostaw dla kroków, które naprawdę wymagają oceny.",
    },
    inPractice: {
      en: "Learning OS evals are fully deterministic today; an LLM judge is planned only for what they cannot check.",
      pl: "Ewaluacje w Learning OS są dziś w pełni deterministyczne; sędzia LLM jest planowany tylko do tego, czego one nie sprawdzą.",
    },
    link: "/projects/ai-reliability-lab",
  },
  {
    id: "humans",
    title: { en: "Keep humans where uncertainty matters", pl: "Zostaw ludzi tam, gdzie liczy się niepewność" },
    body: {
      en: "Human-in-the-loop is a feature, not a failure. Approval gates for uncertain or irreversible actions make a system usable earlier and safer for longer.",
      pl: "Człowiek w pętli to funkcja, a nie porażka. Bramki akceptacji dla działań niepewnych lub nieodwracalnych pozwalają używać systemu wcześniej i bezpieczniej.",
    },
    inPractice: {
      en: "In the Agentic Automation Lab design, irreversible actions wait for human approval and completion is checked against observable state — both planned, not built yet.",
      pl: "W założeniach Laboratorium automatyzacji agentowej działania nieodwracalne czekają na akceptację człowieka, a ukończenie jest sprawdzane na podstawie obserwowalnego stanu — oba elementy są zaplanowane, jeszcze niezbudowane.",
    },
    link: "/projects/agentic-lab",
  },
  {
    id: "limits",
    title: { en: "Name the limits", pl: "Nazywaj ograniczenia" },
    body: {
      en: "Every heuristic, evaluator and status label should say what it cannot do. Honest limits prevent more misuse than any warning added later.",
      pl: "Każda heurystyka, ewaluator i etykieta statusu powinny mówić, czego nie potrafią. Uczciwie opisane ograniczenia zapobiegają większej liczbie nadużyć niż ostrzeżenia dodane później.",
    },
    inPractice: {
      en: "The Learning OS grader is labeled a keyword check, reports its confidence as null and tells the learner it checks wording, not understanding.",
      pl: "Oceniacz w Learning OS jest opisany jako sprawdzenie słów kluczowych, zwraca pewność jako null i mówi uczniowi, że sprawdza sformułowania, a nie zrozumienie.",
    },
    link: "/projects/learning-os",
  },
];
