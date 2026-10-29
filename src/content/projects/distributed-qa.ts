import type { Project } from "../types";

export const distributedQa: Project = {
  slug: "distributed-qa",
  index: "03",
  tier: "flagship",
  title: { en: "Quality Assurance Layer for Distributed Systems", pl: "Warstwa zapewnienia jakości dla systemów rozproszonych" },
  subtitle: {
    en: "A multi-tier testing architecture for API-heavy, asynchronous distributed systems.",
    pl: "Wielopoziomowa architektura testów dla rozproszonych, asynchronicznych systemów opartych na API.",
  },
  question: {
    en: "How do you validate a system whose failures live between services, not inside a screen?",
    pl: "Jak walidować system, którego błędy powstają między usługami, a nie na ekranie?",
  },
  statuses: ["architecture-poc"],
  categories: ["reliability", "architecture", "automation"],
  type: { en: "Quality architecture", pl: "Architektura jakości" },
  role: { en: "Test architecture · Strategy", pl: "Architektura testów · Strategia" },
  contribution: {
    en: "Test architecture: the tier model, the execution strategy and the rollout approach.",
    pl: "Architektura testów: model poziomów, strategia wykonania i sposób wdrożenia.",
  },
  stack: { en: ["REST APIs", "event streams", "contract validation", "CI/CD quality gates"], pl: ["REST API", "strumienie zdarzeń", "walidacja kontraktów", "bramki jakości w CI/CD"] },
  statusLine: {
    en: "Architecture / proof of concept · anonymized",
    pl: "Architektura / PoC · praca zanonimizowana",
  },
  homeNote: {
    en: "Anonymized professional work — no code or metrics, only architecture, decisions and failure modes.",
    pl: "Zanonimizowana praca zawodowa — bez kodu i metryk; tylko architektura, decyzje i tryby awarii.",
  },
  resultsNote: {
    en: "This is anonymized professional work, so no code, metrics or internal results can be shown.",
    pl: "To zanonimizowana praca zawodowa, więc nie mogę pokazać kodu, metryk ani wewnętrznych wyników.",
  },
  evidenceNote: {
    en: "Anonymized professional proof of concept. No company, client, product, internal system, code or metrics are shown — the design is presented through its architecture, decisions and failure modes.",
    pl: "Zanonimizowany prototyp (PoC) z pracy zawodowej. Nie pokazuję firmy, klienta, produktu, systemów wewnętrznych, kodu ani metryk — projekt jest przedstawiony przez architekturę, decyzje i tryby awarii.",
  },
  overview: {
    en: [
      "A multi-level quality architecture for API-heavy, asynchronous distributed systems, where UI automation alone cannot see most of what can break. It was developed as a professional proof of concept and is presented here fully anonymized.",
      "The core idea: validate each boundary at the cheapest level that can catch its failures, and spend expensive end-to-end time only where nothing cheaper can.",
    ],
    pl: [
      "Wielopoziomowa architektura jakości dla rozproszonych, asynchronicznych systemów opartych na API, w których sama automatyzacja UI nie widzi większości tego, co może się zepsuć. Powstała w pracy zawodowej jako prototyp (PoC) i jest tu przedstawiona w pełni anonimowo.",
      "Główna idea: każdą granicę walidować na najtańszym poziomie, który potrafi wykryć jej błędy, a drogi czas testów end-to-end przeznaczać tylko tam, gdzie nic tańszego nie wystarczy.",
    ],
  },
  problem: {
    en: [
      "In a distributed system, a green UI test proves very little. Failures appear between components: a contract that drifted, an API that accepts invalid state, an event published with the wrong shape or never published at all, an asynchronous workflow that completes in the wrong order, a side effect that never reaches persistence or an external integration.",
      "UI-level automation is slow, flaky under eventual consistency and blind to most of these boundaries. Adding more of it increases cost without increasing confidence.",
    ],
    pl: [
      "W systemie rozproszonym zielony test UI dowodzi niewiele. Błędy pojawiają się między komponentami: kontrakt, który się rozjechał, API przyjmujące niepoprawny stan, zdarzenie opublikowane w złym kształcie albo wcale, asynchroniczny przepływ zakończony w złej kolejności, efekt uboczny, który nigdy nie trafia do bazy ani do zewnętrznej integracji.",
      "Automatyzacja na poziomie UI jest wolna, niestabilna przy spójności ostatecznej i ślepa na większość tych granic. Dokładanie jej zwiększa koszt, a nie pewność.",
    ],
  },
  constraints: {
    en: [
      "Delivery must not slow down. A quality layer that blocks teams on day one gets bypassed.",
      "Eventual consistency. Many outcomes become observable only after asynchronous processing, so naive assertions either flake or wait forever.",
      "Shared environments. Tests coexist with other teams' data and traffic.",
      "Confidence costs execution time. Full distributed flows are expensive and cannot run on every commit.",
      "External dependencies. Third-party integrations cannot always be exercised in test environments.",
    ],
    pl: [
      "Dostarczanie nie może zwolnić. Jeśli warstwa jakości od pierwszego dnia blokuje zespoły, zespoły zaczną ją obchodzić.",
      "Spójność ostateczna. Wiele efektów da się zaobserwować dopiero po przetworzeniu asynchronicznym, więc naiwne asercje albo są niestabilne, albo czekają w nieskończoność.",
      "Współdzielone środowiska. Testy działają obok danych i ruchu innych zespołów.",
      "Pewność kosztuje czas wykonania. Pełne przepływy rozproszone są drogie i nie mogą działać przy każdym commicie.",
      "Zależności zewnętrzne. Integracji z firmami trzecimi nie zawsze da się przećwiczyć w środowisku testowym.",
    ],
  },
  architecture: {
    body: {
      en: [
        "Three tiers, each owning a class of failure. Tier 1 validates contracts at the boundaries. Tier 2 validates APIs and services in isolation. Tier 3 validates distributed flows end to end, including events and downstream side effects.",
      ],
      pl: [
        "Trzy poziomy, z których każdy odpowiada za inną klasę błędów. Poziom 1 waliduje kontrakty na granicach. Poziom 2 waliduje API i usługi w izolacji. Poziom 3 waliduje przepływy rozproszone od początku do końca, łącznie ze zdarzeniami i efektami ubocznymi.",
      ],
    },
    diagrams: ["qa-tiers"],
  },
  deepDives: [
    {
      id: "tiers",
      title: { en: "Three tiers of validation", pl: "Trzy poziomy walidacji" },
      body: {
        en: ["Each tier answers a different question and runs at a different cadence."],
        pl: ["Każdy poziom odpowiada na inne pytanie i działa w innym rytmie."],
      },
      terms: [
        {
          term: { en: "Tier 1 — Contract validation", pl: "Poziom 1 — walidacja kontraktów" },
          def: {
            en: "Schemas and contracts between producers and consumers: requests, responses and event payloads. Fast and deterministic; runs on every change.",
            pl: "Schematy i kontrakty między producentami a konsumentami: żądania, odpowiedzi i treść zdarzeń. Szybka i deterministyczna; działa przy każdej zmianie.",
          },
        },
        {
          term: { en: "Tier 2 — API / service validation", pl: "Poziom 2 — walidacja API i usług" },
          def: {
            en: "One service through its API: business rules, error handling, state transitions, idempotency. Runs on pull requests.",
            pl: "Jedna usługa przez jej API: reguły biznesowe, obsługa błędów, przejścia stanów, idempotentność. Działa przy pull requestach.",
          },
        },
        {
          term: { en: "Tier 3 — Distributed flow validation", pl: "Poziom 3 — walidacja przepływów rozproszonych" },
          def: {
            en: "A business flow across services, event streams and persistence: did the right events fire, in an acceptable order, with the expected side effects? Runs after merge and on a schedule.",
            pl: "Przepływ biznesowy przez usługi, strumienie zdarzeń i bazę danych: czy wyemitowano właściwe zdarzenia, w akceptowalnej kolejności i z oczekiwanymi efektami? Działa po scaleniu i według harmonogramu.",
          },
        },
      ],
    },
    {
      id: "cadence",
      title: { en: "Execution strategy: confidence vs. cost", pl: "Strategia wykonania: pewność a koszt" },
      diagram: "qa-cadence",
      body: {
        en: [
          "Checks sit on a ladder ordered by cost. Fast checks run locally and on every commit; PR validation runs the contract and service tiers; integration validation runs selected flows after merge; scheduled heavy validation runs the expensive distributed scenarios nightly or on demand.",
          "Each step up buys confidence with execution time. The ladder makes that trade explicit instead of leaving it to whoever writes the next test.",
        ],
        pl: [
          "Testy ustawione są na drabinie według kosztu. Szybkie testy działają lokalnie i przy każdym commicie; walidacja PR uruchamia poziom kontraktów i usług; walidacja integracyjna uruchamia wybrane przepływy po scaleniu; ciężka walidacja według harmonogramu obejmuje drogie scenariusze rozproszone — w nocy albo na żądanie.",
          "Każdy szczebel w górę kupuje pewność za czas wykonania. Drabina czyni ten kompromis jawnym, zamiast zostawiać go autorowi kolejnego testu.",
        ],
      },
    },
    {
      id: "principles",
      title: { en: "Design principles", pl: "Zasady projektowe" },
      body: {
        en: ["The principles that shaped the rollout as much as the test design."],
        pl: ["Zasady, które ukształtowały wdrożenie w równym stopniu co projekt testów."],
      },
      terms: [
        {
          term: { en: "Parallel QA execution", pl: "Równoległe wykonanie QA" },
          def: {
            en: "The quality layer runs alongside delivery pipelines, not inside their critical path.",
            pl: "Warstwa jakości działa obok potoków dostarczania, a nie na ich ścieżce krytycznej.",
          },
        },
        {
          term: { en: "Progressive quality gates", pl: "Stopniowe bramki jakości" },
          def: {
            en: "Checks earn the right to block: informational first, blocking once stable and trusted.",
            pl: "Testy muszą zasłużyć na prawo do blokowania: najpierw informacyjne, blokujące dopiero gdy są stabilne i zaufane.",
          },
        },
        {
          term: { en: "Minimal interference", pl: "Minimalna ingerencja" },
          def: {
            en: "No changes to how teams build and deploy; the layer observes and validates.",
            pl: "Bez zmian w tym, jak zespoły budują i wdrażają; warstwa obserwuje i waliduje.",
          },
        },
        {
          term: { en: "Scheduled heavy validation", pl: "Ciężka walidacja według harmonogramu" },
          def: {
            en: "Expensive scenarios run on a schedule, with results routed to the owning team.",
            pl: "Drogie scenariusze działają według harmonogramu, a wyniki trafiają do zespołu-właściciela.",
          },
        },
        {
          term: { en: "Eventual-consistency awareness", pl: "Świadomość spójności ostatecznej" },
          def: {
            en: "Assertions poll for an explicit condition with a timeout instead of sleeping for a fixed time.",
            pl: "Asercje odpytują o jawny warunek z limitem czasu, zamiast czekać stały czas.",
          },
        },
        {
          term: { en: "Event-stream validation", pl: "Walidacja strumieni zdarzeń" },
          def: {
            en: "Events are verified for presence, shape and correlation — not only API responses.",
            pl: "Zdarzenia są sprawdzane pod kątem obecności, kształtu i korelacji — nie tylko odpowiedzi API.",
          },
        },
        {
          term: { en: "Distributed side-effect verification", pl: "Weryfikacja rozproszonych efektów ubocznych" },
          def: {
            en: "A flow passes only when its downstream effects are observed in persistence and integrations.",
            pl: "Przepływ przechodzi dopiero wtedy, gdy jego efekty zostaną zaobserwowane w bazie danych i integracjach.",
          },
        },
      ],
    },
  ],
  decisions: [
    {
      decision: {
        en: "Validate at the cheapest level that can catch the failure.",
        pl: "Walidować na najtańszym poziomie, który wykryje dany błąd.",
      },
      why: {
        en: "A contract break caught in Tier 1 costs seconds; the same break found in an end-to-end flow costs a debugging session.",
        pl: "Złamany kontrakt wykryty na poziomie 1 kosztuje sekundy; ten sam błąd znaleziony w przepływie end-to-end kosztuje sesję debugowania.",
      },
      tradeoff: {
        en: "Requires discipline about where each check belongs, and some overlap between tiers.",
        pl: "Wymaga dyscypliny w przypisywaniu testów do poziomów i pewnego nakładania się poziomów.",
      },
    },
    {
      decision: { en: "Roll out as informational before blocking.", pl: "Wdrażać najpierw informacyjnie, potem blokująco." },
      why: {
        en: "Teams trust gates they have watched be right. A new gate that blocks on a flaky check destroys that trust immediately.",
        pl: "Zespoły ufają bramkom, które już nieraz miały rację. Nowa bramka blokująca na niestabilnym teście natychmiast niszczy to zaufanie.",
      },
      tradeoff: {
        en: "Real defects can pass while a gate is still informational.",
        pl: "Prawdziwe błędy mogą przejść, dopóki bramka jest tylko informacyjna.",
      },
    },
    {
      decision: {
        en: "Run the quality layer in parallel with delivery pipelines.",
        pl: "Uruchamiać warstwę jakości równolegle z potokami dostarczania.",
      },
      why: {
        en: "Validation should not lengthen the critical path of every deployment.",
        pl: "Walidacja nie powinna wydłużać ścieżki krytycznej każdego wdrożenia.",
      },
      tradeoff: {
        en: "Feedback on some failures arrives after merge rather than before.",
        pl: "Informacja o części błędów przychodzi po scaleniu, a nie przed nim.",
      },
    },
    {
      decision: {
        en: "Poll for eventual consistency with explicit conditions.",
        pl: "Obsługiwać spójność ostateczną przez odpytywanie o jawne warunki.",
      },
      why: {
        en: "Fixed sleeps are either too short (flaky) or too long (slow). A condition with a timeout states the actual expectation.",
        pl: "Stałe opóźnienia są albo za krótkie (niestabilność), albo za długie (powolność). Warunek z limitem czasu wyraża rzeczywiste oczekiwanie.",
      },
      tradeoff: {
        en: "More complex helpers and careful timeout tuning.",
        pl: "Bardziej złożone narzędzia pomocnicze i staranne dobieranie limitów.",
      },
    },
    {
      decision: { en: "Move expensive scenarios to scheduled runs.", pl: "Przenieść drogie scenariusze do uruchomień według harmonogramu." },
      why: {
        en: "Full distributed flows give the most confidence and cost the most; running them on a schedule keeps PR feedback fast.",
        pl: "Pełne przepływy rozproszone dają najwięcej pewności i kosztują najwięcej; uruchamianie ich według harmonogramu utrzymuje szybką informację zwrotną w PR.",
      },
      tradeoff: {
        en: "Regressions in those flows are found hours later, not minutes.",
        pl: "Regresje w tych przepływach wychodzą na jaw po kilku godzinach, a nie po minutach.",
      },
    },
  ],
  implementation: {
    intro: {
      en: "What the proof of concept defined and explored:",
      pl: "Co zdefiniował i sprawdził prototyp:",
    },
    items: {
      en: [
        "A tiered test architecture separating contract, service and distributed-flow suites.",
        "An execution strategy mapping each tier to a pipeline stage: local, pull request, post-merge integration, scheduled.",
        "Patterns for event-stream assertions and condition-based polling under eventual consistency.",
        "Side-effect verification across persistence and downstream integrations.",
        "A rollout model with informational reporting before blocking gates.",
      ],
      pl: [
        "Warstwową architekturę testów, rozdzielającą zestawy kontraktowe, usługowe i przepływów rozproszonych.",
        "Strategię wykonania przypisującą każdy poziom do etapu potoku: lokalnie, pull request, integracja po scaleniu, harmonogram.",
        "Wzorce asercji na strumieniach zdarzeń i odpytywania o warunki przy spójności ostatecznej.",
        "Weryfikację efektów ubocznych w bazie danych i integracjach.",
        "Model wdrożenia: raportowanie informacyjne przed bramkami blokującymi.",
      ],
    },
  },
  verification: {
    body: {
      en: [
        "Each tier owns the failure modes listed under Failure modes below, and the rollout model keeps every gate informational before it may block.",
      ],
      pl: [
        "Każdy poziom odpowiada za tryby awarii wymienione niżej w sekcji „Tryby awarii”, a model wdrożenia sprawia, że każda bramka jest najpierw informacyjna, zanim zacznie blokować.",
      ],
    },
  },
  failureModes: [
    {
      name: { en: "Contract drift", pl: "Rozjazd kontraktu" },
      symptom: {
        en: "A producer changes a payload; consumers break in production.",
        pl: "Producent zmienia treść komunikatu; konsumenci psują się na produkcji.",
      },
      guard: { en: "Tier 1 contract validation on every change.", pl: "Walidacja kontraktów na poziomie 1 przy każdej zmianie." },
      state: "designed",
    },
    {
      name: { en: "Lost or duplicated events", pl: "Zgubione lub zdublowane zdarzenia" },
      symptom: {
        en: "An event is never published, or is processed twice.",
        pl: "Zdarzenie nigdy nie zostaje opublikowane albo jest przetwarzane dwa razy.",
      },
      guard: {
        en: "Event-stream assertions for presence and correlation; idempotency checks in Tier 2.",
        pl: "Asercje na strumieniu zdarzeń dla obecności i korelacji; testy idempotentności na poziomie 2.",
      },
      state: "designed",
    },
    {
      name: { en: "Flaky asynchronous assertions", pl: "Niestabilne asercje asynchroniczne" },
      symptom: {
        en: "Tests fail intermittently because state is not yet consistent.",
        pl: "Testy losowo nie przechodzą, bo stan nie jest jeszcze spójny.",
      },
      guard: {
        en: "Condition-based polling with explicit timeouts; no fixed sleeps.",
        pl: "Odpytywanie o warunki z jawnymi limitami czasu; żadnych stałych opóźnień.",
      },
      state: "designed",
    },
    {
      name: { en: "Missing side effects", pl: "Brakujące efekty uboczne" },
      symptom: {
        en: "The API returns success, but persistence or an integration never updates.",
        pl: "API zwraca sukces, ale baza danych albo integracja nigdy się nie aktualizuje.",
      },
      guard: {
        en: "Tier 3 verifies downstream effects, not only responses.",
        pl: "Poziom 3 weryfikuje efekty w dalszych komponentach, a nie tylko odpowiedzi.",
      },
      state: "designed",
    },
    {
      name: { en: "Gate fatigue", pl: "Zmęczenie bramkami" },
      symptom: {
        en: "A noisy gate gets ignored or switched off.",
        pl: "Hałaśliwa bramka zostaje zignorowana albo wyłączona.",
      },
      guard: {
        en: "Informational rollout; promotion to blocking only once the check is stable.",
        pl: "Wdrożenie informacyjne; awans do bramki blokującej dopiero po ustabilizowaniu testu.",
      },
      state: "designed",
    },
    {
      name: { en: "Test data collisions", pl: "Kolizje danych testowych" },
      symptom: {
        en: "Parallel runs in a shared environment interfere with each other.",
        pl: "Równoległe uruchomienia we współdzielonym środowisku wpływają na siebie nawzajem.",
      },
      guard: {
        en: "Run-scoped, uniquely tagged test data.",
        pl: "Dane testowe przypisane do uruchomienia i jednoznacznie oznaczone.",
      },
      state: "designed",
    },
  ],
  now: {
    en: [
      "Tiered architecture and execution strategy",
      "Design principles and rollout model",
      "Failure-mode catalogue for asynchronous flows",
    ],
    pl: [
      "Architektura poziomów i strategia wykonania",
      "Zasady projektowe i model wdrożenia",
      "Katalog trybów awarii dla przepływów asynchronicznych",
    ],
  },
  next: {
    en: [
      "Open reference implementation on a sample event-driven system",
      "Contract tests between sample services",
      "Reusable condition-based polling helpers",
      "Flake tracking to decide gate promotion",
    ],
    pl: [
      "Otwarta implementacja referencyjna na przykładowym systemie zdarzeniowym",
      "Testy kontraktowe między przykładowymi usługami",
      "Wielokrotnego użytku narzędzia do odpytywania o warunki",
      "Śledzenie niestabilności jako podstawa awansu bramek",
    ],
  },
  lessons: {
    en: [
      "Most distributed defects are boundary defects. Testing boundaries directly is cheaper than inferring them from the UI.",
      "A quality gate is a social contract as much as a technical one. The rollout strategy matters as much as the test design.",
      "Eventual consistency is a requirement to model, not a source of flakiness to retry away.",
    ],
    pl: [
      "Większość błędów w systemach rozproszonych to błędy na granicach. Bezpośrednie testowanie granic jest tańsze niż wnioskowanie o nich z UI.",
      "Bramka jakości to umowa społeczna w tym samym stopniu co techniczna. Strategia wdrożenia jest równie ważna jak projekt testów.",
      "Spójność ostateczna to wymaganie do zamodelowania, a nie źródło niestabilności, które można zamaskować ponawianiem testów.",
    ],
  },
  nextIteration: {
    en: [
      "Build an open reference implementation on a small event-driven sample system, so the patterns can be shown with real code.",
      "Add contract tests and condition-based polling helpers to it, with CI stages mirroring the cost ladder.",
    ],
    pl: [
      "Zbudować otwartą implementację referencyjną na małym przykładowym systemie zdarzeniowym, żeby pokazać wzorce na prawdziwym kodzie.",
      "Dodać do niej testy kontraktowe i narzędzia do odpytywania o warunki, z etapami CI odzwierciedlającymi drabinę kosztów.",
    ],
  },
};
