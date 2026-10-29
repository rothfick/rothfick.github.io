import type { Project } from "../types";

export const learningOs: Project = {
  slug: "learning-os",
  index: "01",
  tier: "flagship",
  title: { en: "Learning OS", pl: "Learning OS" },
  subtitle: {
    en: "A mastery-driven learning system built around evidence, misconceptions and knowledge atoms.",
    pl: "System nauki oparty na rzeczywistym opanowaniu materiału — zbudowany wokół dowodów, błędnych przekonań i atomów wiedzy.",
  },
  question: {
    en: "What does the learner actually know — and what evidence supports that claim?",
    pl: "Co uczeń naprawdę wie — i jakie dowody za tym stoją?",
  },
  statuses: ["working-mvp", "active-development"],
  categories: ["ai", "architecture"],
  year: "2026",
  type: { en: "AI-ready learning system", pl: "System nauki gotowy na AI" },
  role: { en: "Architecture · Engineering · Product", pl: "Architektura · Inżynieria · Produkt" },
  contribution: {
    en: "Product concept, domain model and architecture; the learning-engine policies, the AI gateway boundary and the test and eval strategy.",
    pl: "Koncepcja produktu, model domeny i architektura; reguły silnika nauki, warstwa dostępu do modeli oraz strategia testów i ewaluacji.",
  },
  stack: { en: ["TypeScript", "Next.js", "React", "Zod", "Vitest", "Playwright", "pnpm workspaces"], pl: ["TypeScript", "Next.js", "React", "Zod", "Vitest", "Playwright", "monorepo pnpm"] },
  statusLine: {
    en: "Working MVP · in active development",
    pl: "Działające MVP · w aktywnym rozwoju",
  },
  feature: {
    summary: {
      en: "A local-first learning workspace that models what a learner knows — not what they clicked through.",
      pl: "Lokalna przestrzeń do nauki, która modeluje to, co uczeń naprawdę wie — a nie to, co przeklikał.",
    },
    problem: {
      en: "Learning platforms measure activity — lessons completed, quiz scores. Those signals are easy to inflate and say little about whether knowledge lasts a week.",
      pl: "Platformy edukacyjne mierzą aktywność — ukończone lekcje, wyniki quizów. Takie sygnały łatwo nabić, a niewiele mówią o tym, czy wiedza przetrwa tydzień.",
    },
  },
  evidenceNote: {
    en: "Verified against the project repository: source code, documentation and a local run of every test suite on 29 October 2026. Code excerpts are copied verbatim.",
    pl: "Zweryfikowane na podstawie repozytorium projektu: kodu źródłowego, dokumentacji i lokalnego uruchomienia wszystkich zestawów testów 29 października 2026. Fragmenty kodu są kopiowane bez zmian.",
  },
  overview: {
    en: [
      "Learning OS is a local-first learning workspace that models what a learner knows instead of what they have clicked through. Learners import their own material, author Knowledge Atoms that cite exact source excerpts, answer from memory, and get a mastery state and a review date derived from recorded evidence.",
      "It runs as a Next.js application on top of seven TypeScript workspace packages. Mastery, review, misconception, readiness and prioritization rules are pure functions with an injected clock — no LLM call decides whether someone has learned something.",
    ],
    pl: [
      "Learning OS to lokalna przestrzeń do nauki, która modeluje to, co uczeń wie — a nie to, co przeklikał. Uczeń importuje własne materiały, tworzy atomy wiedzy cytujące konkretne fragmenty źródeł, odpowiada z pamięci, a stan opanowania i termin powtórki wynikają z zapisanych dowodów.",
      "Aplikacja działa na Next.js i siedmiu pakietach TypeScript w monorepo. Reguły opanowania, powtórek, błędnych przekonań, gotowości do egzaminu i priorytetyzacji to czyste funkcje ze wstrzykiwanym zegarem — żadne wywołanie LLM nie rozstrzyga, czy ktoś się czegoś nauczył.",
    ],
  },
  problem: {
    en: [
      "Most learning platforms measure activity: lessons completed, videos watched, quiz scores. Those signals are cheap to collect and easy to inflate, and they say little about whether knowledge survives a week, transfers to a new problem, or rests on a misconception.",
      "Learning OS tries to answer a narrower and harder question: what does the learner actually know, what evidence supports that claim, and what should they learn next?",
    ],
    pl: [
      "Większość platform edukacyjnych mierzy aktywność: ukończone lekcje, obejrzane nagrania, wyniki quizów. Takie sygnały łatwo zebrać i łatwo je „nabić”, a niewiele mówią o tym, czy wiedza przetrwa tydzień, przeniesie się na nowy problem albo czy nie opiera się na błędnym przekonaniu.",
      "Learning OS próbuje odpowiedzieć na węższe i trudniejsze pytanie: co uczeń naprawdę wie, jakie dowody to potwierdzają i czego powinien uczyć się dalej?",
    ],
  },
  constraints: {
    en: [
      "Mastery must be explainable. Every state has to point back to the evidence and thresholds that produced it.",
      "Cheap signals must not unlock strong claims. A keyword match or a model opinion cannot, on its own, mark a concept as verified.",
      "Curriculum must stay grounded. A Knowledge Atom cites an exact excerpt from an imported source version — nothing is generated from filenames or headings.",
      "Shared content, private progress. Several learners can share a concept but never its mastery state.",
      "No paid infrastructure yet. Everything runs locally in the browser, so persistence has to fail loudly instead of pretending to save.",
    ],
    pl: [
      "Opanowanie musi być wytłumaczalne. Każdy stan wskazuje dowody i progi, które do niego doprowadziły.",
      "Tanie sygnały nie mogą odblokowywać mocnych twierdzeń. Samo dopasowanie słów kluczowych ani opinia modelu nie potwierdzają opanowania.",
      "Program nauki musi mieć oparcie w źródłach. Atom wiedzy cytuje dokładny fragment zaimportowanej wersji źródła — nic nie powstaje z nazw plików czy nagłówków.",
      "Wspólne treści, prywatne postępy. Wielu uczniów może dzielić pojęcie, ale nigdy jego stan opanowania.",
      "Na razie bez płatnej infrastruktury. Wszystko działa lokalnie w przeglądarce, więc zapis musi głośno zgłaszać błędy, zamiast udawać sukces.",
    ],
  },
  architecture: {
    body: {
      en: [
        "Dependencies point one way: web → data → AI and learning-engine → domain. Ingestion is a separate adapter consumed by the UI; config holds feature and cost policy plus the contracts for future managed services.",
        "The UI runs every mutation on a cloned store, validates the result and only then replaces visible state — a failed browser write can never be shown as a completed action.",
      ],
      pl: [
        "Zależności płyną w jednym kierunku: web → data → AI i learning-engine → domain. Pakiet ingestion to osobny adapter używany przez UI, a pakiet config przechowuje politykę funkcji i kosztów oraz kontrakty przyszłych usług zarządzanych.",
        "UI wykonuje każdą mutację na sklonowanym magazynie, waliduje wynik i dopiero wtedy podmienia widoczny stan — nieudany zapis w przeglądarce nigdy nie zostanie pokazany jako wykonana akcja.",
      ],
    },
    diagrams: ["lo-architecture"],
  },
  deepDives: [
    {
      id: "knowledge-model",
      title: { en: "How knowledge is modeled", pl: "Jak zamodelowano wiedzę" },
      diagram: "lo-domain",
      snippets: ["lo-atom-schema"],
      body: {
        en: [
          "Curriculum is a shared hierarchy — Course, Topic, Learning Objective, Knowledge Atom — kept strictly apart from learner-scoped state. Every entity has a Zod schema; IDs are bounded, timestamps are ISO UTC, scores are bounded to [0, 1].",
          "A Knowledge Atom is the smallest unit that can be assessed on its own: one concept with a question, a rubric of expected terms, prerequisites, related atoms, a difficulty from 1 to 5 and at least one citation. A citation binds a source ID, an immutable source version ID and a locator.",
          "Sources carry a truth context (exam truth or industry truth) and a status — current, legacy, to-verify, conflicting — so disagreements between materials are represented instead of silently merged.",
        ],
        pl: [
          "Program nauki to wspólna hierarchia — kurs, temat, cel kształcenia, atom wiedzy — ściśle oddzielona od stanu konkretnego ucznia. Każda encja ma schemat Zod; identyfikatory mają ograniczoną długość, znaczniki czasu są w ISO UTC, a wyniki mieszczą się w przedziale [0, 1].",
          "Atom wiedzy to najmniejsza jednostka, którą da się ocenić samodzielnie: jedno pojęcie z pytaniem, rubryką oczekiwanych terminów, wymaganiami wstępnymi, powiązanymi atomami, trudnością od 1 do 5 i co najmniej jednym cytatem. Cytat wiąże identyfikator źródła, niezmienny identyfikator wersji i lokalizator.",
          "Źródła mają kontekst prawdy (wymagania egzaminu albo praktyka branżowa) i status — aktualne, przestarzałe, do weryfikacji, sprzeczne — dzięki czemu rozbieżności między materiałami są jawnie reprezentowane, a nie po cichu scalane.",
        ],
      },
    },
    {
      id: "evidence",
      title: { en: "What counts as evidence", pl: "Co liczy się jako dowód" },
      body: {
        en: [
          "Evidence is typed proof attached to one atom and one dimension — recall, explanation, application, transfer or retention — with a score, a verifier and source citations. The verifier matters as much as the score: fake, keyword, model, human or test.",
          "Schema rules encode the non-negotiables. Delayed recall must target retention and be at least seven days old; human verification must actually come from a human. Evidence from the future, from another learner or with a duplicate ID is rejected.",
        ],
        pl: [
          "Dowód to typowane potwierdzenie przypisane do jednego atomu i jednego wymiaru — przypominania, wyjaśniania, zastosowania, transferu lub utrwalenia — z wynikiem, weryfikatorem i cytatami źródeł. Weryfikator jest równie ważny jak wynik: fake, keyword, model, human albo test.",
          "Reguły schematu zapisują zasady nienegocjowalne. Odroczone przypomnienie musi dotyczyć utrwalenia i mieć co najmniej siedem dni; weryfikacja ludzka musi naprawdę pochodzić od człowieka. Dowody z przyszłości, przypisane innemu uczniowi albo ze zdublowanym ID są odrzucane.",
        ],
      },
    },
    {
      id: "mastery",
      title: { en: "How mastery is updated", pl: "Jak aktualizowany jest stan opanowania" },
      diagram: "lo-ladder",
      snippets: ["lo-mastery"],
      body: {
        en: [
          "For each of the five dimensions the engine takes the mean of the latest three distinct evidence records. Missing dimensions score zero, recent failures pull the score down, and an old success is not a permanent unlock.",
          "States are evaluated from the top down. VERIFIED and MASTERED require human- or test-verified practical work; MASTERED additionally requires verified transfer and verified delayed recall after at least seven days. Keyword or model opinions can lift a learner to APPLIED — never past it.",
          "`whyMastery` returns the per-dimension reasons, the evidence IDs, the outstanding requirements and whether the state is provisional. The policy is a transparent product rule, not a validated psychometric model — and the documentation says so.",
        ],
        pl: [
          "Dla każdego z pięciu wymiarów silnik bierze średnią z trzech najnowszych, unikalnych dowodów. Brakujący wymiar ma wartość zero, świeże porażki obniżają wynik, a dawny sukces nie odblokowuje niczego na zawsze.",
          "Stany są sprawdzane od najwyższego. VERIFIED i MASTERED wymagają praktycznej pracy zweryfikowanej przez człowieka lub test; MASTERED dodatkowo wymaga zweryfikowanego transferu i zweryfikowanego przypomnienia po co najmniej siedmiu dniach. Opinie oparte na słowach kluczowych lub modelu mogą wynieść ucznia najwyżej do APPLIED.",
          "`whyMastery` zwraca uzasadnienie dla każdego wymiaru, identyfikatory dowodów, brakujące wymagania i informację, czy stan jest tymczasowy. To przejrzysta reguła produktowa, a nie zwalidowany model psychometryczny — i dokumentacja mówi to wprost.",
        ],
      },
    },
    {
      id: "core-loop",
      title: { en: "The core loop", pl: "Główna pętla" },
      diagram: "lo-loop",
      body: {
        en: [
          "There is no grade without an attempt — the gateway refuses grading and follow-ups until the learner has written something. `submitAttempt` checks the learner, the answer length and the feature flag, grades through the gateway, verifies that every citation resolves to a known source version within the task's own sources, and then commits Attempt, Evidence, learning state, session and usage record in one transaction.",
          "The session is a small state machine: QUESTION → ATTEMPTED → GRADED → COMPLETED. Any other transition throws.",
        ],
        pl: [
          "Nie ma oceny bez odpowiedzi — warstwa dostępu do modeli odmawia oceniania i pytań uzupełniających, dopóki uczeń czegoś nie napisze. `submitAttempt` sprawdza ucznia, długość odpowiedzi i flagę funkcji, ocenia odpowiedź przez tę warstwę, weryfikuje, że każdy cytat wskazuje znaną wersję źródła z puli danego zadania, a następnie w jednej transakcji zapisuje odpowiedź, dowód, stan nauki, sesję i rekord użycia.",
          "Sesja to mała maszyna stanów: QUESTION → ATTEMPTED → GRADED → COMPLETED. Każde inne przejście kończy się wyjątkiem.",
        ],
      },
    },
    {
      id: "misconceptions-review",
      title: { en: "Misconceptions and review scheduling", pl: "Błędne przekonania i planowanie powtórek" },
      snippets: ["lo-schedule"],
      body: {
        en: [
          "A misconception has a lifecycle, not a flag. A repeated detection increments recurrence and resets correction timing. The first correction marks it UNSTABLE, later ones CORRECTED, and only a successful retest at least seven days after the latest correction marks it VERIFIED. The UI deliberately has no self-verification button.",
          "Review scheduling is a pure function: a score below 0.6 schedules tomorrow; otherwise the interval is round((2 + score·5 + retention·7) / (1 + difficulty/5)) days, minimum one. It is simple on purpose — a calibrated scheduler can replace it without touching the rest of the engine.",
        ],
        pl: [
          "Błędne przekonanie ma cykl życia, a nie flagę. Ponowne wykrycie zwiększa licznik nawrotów i zeruje termin korekty. Pierwsza korekta oznacza je jako UNSTABLE, kolejne jako CORRECTED, a dopiero udany test co najmniej siedem dni po ostatniej korekcie — jako VERIFIED. Interfejs celowo nie ma przycisku „sam potwierdzam”.",
          "Planowanie powtórek to czysta funkcja: wynik poniżej 0,6 oznacza powtórkę jutro; w pozostałych przypadkach odstęp wynosi round((2 + wynik·5 + utrwalenie·7) / (1 + trudność/5)) dni, minimum jeden. Prostota jest celowa — skalibrowany harmonogram można podmienić bez ruszania reszty silnika.",
        ],
      },
    },
    {
      id: "readiness",
      title: { en: "Exam readiness and daily missions", pl: "Gotowość do egzaminu i misja dnia" },
      body: {
        en: [
          "Exam readiness is a weighted heuristic: coverage 10%, mean mastery 25%, recall 20%, retention 20%, verified practice 15%, recall on teacher-flagged concepts 10%. Unseen required concepts count as zero. The UI labels it as a transparent heuristic — never a probability or a predicted grade.",
          "The daily mission ranks atoms by recall weakness, overdue reviews, practical gaps, upcoming exams and explicit priorities, then greedily fills the learner's available minutes. Predictable, cheap and replaceable — not a globally optimal solver, and not presented as one.",
        ],
        pl: [
          "Gotowość do egzaminu to ważona heurystyka: pokrycie 10%, średnie opanowanie 25%, przypominanie 20%, utrwalenie 20%, zweryfikowana praktyka 15%, przypominanie pojęć wskazanych przez prowadzącego 10%. Niewidziane wymagane pojęcia liczą się jako zero. Interfejs opisuje wynik jako przejrzystą heurystykę — nigdy jako prawdopodobieństwo czy przewidywaną ocenę.",
          "Misja dnia szereguje atomy według słabości przypominania, zaległych powtórek, luk praktycznych, zbliżających się egzaminów i jawnych priorytetów, a potem zachłannie wypełnia dostępny czas. Przewidywalna, tania i wymienialna — to nie jest algorytm optymalny globalnie i nie jest tak przedstawiana.",
        ],
      },
    },
    {
      id: "ai-boundary",
      title: { en: "Where AI plugs in", pl: "Gdzie wchodzi AI" },
      snippets: ["lo-gateway", "lo-keyword"],
      body: {
        en: [
          "All model access goes through a provider-neutral `ModelGateway`. It validates the scope, refuses grading without an attempt, enforces a timeout with an abort signal, and validates both the structured output and the usage metadata. Errors are typed: TIMEOUT, INVALID_OUTPUT, PROVIDER_ERROR, ATTEMPT_REQUIRED, UNAVAILABLE.",
          "Today the only runtime provider is a deterministic keyword grader. It reports confidence as null and token counts and cost as zero, never invents a misconception, and tells the learner it checks wording, not understanding. Its evidence is stored as `keyword` and stays provisional.",
          "Generation, extraction and follow-up already have schemas, and an escalation policy routes low-confidence or high-stakes results to a stronger model or to a human. A real provider can be added behind the same interface once labeled evaluation data exists to judge it.",
        ],
        pl: [
          "Cały dostęp do modeli przechodzi przez niezależną od dostawcy warstwę `ModelGateway`. Sprawdza ona zakres, odmawia oceny bez odpowiedzi, egzekwuje limit czasu przez sygnał przerwania i waliduje zarówno ustrukturyzowany wynik, jak i metadane użycia. Błędy są typowane: TIMEOUT, INVALID_OUTPUT, PROVIDER_ERROR, ATTEMPT_REQUIRED, UNAVAILABLE.",
          "Obecnie jedynym dostawcą w działającej aplikacji jest deterministyczny oceniacz słów kluczowych. Zwraca pewność jako null, zerową liczbę tokenów i koszt, nigdy nie wymyśla błędnego przekonania i mówi wprost, że sprawdza sformułowania, a nie zrozumienie. Jego dowody są zapisywane jako `keyword` i pozostają tymczasowe.",
          "Generowanie, ekstrakcja i pytania uzupełniające mają już schematy, a polityka eskalacji kieruje wyniki o niskiej pewności lub wysokiej stawce do mocniejszego modelu albo do człowieka. Prawdziwego dostawcę można podpiąć pod ten sam interfejs, gdy powstaną oznaczone dane ewaluacyjne, którymi da się go ocenić.",
        ],
      },
    },
  ],
  decisions: [
    {
      decision: { en: "Separate domain logic from AI providers.", pl: "Oddzielić logikę domeny od dostawców AI." },
      why: {
        en: "Core learning logic should stay testable without a live LLM — and a model must not be the component that decides mastery.",
        pl: "Rdzeń logiki nauki musi być testowalny bez działającego LLM — a model nie może być komponentem, który rozstrzyga o opanowaniu.",
      },
      tradeoff: {
        en: "More abstraction up front; AI features wait for a provider adapter and for evaluation data.",
        pl: "Więcej abstrakcji na starcie; funkcje AI czekają na adapter dostawcy i dane ewaluacyjne.",
      },
    },
    {
      decision: { en: "Make the verifier part of the evidence.", pl: "Uczynić weryfikatora częścią dowodu." },
      why: {
        en: "A perfect score from a keyword match and one from a human reviewer are different claims. Recording who verified it lets the engine gate VERIFIED and MASTERED on trustworthy evidence only.",
        pl: "Idealny wynik z dopasowania słów kluczowych i od recenzenta-człowieka to dwa różne twierdzenia. Zapisanie, kto weryfikował, pozwala silnikowi wpuszczać do VERIFIED i MASTERED wyłącznie na podstawie wiarygodnych dowodów.",
      },
      tradeoff: {
        en: "Learners using only local grading cannot reach the top states yet — by design.",
        pl: "Uczniowie korzystający tylko z lokalnej oceny nie osiągną jeszcze najwyższych stanów — celowo.",
      },
    },
    {
      decision: { en: "Keep shared curriculum apart from learner state.", pl: "Oddzielić wspólny program od stanu ucznia." },
      why: {
        en: "Many learners share one concept; none share its mastery. Scope keys are (tenant, user) tuples, never user IDs alone.",
        pl: "Wielu uczniów dzieli jedno pojęcie, ale nikt nie dzieli stanu jego opanowania. Klucze zakresu to krotki (tenant, użytkownik), nigdy samo ID użytkownika.",
      },
      tradeoff: {
        en: "More repository plumbing and cross-record validation.",
        pl: "Więcej kodu w repozytoriach i walidacji między rekordami.",
      },
    },
    {
      decision: { en: "Stage mutations, then commit.", pl: "Najpierw przygotować zmianę, potem ją zatwierdzić." },
      why: {
        en: "Browser storage can fail — quota, blocked storage, another tab. The UI mutates a clone, validates and saves it, and only then shows the result.",
        pl: "Zapis w przeglądarce może się nie udać — limit miejsca, zablokowana pamięć przeglądarki, inna karta. Interfejs modyfikuje kopię, waliduje ją i zapisuje, a dopiero potem pokazuje wynik.",
      },
      tradeoff: {
        en: "Extra copying and a stale-write check instead of a simple state update.",
        pl: "Dodatkowe kopiowanie i kontrola nieaktualnych zapisów zamiast prostej aktualizacji stanu.",
      },
    },
    {
      decision: { en: "Ship deterministic grading before AI grading.", pl: "Najpierw deterministyczna ocena, potem ocena przez AI." },
      why: {
        en: "An honest, limited grader beats a convincing simulated one. It exercises the full pipeline — gateway, schema validation, citations, evidence, usage — at zero cost.",
        pl: "Uczciwy, ograniczony oceniacz jest lepszy niż przekonująca symulacja. Przechodzi przez cały potok — warstwę dostępu do modeli, walidację schematu, cytaty, dowody, rejestr użycia — bez żadnych kosztów.",
      },
      tradeoff: {
        en: "Feedback stays shallow until a real model is evaluated and connected.",
        pl: "Informacja zwrotna jest płytka, dopóki prawdziwy model nie zostanie oceniony i podłączony.",
      },
    },
  ],
  implementation: {
    items: {
      en: [
        "Seven workspace packages — domain, data, learning-engine, ai, ingestion, config, ui — plus the Next.js web app.",
        "Views: Overview, Today, Curriculum, Course, Topic, Knowledge Atom, Learn, Exam Readiness, Sources, Progress, Evidence, Misconceptions, Practice, Settings.",
        "Real TXT / Markdown import (UTF-8, up to 2 MB) with binary and encoding checks, NFC normalization and SHA-256 identity. Duplicates are rejected; Node and browser importers are tested against each other.",
        "Manual curriculum authoring: a Knowledge Atom must cite an excerpt that actually exists in the imported source.",
        "Multiple local learner profiles: shared content, separate attempts and progress.",
        "Versioned browser persistence with schema and reference validation, preserved corrupt snapshots, an explicit recovery screen, backup download and a confirmed, scoped reset.",
        "Stale-tab detection and explicit handling of quota and storage failures.",
        "A feature flag with tenant and user overrides that gates grading, and a governance policy that caps provider and cost per execution.",
        "EN / PL interface localization — in progress.",
      ],
      pl: [
        "Siedem pakietów w monorepo — domain, data, learning-engine, ai, ingestion, config, ui — oraz aplikacja webowa w Next.js.",
        "Widoki: Przegląd, Dziś, Program, Kurs, Temat, Atom wiedzy, Nauka, Gotowość do egzaminu, Źródła, Postępy, Dowody, Błędne przekonania, Praktyka, Ustawienia.",
        "Prawdziwy import TXT / Markdown (UTF-8, do 2 MB) z kontrolą binariów i kodowania, normalizacją NFC i tożsamością SHA-256. Duplikaty są odrzucane; importery dla Node i przeglądarki są testowane względem siebie.",
        "Ręczne tworzenie programu: atom wiedzy musi cytować fragment, który faktycznie istnieje w zaimportowanym źródle.",
        "Wiele lokalnych profili: wspólne treści, osobne odpowiedzi i postępy.",
        "Wersjonowany zapis w przeglądarce z walidacją schematu i referencji, zachowaniem uszkodzonych danych, jawnym ekranem odzyskiwania, pobieraniem kopii zapasowej i potwierdzanym, zawężonym resetem.",
        "Wykrywanie nieaktualnej karty oraz jawna obsługa przekroczenia limitu i błędów zapisu.",
        "Flaga funkcji z nadpisaniami na poziomie tenanta i użytkownika, która steruje oceną, oraz polityka ograniczająca dostawcę i koszt pojedynczego wykonania.",
        "Lokalizacja interfejsu EN / PL — w trakcie prac.",
      ],
    },
  },
  verification: {
    showLearningOsRun: true,
    snippets: ["lo-false-mastery"],
    body: {
      en: [
        "Verification is part of the product, not an afterthought. CI runs lint, a format check, a strict typecheck, the unit suites, the production build and browser tests against that build.",
        "Evals target the failure that matters most here — false mastery. Perfect scores from fake, keyword or model verifiers must never produce MASTERED. Regression fixtures pin grading scores, schema validity, misconception detection and citation grounding.",
        "Regression tests also check that runtime code never imports test fixtures or ships known synthetic content, and the browser suite covers corrupt data, legacy data, rejected imports, quota failures and cross-tab conflicts.",
      ],
      pl: [
        "Weryfikacja jest częścią produktu, a nie dodatkiem. CI uruchamia linter, kontrolę formatowania, ścisłe sprawdzanie typów, testy jednostkowe, build produkcyjny i testy w przeglądarce na tym buildzie.",
        "Ewaluacje celują w najgroźniejszy tu błąd — fałszywe opanowanie. Idealne wyniki od weryfikatorów fake, keyword i model nigdy nie mogą dać MASTERED. Fikstury regresji przypinają wyniki oceniania, poprawność schematu, wykrywanie błędnych przekonań i ugruntowanie cytatów.",
        "Testy regresji sprawdzają też, że kod produkcyjny nigdy nie importuje fikstur testowych ani nie zawiera znanych danych syntetycznych, a testy w przeglądarce obejmują uszkodzone dane, dane z poprzedniej wersji, odrzucone importy, przekroczenie limitu i konflikty między kartami.",
      ],
    },
  },
  failureModes: [
    {
      name: { en: "Incorrect grading", pl: "Błędna ocena" },
      symptom: {
        en: "A keyword match rewards the right words with the wrong understanding.",
        pl: "Dopasowanie słów kluczowych nagradza właściwe słowa przy złym zrozumieniu.",
      },
      guard: {
        en: "Keyword evidence is labeled, stays provisional and cannot pass the VERIFIED gate; the feedback states its own limits. Grading quality itself is not solved.",
        pl: "Dowody z dopasowania słów są oznaczone, pozostają tymczasowe i nie przechodzą bramki VERIFIED; informacja zwrotna sama mówi o swoich ograniczeniach. Sama jakość oceny nie jest rozwiązana.",
      },
      state: "partial",
    },
    {
      name: { en: "Weak evidence promoted to mastery", pl: "Słabe dowody awansowane do opanowania" },
      symptom: {
        en: "Many cheap signals add up to a strong claim.",
        pl: "Wiele tanich sygnałów składa się na mocne twierdzenie.",
      },
      guard: {
        en: "Top states require human- or test-verified practical, transfer and delayed-recall evidence. Covered by the false-mastery evals.",
        pl: "Najwyższe stany wymagają zweryfikowanych przez człowieka lub test dowodów praktyki, transferu i odroczonego przypomnienia. Pokryte ewaluacjami fałszywego opanowania.",
      },
      state: "verified",
    },
    {
      name: { en: "Ungrounded content", pl: "Treść bez oparcia w źródłach" },
      symptom: {
        en: "An atom or a grade cites something that is not in the source.",
        pl: "Atom albo ocena cytuje coś, czego nie ma w źródle.",
      },
      guard: {
        en: "Citations must resolve to a known source version within the task's sources, and excerpts are checked against source text. Schema validity alone does not prove semantic groundedness — documented as a limit.",
        pl: "Cytaty muszą wskazywać znaną wersję źródła z puli zadania, a fragmenty są sprawdzane z tekstem źródła. Poprawny schemat nie dowodzi semantycznego ugruntowania — to udokumentowane ograniczenie.",
      },
      state: "partial",
    },
    {
      name: { en: "Duplicate knowledge", pl: "Zdublowana wiedza" },
      symptom: {
        en: "The same material imported twice, or two atoms for one concept, splits the evidence.",
        pl: "Ten sam materiał zaimportowany dwa razy albo dwa atomy dla jednego pojęcia rozpraszają dowody.",
      },
      guard: {
        en: "Identical normalized content is rejected by checksum and duplicate names are checked. Semantic duplicates between different atoms are not detected yet.",
        pl: "Identyczna znormalizowana treść jest odrzucana na podstawie sumy kontrolnej, a duplikaty nazw są sprawdzane. Semantyczne duplikaty między różnymi atomami nie są jeszcze wykrywane.",
      },
      state: "partial",
    },
    {
      name: { en: "Bad source extraction", pl: "Błędna ekstrakcja źródła" },
      symptom: {
        en: "Encoding errors or binary files turn into garbage text.",
        pl: "Błędy kodowania albo pliki binarne zamieniają się w bezużyteczny tekst.",
      },
      guard: {
        en: "Strict UTF-8 decoding, binary control-character checks and size limits. PDF, DOCX and OCR formats are not falsely accepted.",
        pl: "Ścisłe dekodowanie UTF-8, kontrola znaków sterujących i limity rozmiaru. Formaty PDF, DOCX i OCR nie są fałszywie akceptowane.",
      },
      state: "verified",
    },
    {
      name: { en: "Incorrect mastery updates", pl: "Błędna aktualizacja opanowania" },
      symptom: {
        en: "Evidence from another learner, from the future, or counted twice.",
        pl: "Dowody innego ucznia, z przyszłości albo policzone dwa razy.",
      },
      guard: {
        en: "Scope assertions, future-timestamp rejection, evidence-ID deduplication and a transactional commit.",
        pl: "Asercje zakresu, odrzucanie przyszłych znaczników czasu, deduplikacja ID dowodów i zapis transakcyjny.",
      },
      state: "verified",
    },
    {
      name: { en: "Silent data loss", pl: "Cicha utrata danych" },
      symptom: {
        en: "A failed browser write is reported as success.",
        pl: "Nieudany zapis w przeglądarce jest zgłaszany jako sukces.",
      },
      guard: {
        en: "Mutations are staged and validated before display; quota and storage failures are surfaced, stale tabs detected and corrupt data preserved behind recovery.",
        pl: "Mutacje są przygotowywane i walidowane przed wyświetleniem; błędy limitu i zapisu są pokazywane, nieaktualne karty wykrywane, a uszkodzone dane zachowywane za ekranem odzyskiwania.",
      },
      state: "verified",
    },
  ],
  now: {
    en: [
      "Local learner profiles",
      "Course, Topic and Knowledge Atom authoring",
      "TXT / Markdown ingestion with provenance",
      "Deterministic grading through the model gateway",
      "Evidence, mastery and review scheduling",
      "Misconception lifecycle in the engine",
      "Exam-readiness heuristic and daily missions",
      "Versioned persistence with recovery",
      "Feature and cost governance policies",
      "Unit, eval and browser test suites",
    ],
    pl: [
      "Lokalne profile uczniów",
      "Tworzenie kursów, tematów i atomów wiedzy",
      "Import TXT / Markdown z pochodzeniem źródła",
      "Deterministyczna ocena przez warstwę dostępu do modeli",
      "Dowody, opanowanie i planowanie powtórek",
      "Cykl życia błędnych przekonań w silniku",
      "Heurystyka gotowości i misja dnia",
      "Wersjonowany zapis z odzyskiwaniem",
      "Polityki funkcji i kosztów",
      "Testy jednostkowe, ewaluacyjne i w przeglądarce",
    ],
  },
  next: {
    en: [
      "Production authentication and authorization",
      "Durable cloud storage and database",
      "Managed extraction: PDF, DOCX, OCR, audio",
      "Production retrieval over source versions",
      "Live model providers behind the gateway",
      "Labeled datasets for semantic grading",
      "Workflow orchestration for scheduled reviews",
      "Observability, audit and budgets",
      "Cloud deployment architecture",
    ],
    pl: [
      "Produkcyjne uwierzytelnianie i autoryzacja",
      "Trwały magazyn i baza danych w chmurze",
      "Zarządzana ekstrakcja: PDF, DOCX, OCR, audio",
      "Produkcyjne wyszukiwanie po wersjach źródeł",
      "Prawdziwi dostawcy modeli za warstwą dostępu",
      "Oznaczone dane do oceny semantycznej",
      "Orkiestracja zaplanowanych powtórek",
      "Obserwowalność, audyt i budżety",
      "Architektura wdrożenia w chmurze",
    ],
  },
  lessons: {
    en: [
      "Naming limits honestly is a feature. Calling the grader a keyword check and setting its confidence to null removed a whole class of misleading UI.",
      "The highest-risk failure in a learning system is false confidence, so it deserves its own eval — not just unit tests of the happy path.",
      "A pure, clock-injected engine made every policy testable in milliseconds and kept infrastructure decisions out of the learning rules.",
      "Test fixtures need a hard boundary. Once demo data could leak into runtime, a regression test became the cheapest guard.",
    ],
    pl: [
      "Uczciwe nazywanie ograniczeń to funkcja produktu. Nazwanie oceniacza „sprawdzeniem słów kluczowych” i ustawienie jego pewności na null usunęło całą klasę mylących elementów interfejsu.",
      "Najgroźniejszy błąd systemu nauki to fałszywa pewność, więc zasługuje na własną ewaluację — a nie tylko na testy jednostkowe scenariuszy pozytywnych.",
      "Czysty silnik ze wstrzykiwanym zegarem pozwolił testować każdą regułę w milisekundach i trzymał decyzje infrastrukturalne z dala od reguł nauki.",
      "Fikstury testowe potrzebują twardej granicy. Gdy dane demonstracyjne mogły przeciec do produkcji, test regresji okazał się najtańszym zabezpieczeniem.",
    ],
  },
  nextIteration: {
    en: [
      "Bring the EN / PL browser suite back to green and keep it blocking in CI.",
      "Build a labeled answer set and evaluate a real model grader against it before enabling one.",
      "Add retrieval over source versions, evaluated at the citation level.",
      "Implement server-side adapters with verified identity and cross-tenant integration tests.",
      "Introduce trusted workflows for practical tasks, transfer tasks and delayed recall.",
    ],
    pl: [
      "Przywrócić zielony stan testów EN / PL w przeglądarce i utrzymać je jako blokujące w CI.",
      "Zbudować oznaczony zbiór odpowiedzi i ocenić na nim prawdziwy model, zanim zostanie włączony.",
      "Dodać wyszukiwanie po wersjach źródeł, ewaluowane na poziomie cytatów.",
      "Zaimplementować adaptery serwerowe ze zweryfikowaną tożsamością i testami izolacji między tenantami.",
      "Wprowadzić zaufane przepływy dla zadań praktycznych, zadań transferowych i odroczonego przypomnienia.",
    ],
  },
  screenshots: [
    {
      src: "/projects/learning-os/overview-desktop.png",
      title: { en: "Daily mission", pl: "Misja dnia" },
      width: 1280,
      height: 720,
      alt: {
        en: "Learning OS overview screen: sidebar navigation and a daily mission listing one Knowledge Atom with its reasons and time estimate.",
        pl: "Ekran przeglądu Learning OS: nawigacja boczna i misja dnia z jednym atomem wiedzy, powodami wyboru i szacowanym czasem.",
      },
      caption: {
        en: "Captured by the project's Playwright suite against the production build; learner and atom are test-authored.",
        pl: "Zrzut wykonany przez testy Playwright projektu na buildzie produkcyjnym; uczeń i atom zostały utworzone przez test.",
      },
    },
    {
      src: "/projects/learning-os/first-learner-desktop.png",
      title: { en: "First run", pl: "Pierwsze uruchomienie" },
      width: 1280,
      height: 720,
      alt: {
        en: "Learning OS first run: an empty workspace asking the user to create their first learner.",
        pl: "Pierwsze uruchomienie Learning OS: pusta przestrzeń z prośbą o utworzenie pierwszego profilu ucznia.",
      },
      caption: {
        en: "First run starts empty — no demo learner, curriculum or progress.",
        pl: "Pierwsze uruchomienie jest puste — bez przykładowego ucznia, programu czy postępów.",
      },
    },
    {
      src: "/projects/learning-os/sources-mobile.png",
      title: { en: "Sources on a phone", pl: "Źródła na telefonie" },
      width: 390,
      height: 1141,
      alt: {
        en: "Learning OS Sources view on a phone: import form for TXT or Markdown files and an imported source marked as needing review.",
        pl: "Widok źródeł Learning OS na telefonie: formularz importu plików TXT lub Markdown i zaimportowane źródło oznaczone jako wymagające przeglądu.",
      },
      caption: {
        en: "Imported text starts as “needs review”.",
        pl: "Zaimportowany tekst dostaje na start status „wymaga przeglądu”.",
      },
    },
  ],
};
