import type { Project } from "../types";

export const agenticLab: Project = {
  slug: "agentic-lab",
  index: "05",
  tier: "standard",
  title: { en: "Agentic Automation Lab", pl: "Laboratorium automatyzacji agentowej" },
  subtitle: {
    en: "Tool-using agents explored through a reliability lens: planning, tools, state, guardrails, human approval and evaluation.",
    pl: "Agenci korzystający z narzędzi badani z perspektywy niezawodności: planowanie, narzędzia, stan, zabezpieczenia, akceptacja przez człowieka i ewaluacja.",
  },
  question: {
    en: "What does it take for a tool-using agent to be reliable enough to trust with real work?",
    pl: "Czego potrzeba, żeby agentowi korzystającemu z narzędzi można było powierzyć prawdziwą pracę?",
  },
  statuses: ["research", "active-development"],
  categories: ["ai", "research", "automation"],
  year: "2026",
  type: { en: "Research lab", pl: "Laboratorium badawcze" },
  role: { en: "Research · Engineering", pl: "Badania · Inżynieria" },
  contribution: {
    en: "Research and engineering: the loop architecture, a failure-mode catalogue and the evaluation dimensions.",
    pl: "Badania i inżynieria: architektura pętli, katalog trybów awarii i wymiary ewaluacji.",
  },
  stack: { en: ["TypeScript", "LLM tool use", "JSON Schema"], pl: ["TypeScript", "wywoływanie narzędzi przez LLM", "JSON Schema"] },
  statusLine: {
    en: "Research · in active development",
    pl: "Badania · w aktywnym rozwoju",
  },
  homeNote: {
    en: "Architecture and evaluation design; no results published yet.",
    pl: "Architektura i projekt ewaluacji; wyniki nie są jeszcze publikowane.",
  },
  evidenceNote: {
    en: "Research area in active development. This page shows the architecture and evaluation design; no results are published yet.",
    pl: "Obszar badawczy w aktywnym rozwoju. Strona pokazuje architekturę i projekt ewaluacji; wyniki nie są jeszcze publikowane.",
  },
  overview: {
    en: [
      "An exploration of tool-using agents built with the same reliability lens as the rest of this portfolio: planning and task decomposition, tool and API execution, state and memory, guardrails, human approval, error recovery — and above all, evaluation.",
      "It is a research area in active development, not a finished system. The goal is to move beyond prompt-based applications toward agents whose behavior can be measured and constrained.",
    ],
    pl: [
      "Badanie agentów korzystających z narzędzi z tej samej perspektywy niezawodności co reszta portfolio: planowanie i dekompozycja zadań, wykonywanie narzędzi i wywołań API, stan i pamięć, zabezpieczenia, akceptacja przez człowieka, odzyskiwanie po błędach — i przede wszystkim ewaluacja.",
      "To obszar badawczy w aktywnym rozwoju, a nie gotowy system. Celem jest wyjście poza aplikacje oparte na samym promptowaniu, w stronę agentów, których zachowanie da się zmierzyć i ograniczyć.",
    ],
  },
  problem: {
    en: [
      "A prompt-based assistant returns text. An agent takes actions. Once a model can call tools, the failure modes change: it can pick the wrong tool, loop forever, act on stale state, perform an action it should not, or report success for work that never happened.",
      "Demos rarely show any of this. Reliable agents need the same things as reliable software — contracts, limits, observability and tests — adapted to a non-deterministic planner.",
    ],
    pl: [
      "Asystent oparty na promptach zwraca tekst. Agent wykonuje działania. Gdy model może wywoływać narzędzia, zmieniają się tryby awarii: może wybrać złe narzędzie, zapętlić się, działać na nieaktualnym stanie, wykonać akcję, której nie powinien, albo zgłosić sukces pracy, która nigdy się nie wydarzyła.",
      "Dema rzadko to pokazują. Niezawodni agenci potrzebują tego samego co niezawodne oprogramowanie — kontraktów, limitów, obserwowalności i testów — dostosowanych do niedeterministycznego planisty.",
    ],
  },
  constraints: {
    en: [
      "Actions have side effects. Unlike text, a wrong API call may not be reversible.",
      "Trajectories, not answers. Evaluating an agent means judging the path it took, not only its final message.",
      "Non-determinism compounds. Small variations early in a plan lead to very different runs.",
      "Humans must stay in control where uncertainty is high — without approving every trivial step.",
    ],
    pl: [
      "Działania mają skutki uboczne. W przeciwieństwie do tekstu, błędnego wywołania API może nie dać się cofnąć.",
      "Trajektorie, nie odpowiedzi. Ocena agenta to ocena drogi, którą przeszedł, a nie tylko jego ostatniej wiadomości.",
      "Niedeterminizm się kumuluje. Drobne różnice na początku planu prowadzą do zupełnie różnych przebiegów.",
      "Człowiek musi zachować kontrolę tam, gdzie niepewność jest wysoka — bez zatwierdzania każdego drobnego kroku.",
    ],
  },
  architecture: {
    body: {
      en: [
        "In the design, a planner decomposes the goal, the agent executes steps through typed tool interfaces, and an evaluator checks every result before the run continues, replans, asks a human or completes. State and guardrails wrap the whole loop, and every step will be traced.",
      ],
      pl: [
        "Zgodnie z projektem planista rozkłada cel na kroki, agent wykonuje je przez typowane interfejsy narzędzi, a ewaluator sprawdza każdy wynik, zanim przebieg będzie kontynuowany, zaplanowany od nowa, przekazany człowiekowi albo zakończony. Stan i zabezpieczenia otaczają całą pętlę, a każdy krok będzie śledzony.",
      ],
    },
    diagrams: ["agent-loop"],
  },
  deepDives: [
    {
      id: "components",
      title: { en: "Components of the loop", pl: "Elementy pętli" },
      body: {
        en: ["These are the components of the design. Each one is there to make one class of failure visible or impossible."],
        pl: ["To elementy projektu pętli. Każdy z nich ma sprawić, że jedna klasa błędów stanie się widoczna albo niemożliwa."],
      },
      terms: [
        {
          term: { en: "Planner", pl: "Planista" },
          def: { en: "Turns a goal into ordered, checkable steps.", pl: "Zamienia cel na uporządkowane, sprawdzalne kroki." },
        },
        {
          term: { en: "Tools / APIs", pl: "Narzędzia / API" },
          def: {
            en: "Typed interfaces with validated inputs and outputs; every tool declares whether it has side effects.",
            pl: "Typowane interfejsy z walidowanym wejściem i wyjściem; każde narzędzie deklaruje, czy ma skutki uboczne.",
          },
        },
        {
          term: { en: "State & memory", pl: "Stan i pamięć" },
          def: {
            en: "Explicit run state the agent reads and writes; nothing important lives only in the prompt.",
            pl: "Jawny stan przebiegu, który agent czyta i zapisuje; nic ważnego nie istnieje tylko w prompcie.",
          },
        },
        {
          term: { en: "Evaluator", pl: "Ewaluator" },
          def: {
            en: "Checks each step's result against its expected outcome before the next step.",
            pl: "Sprawdza wynik każdego kroku względem oczekiwanego efektu przed kolejnym krokiem.",
          },
        },
        {
          term: { en: "Guardrails", pl: "Zabezpieczenia" },
          def: {
            en: "Limits on steps, cost, allowed tools and allowed actions.",
            pl: "Limity kroków, kosztów, dozwolonych narzędzi i dozwolonych działań.",
          },
        },
        {
          term: { en: "Human approval", pl: "Akceptacja człowieka" },
          def: {
            en: "Required for irreversible or high-impact actions.",
            pl: "Wymagana przy działaniach nieodwracalnych lub o dużym wpływie.",
          },
        },
        {
          term: { en: "Observability", pl: "Obserwowalność" },
          def: {
            en: "A trace of every step, tool call and decision.",
            pl: "Ślad każdego kroku, wywołania narzędzia i decyzji.",
          },
        },
      ],
    },
    {
      id: "measure",
      title: { en: "What to measure", pl: "Co mierzyć" },
      body: {
        en: ["The evaluation dimensions are defined before any result is claimed."],
        pl: ["Wymiary ewaluacji są zdefiniowane, zanim padnie jakakolwiek deklaracja wyników."],
      },
      terms: [
        {
          term: { en: "Task completion", pl: "Ukończenie zadania" },
          def: {
            en: "Verified against observable state — never self-reported by the agent.",
            pl: "Weryfikowane na podstawie obserwowalnego stanu — nigdy deklaracji samego agenta.",
          },
        },
        {
          term: { en: "Tool correctness", pl: "Poprawność narzędzi" },
          def: { en: "The right tool, with valid arguments.", pl: "Właściwe narzędzie z poprawnymi argumentami." },
        },
        {
          term: { en: "Trajectory efficiency", pl: "Efektywność trajektorii" },
          def: { en: "Steps, retries and loops per task.", pl: "Liczba kroków, ponowień i pętli na zadanie." },
        },
        {
          term: { en: "Recovery", pl: "Odzyskiwanie" },
          def: { en: "Behavior after a tool fails.", pl: "Zachowanie po awarii narzędzia." },
        },
        {
          term: { en: "Safety", pl: "Bezpieczeństwo" },
          def: {
            en: "Disallowed actions blocked or escalated correctly.",
            pl: "Niedozwolone działania poprawnie zablokowane lub eskalowane.",
          },
        },
      ],
    },
  ],
  decisions: [
    {
      decision: {
        en: "Typed tool contracts with side-effect declarations.",
        pl: "Typowane kontrakty narzędzi z deklaracją skutków ubocznych.",
      },
      why: {
        en: "The runtime can validate arguments before execution and require approval for side-effecting tools.",
        pl: "Środowisko wykonawcze może walidować argumenty przed wykonaniem i wymagać akceptacji dla narzędzi ze skutkami ubocznymi.",
      },
      tradeoff: { en: "More upfront schema work per tool.", pl: "Więcej pracy nad schematem każdego narzędzia." },
    },
    {
      decision: { en: "Verify completion independently.", pl: "Weryfikować ukończenie niezależnie od agenta." },
      why: {
        en: "Agents are prone to claiming success. Completion is checked against observable state, not the agent's own message.",
        pl: "Agenci mają skłonność do ogłaszania sukcesu. Ukończenie jest sprawdzane na podstawie obserwowalnego stanu, a nie wiadomości agenta.",
      },
      tradeoff: {
        en: "Every task needs a verifiable end condition.",
        pl: "Każde zadanie potrzebuje weryfikowalnego warunku zakończenia.",
      },
    },
    {
      decision: { en: "Hard step and cost budgets.", pl: "Twarde limity kroków i kosztów." },
      why: {
        en: "Infinite loops and runaway costs are failure modes, not edge cases.",
        pl: "Nieskończone pętle i niekontrolowane koszty to tryby awarii, a nie przypadki brzegowe.",
      },
      tradeoff: {
        en: "Some legitimate long tasks hit the limit and need a human.",
        pl: "Część uzasadnionych długich zadań trafi na limit i będzie wymagać człowieka.",
      },
    },
    {
      decision: { en: "Human-in-the-loop as a feature.", pl: "Człowiek w pętli jako funkcja, nie porażka." },
      why: {
        en: "Approval gates where uncertainty or impact is high make the system usable earlier.",
        pl: "Bramki akceptacji tam, gdzie niepewność lub wpływ są wysokie, pozwalają używać systemu wcześniej.",
      },
      tradeoff: {
        en: "Slower end-to-end completion for gated tasks.",
        pl: "Wolniejsze ukończenie zadań objętych bramką.",
      },
    },
  ],
  implementation: {
    intro: {
      en: "Areas explored so far with small prototype agents and workflows:",
      pl: "Obszary badane dotąd na małych, prototypowych agentach i przepływach:",
    },
    items: {
      en: [
        "Tool selection and API calls",
        "Planning and task decomposition",
        "Multi-step workflows, state and memory",
        "Error recovery after failed tool calls",
      ],
      pl: [
        "Wybór narzędzi i wywołania API",
        "Planowanie i dekompozycja zadań",
        "Przepływy wieloetapowe, stan i pamięć",
        "Odzyskiwanie po nieudanych wywołaniach narzędzi",
      ],
    },
  },
  verification: {
    body: {
      en: [
        "The evaluation dimensions above define what will be measured before any claim is made. The planned trajectory harness will reuse the evaluators from the AI Reliability Lab.",
      ],
      pl: [
        "Opisane wyżej wymiary ewaluacji określają, co będzie mierzone, zanim padnie jakakolwiek deklaracja. Planowany zestaw do oceny trajektorii wykorzysta ewaluatory z Laboratorium niezawodności AI.",
      ],
    },
  },
  failureModes: [
    {
      name: { en: "Wrong tool", pl: "Złe narzędzie" },
      symptom: {
        en: "The agent picks a plausible but incorrect tool.",
        pl: "Agent wybiera wiarygodnie wyglądające, ale niewłaściwe narzędzie.",
      },
      guard: {
        en: "Tool-correctness evaluation; narrow tool descriptions and allow-lists per task.",
        pl: "Ewaluacja poprawności narzędzi; wąskie opisy narzędzi i listy dozwolonych narzędzi dla zadania.",
      },
      state: "designed",
    },
    {
      name: { en: "Infinite loop", pl: "Nieskończona pętla" },
      symptom: {
        en: "The agent repeats the same step or plan without progress.",
        pl: "Agent powtarza ten sam krok lub plan bez postępu.",
      },
      guard: {
        en: "Step and cost budgets; repeated-action detection.",
        pl: "Limity kroków i kosztów; wykrywanie powtarzanych działań.",
      },
      state: "designed",
    },
    {
      name: { en: "Stale state", pl: "Nieaktualny stan" },
      symptom: {
        en: "The agent acts on information that changed since it was read.",
        pl: "Agent działa na informacjach, które zmieniły się od czasu odczytu.",
      },
      guard: {
        en: "Explicit, versioned run state; re-read before side-effecting actions.",
        pl: "Jawny, wersjonowany stan przebiegu; ponowny odczyt przed działaniami ze skutkami ubocznymi.",
      },
      state: "designed",
    },
    {
      name: { en: "Invalid action", pl: "Niedozwolone działanie" },
      symptom: {
        en: "An action outside the agent's mandate, or with invalid arguments.",
        pl: "Działanie poza zakresem uprawnień agenta albo z niepoprawnymi argumentami.",
      },
      guard: {
        en: "Schema validation of tool arguments; approval gates for irreversible actions.",
        pl: "Walidacja schematu argumentów narzędzi; bramki akceptacji dla działań nieodwracalnych.",
      },
      state: "designed",
    },
    {
      name: { en: "Tool failure", pl: "Awaria narzędzia" },
      symptom: {
        en: "An API times out or returns an error mid-task.",
        pl: "API przekracza limit czasu albo zwraca błąd w trakcie zadania.",
      },
      guard: {
        en: "Typed tool errors, bounded retries and a replan path.",
        pl: "Typowane błędy narzędzi, ograniczone ponowienia i ścieżka ponownego planowania.",
      },
      state: "designed",
    },
    {
      name: { en: "Hallucinated completion", pl: "Zmyślone ukończenie" },
      symptom: {
        en: "The agent reports success for work that never happened.",
        pl: "Agent zgłasza sukces pracy, która nigdy się nie wydarzyła.",
      },
      guard: {
        en: "Completion verified against observable state by the evaluator, not by the agent.",
        pl: "Ukończenie weryfikowane przez ewaluator na podstawie obserwowalnego stanu, a nie przez agenta.",
      },
      state: "designed",
    },
  ],
  now: {
    en: [
      "Reference loop architecture",
      "Failure-mode catalogue for agents",
      "Evaluation dimensions defined",
      "Exploratory agents and workflows",
    ],
    pl: [
      "Referencyjna architektura pętli",
      "Katalog trybów awarii agentów",
      "Zdefiniowane wymiary ewaluacji",
      "Eksploracyjni agenci i przepływy",
    ],
  },
  next: {
    en: [
      "Trajectory evaluation harness reusing the lab's evaluators",
      "Typed tool registry with side-effect flags",
      "Approval gate for irreversible actions",
      "Tracing for every step and tool call",
    ],
    pl: [
      "Zestaw do oceny trajektorii wykorzystujący ewaluatory laboratorium",
      "Typowany rejestr narzędzi z flagami skutków ubocznych",
      "Bramka akceptacji dla działań nieodwracalnych",
      "Śledzenie każdego kroku i wywołania narzędzia",
    ],
  },
  lessons: {
    en: [
      "The interesting engineering in agents is not the prompt; it is the contract between the model and the tools.",
      "If an agent can say “done”, something other than the agent must be able to check it.",
    ],
    pl: [
      "Najciekawsza inżynieria w agentach to nie prompt, tylko kontrakt między modelem a narzędziami.",
      "Jeśli agent może powiedzieć „gotowe”, sprawdzić to musi ktoś lub coś poza samym agentem.",
    ],
  },
  nextIteration: {
    en: [
      "Build the trajectory evaluation harness and run it on a small, versioned task set.",
      "Publish one end-to-end agent with typed tools, approval gates and traces — together with its evaluation results.",
    ],
    pl: [
      "Zbudować zestaw do oceny trajektorii i uruchomić go na małym, wersjonowanym zbiorze zadań.",
      "Opublikować jednego kompletnego agenta z typowanymi narzędziami, bramkami akceptacji i śladami — razem z wynikami ewaluacji.",
    ],
  },
};
