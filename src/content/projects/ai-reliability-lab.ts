import type { Project } from "../types";

export const aiReliabilityLab: Project = {
  slug: "ai-reliability-lab",
  index: "02",
  tier: "flagship",
  title: { en: "AI Reliability Evaluation Lab", pl: "Laboratorium niezawodności AI" },
  subtitle: {
    en: "Evaluation and regression infrastructure for RAG pipelines, prompts, structured outputs, tool calls and agents.",
    pl: "Infrastruktura ewaluacji i ochrony przed regresją dla potoków RAG, promptów, ustrukturyzowanych odpowiedzi, wywołań narzędzi i agentów.",
  },
  question: {
    en: "How do you know whether your AI system improved — or silently regressed?",
    pl: "Skąd wiesz, czy twój system AI się poprawił — czy po cichu pogorszył?",
  },
  statuses: ["active-development", "engineering-lab"],
  categories: ["ai", "reliability"],
  year: "2026",
  type: { en: "LLM evaluation & regression harness", pl: "Ewaluacja LLM i ochrona przed regresją" },
  role: { en: "Methodology · Engineering", pl: "Metodyka · Inżynieria" },
  contribution: {
    en: "Evaluation methodology and harness design; the first evaluator contract and evals, running inside Learning OS.",
    pl: "Metodyka ewaluacji i projekt zestawu testów; pierwszy kontrakt ewaluatora i ewaluacje działające w Learning OS.",
  },
  stack: { en: ["TypeScript", "Vitest", "Zod"], pl: ["TypeScript", "Vitest", "Zod"] },
  statusLine: {
    en: "Engineering lab · in active development",
    pl: "Laboratorium inżynierskie · w aktywnym rozwoju",
  },
  homeNote: {
    en: "The first harness runs inside Learning OS; no benchmark results are published yet.",
    pl: "Pierwszy zestaw działa w Learning OS; wyniki nie są jeszcze publikowane.",
  },
  resultsNote: {
    en: "No RAG benchmark results yet. The one measured result comes from the Learning OS evals.",
    pl: "Nie ma jeszcze wyników benchmarków RAG. Jedyny zmierzony wynik pochodzi z ewaluacji Learning OS.",
  },
  evidenceNote: {
    en: "Methodology and work in progress. Code shown comes verbatim from the Learning OS repository, where the first harness runs. No RAG benchmark results are published yet.",
    pl: "Metodyka i prace w toku. Pokazany kod pochodzi bez zmian z repozytorium Learning OS, gdzie działa pierwsza wersja zestawu ewaluacji. Nie opublikowano jeszcze wyników benchmarków RAG.",
  },
  overview: {
    en: [
      "Most teams can ship an LLM feature. Far fewer can say, with evidence, whether last week's prompt change, model upgrade or retrieval tweak made it better or worse. This lab is where I build that capability: datasets, evaluators, thresholds and regression gates for RAG pipelines, prompts, structured outputs, tool calls and agents.",
      "It is an engineering lab, not a product. The first concrete harness runs inside Learning OS — typed eval cases, a test-only fake provider, false-mastery and regression checks in the normal test suite. The broader RAG and agent harness is in active development.",
    ],
    pl: [
      "Większość zespołów potrafi wdrożyć funkcję opartą na LLM. Znacznie mniej potrafi z dowodami powiedzieć, czy zeszłotygodniowa zmiana promptu, aktualizacja modelu albo poprawka wyszukiwania coś poprawiły, czy pogorszyły. W tym laboratorium buduję tę zdolność: zbiory danych, ewaluatory, progi i bramki regresji dla potoków RAG, promptów, ustrukturyzowanych odpowiedzi, wywołań narzędzi i agentów.",
      "To laboratorium inżynierskie, a nie produkt. Pierwszy konkretny zestaw działa w Learning OS — typowane przypadki ewaluacyjne, testowy dostawca modelu, testy fałszywego opanowania i regresji w zwykłym zestawie testów. Szerszy zestaw dla RAG i agentów jest w aktywnym rozwoju.",
    ],
  },
  problem: {
    en: [
      "Traditional software is mostly deterministic: same input, same output, and an assertion either holds or it doesn't. LLM systems are probabilistic. The same prompt can produce different answers, a better answer can be phrased differently, and a regression can hide inside an average that barely moved.",
      "Without evaluation, every change to a prompt, model or retriever is a guess — and the failures that matter most, such as an unsupported claim, a wrong citation or an invalid tool call, are exactly the ones a quick manual check misses.",
    ],
    pl: [
      "Klasyczne oprogramowanie jest w większości deterministyczne: to samo wejście, to samo wyjście, a asercja albo jest spełniona, albo nie. Systemy LLM są probabilistyczne. Ten sam prompt może dać różne odpowiedzi, lepsza odpowiedź może być inaczej sformułowana, a regresja potrafi ukryć się w średniej, która ledwo drgnęła.",
      "Bez ewaluacji każda zmiana promptu, modelu czy wyszukiwarki to zgadywanie — a błędy, które mają największe znaczenie, jak twierdzenie bez pokrycia, zły cytat czy niepoprawne wywołanie narzędzia, to właśnie te, które umykają szybkiej ręcznej kontroli.",
    ],
  },
  constraints: {
    en: [
      "There is rarely one correct answer. Evaluation has to accept valid variation while still catching real errors.",
      "Automated judges are models too. An LLM-as-a-judge has its own bias and variance and needs calibration against human labels.",
      "Retrieval and generation fail differently. A correct-looking answer built on the wrong context is still a defect.",
      "Evaluation costs time and money. Not every check can run on every commit.",
      "Averages hide regressions. A small mean improvement can mask a severe failure on a critical slice.",
    ],
    pl: [
      "Rzadko istnieje jedna poprawna odpowiedź. Ewaluacja musi akceptować poprawne warianty, a jednocześnie wyłapywać prawdziwe błędy.",
      "Automatyczni sędziowie też są modelami. LLM w roli sędziego ma własne uprzedzenia i wariancję i wymaga kalibracji względem ocen ludzi.",
      "Wyszukiwanie i generowanie zawodzą inaczej. Poprawnie wyglądająca odpowiedź zbudowana na złym kontekście nadal jest błędem.",
      "Ewaluacja kosztuje czas i pieniądze. Nie każdy test może działać przy każdym commicie.",
      "Średnie ukrywają regresje. Niewielka poprawa średniej może maskować poważny błąd w krytycznym wycinku danych.",
    ],
  },
  architecture: {
    body: {
      en: [
        "The harness treats a model change like any other code change: a versioned dataset, a pipeline under test, a set of evaluators, and an explicit decision against a recorded baseline.",
        "Each case flows through the same path as production — query, retrieval, model, response. Evaluators score the retrieved context and the final response separately, metrics are aggregated per dimension and per slice, and the run ends in a decision instead of a dashboard someone has to interpret.",
      ],
      pl: [
        "Zestaw traktuje zmianę modelu jak każdą inną zmianę w kodzie: wersjonowany zbiór danych, potok poddany testom, zestaw ewaluatorów i jawna decyzja względem zapisanej linii bazowej.",
        "Każdy przypadek przechodzi tę samą ścieżkę co na produkcji — zapytanie, wyszukiwanie, model, odpowiedź. Ewaluatory oceniają osobno pobrany kontekst i końcową odpowiedź, metryki są agregowane dla każdego wymiaru i wycinka, a przebieg kończy się decyzją, a nie pulpitem z wykresami, który ktoś musi zinterpretować.",
      ],
    },
    diagrams: ["eval-pipeline"],
  },
  deepDives: [
    {
      id: "regression",
      title: { en: "Regression thinking", pl: "Myślenie regresyjne" },
      diagram: "eval-regression",
      body: {
        en: [
          "AI development needs the same regression protection as traditional software. A candidate change — prompt, model, retrieval parameters — runs against the same suite as the recorded baseline. The comparison happens per dimension and per slice, and the gate accepts or rejects the change against declared thresholds.",
          "The goal is not a single score. It is a reproducible answer to a practical question: is this change safe to ship?",
        ],
        pl: [
          "Rozwój AI potrzebuje takiej samej ochrony przed regresją jak klasyczne oprogramowanie. Zmiana kandydująca — prompt, model, parametry wyszukiwania — przechodzi przez ten sam zestaw co zapisana linia bazowa. Porównanie odbywa się osobno dla każdego wymiaru i wycinka, a bramka akceptuje lub odrzuca zmianę na podstawie zadeklarowanych progów.",
          "Celem nie jest jeden wynik. Celem jest powtarzalna odpowiedź na praktyczne pytanie: czy tę zmianę można bezpiecznie wdrożyć?",
        ],
      },
    },
    {
      id: "evaluators",
      title: { en: "Evaluator types and their limits", pl: "Rodzaje ewaluatorów i ich ograniczenia" },
      diagram: "eval-evaluators",
      body: {
        en: [
          "No evaluator type is sufficient on its own. Deterministic checks are cheap and exact but only see structure. LLM judges see meaning but drift and need calibration. Retrieval metrics need labeled relevance. Humans are the ground truth — and the bottleneck. The harness combines them and records which evaluator produced each verdict.",
        ],
        pl: [
          "Żaden rodzaj ewaluatora nie wystarcza sam. Testy deterministyczne są tanie i dokładne, ale widzą tylko strukturę. Sędziowie LLM widzą znaczenie, ale dryfują i wymagają kalibracji. Metryki wyszukiwania potrzebują oznaczonej trafności. Ludzie są źródłem prawdy — i wąskim gardłem. Zestaw łączy te podejścia i zapisuje, który ewaluator wydał każdy werdykt.",
        ],
      },
    },
    {
      id: "not-one-metric",
      title: { en: "AI quality is not one metric", pl: "Jakość AI to nie jedna metryka" },
      body: {
        en: ["It is a system. Each part answers a different question, and removing any one of them leaves a blind spot."],
        pl: ["To system. Każdy element odpowiada na inne pytanie, a usunięcie któregokolwiek zostawia martwe pole."],
      },
      terms: [
        {
          term: { en: "Datasets", pl: "Zbiory danych" },
          def: {
            en: "Versioned cases that represent real usage, including the uncomfortable ones.",
            pl: "Wersjonowane przypadki odzwierciedlające realne użycie — także te niewygodne.",
          },
        },
        {
          term: { en: "Evaluators", pl: "Ewaluatory" },
          def: {
            en: "Deterministic, model-based, retrieval and human checks — each with a stated limit.",
            pl: "Testy deterministyczne, oparte na modelu, wyszukiwaniu i ocenie ludzi — każdy z jawnym ograniczeniem.",
          },
        },
        {
          term: { en: "Thresholds", pl: "Progi" },
          def: {
            en: "Declared before the run, per dimension, so the decision is not made after seeing the numbers.",
            pl: "Deklarowane przed przebiegiem dla każdego wymiaru, żeby decyzja nie zapadała po zobaczeniu liczb.",
          },
        },
        {
          term: { en: "Baselines", pl: "Linie bazowe" },
          def: {
            en: "A recorded reference run. Without one, “better” has no meaning.",
            pl: "Zapisany przebieg referencyjny. Bez niego „lepiej” nic nie znaczy.",
          },
        },
        {
          term: { en: "Regressions", pl: "Regresje" },
          def: {
            en: "Per-slice comparisons that surface what a single average hides.",
            pl: "Porównania w poszczególnych wycinkach, które pokazują to, co ukrywa jedna średnia.",
          },
        },
        {
          term: { en: "Edge cases", pl: "Przypadki brzegowe" },
          def: {
            en: "Adversarial inputs, empty retrieval, conflicting sources, prompt injection.",
            pl: "Wejścia adwersaryjne, puste wyniki wyszukiwania, sprzeczne źródła, prompt injection.",
          },
        },
        {
          term: { en: "Observations", pl: "Obserwacje" },
          def: {
            en: "Failures seen in use become new cases, so the suite grows from reality.",
            pl: "Błędy zauważone w użyciu stają się nowymi przypadkami, więc zestaw rośnie z rzeczywistości.",
          },
        },
      ],
    },
    {
      id: "first-harness",
      title: { en: "The first harness, inside Learning OS", pl: "Pierwszy zestaw, wewnątrz Learning OS" },
      snippets: ["lo-eval-contract"],
      body: {
        en: [
          "The evaluator contract already exists in code: typed eval cases with six categories — grading, groundedness, citations, structured output, false mastery and misconceptions. A test-only fake provider lets regression fixtures pin outputs, and a regression test keeps it out of runtime code.",
          "The false-mastery evals assert the most important property of that system: perfect scores from untrusted verifiers can never produce MASTERED.",
        ],
        pl: [
          "Kontrakt ewaluatora istnieje już w kodzie: typowane przypadki ewaluacyjne w sześciu kategoriach — ocenianie, ugruntowanie, cytaty, ustrukturyzowany wynik, fałszywe opanowanie i błędne przekonania. Testowy dostawca modelu pozwala fiksturom regresji przypinać wyniki, a osobny test pilnuje, żeby nie trafił do kodu produkcyjnego.",
          "Ewaluacje fałszywego opanowania sprawdzają najważniejszą właściwość tego systemu: idealne wyniki od niezaufanych weryfikatorów nigdy nie mogą dać MASTERED.",
        ],
      },
    },
  ],
  decisions: [
    {
      decision: {
        en: "Treat prompts, models and retrieval settings as versioned code.",
        pl: "Traktować prompty, modele i ustawienia wyszukiwania jak wersjonowany kod.",
      },
      why: {
        en: "A change you cannot diff and replay is a change you cannot evaluate.",
        pl: "Zmiany, której nie da się porównać i odtworzyć, nie da się też ocenić.",
      },
      tradeoff: {
        en: "Process overhead: every experiment needs a recorded configuration.",
        pl: "Narzut procesowy: każdy eksperyment wymaga zapisanej konfiguracji.",
      },
    },
    {
      decision: { en: "Score retrieval and generation separately.", pl: "Oceniać wyszukiwanie i generowanie osobno." },
      why: {
        en: "A good answer from bad context is luck; a bad answer from good context is a prompt or model problem. One combined score cannot tell them apart.",
        pl: "Dobra odpowiedź ze złego kontekstu to szczęście; zła odpowiedź z dobrego kontekstu to problem promptu albo modelu. Jeden łączny wynik ich nie rozróżni.",
      },
      tradeoff: {
        en: "Retrieval needs relevance labels, which are expensive to create.",
        pl: "Wyszukiwanie wymaga oznaczeń trafności, których przygotowanie jest kosztowne.",
      },
    },
    {
      decision: {
        en: "Prefer deterministic evaluators wherever they are sufficient.",
        pl: "Wybierać ewaluatory deterministyczne wszędzie, gdzie wystarczają.",
      },
      why: {
        en: "Schema, reference and format checks are fast, free and exact; they leave LLM judges for questions that need semantics.",
        pl: "Kontrola schematu, referencji i formatu jest szybka, darmowa i dokładna; sędziów LLM zostawia się dla pytań wymagających semantyki.",
      },
      tradeoff: {
        en: "Deterministic checks see structure only — a well-formed wrong answer passes them.",
        pl: "Testy deterministyczne widzą tylko strukturę — poprawnie sformatowana błędna odpowiedź je przejdzie.",
      },
    },
    {
      decision: {
        en: "Gate on per-dimension, per-slice thresholds — not one average.",
        pl: "Progi dla każdego wymiaru i wycinka — nie jedna średnia.",
      },
      why: {
        en: "Critical regressions hide inside small changes to a mean.",
        pl: "Krytyczne regresje chowają się w drobnych zmianach średniej.",
      },
      tradeoff: {
        en: "More thresholds to maintain, and more borderline rejections to investigate.",
        pl: "Więcej progów do utrzymania i więcej granicznych odrzuceń do zbadania.",
      },
    },
    {
      decision: { en: "Keep humans in the loop for calibration.", pl: "Zostawić ludzi w pętli do kalibracji." },
      why: {
        en: "An LLM judge is only as trustworthy as its agreement with human labels on a sample.",
        pl: "Sędzia LLM jest wiarygodny tylko w takim stopniu, w jakim zgadza się z ocenami ludzi na próbce.",
      },
      tradeoff: {
        en: "Human review is slow; it calibrates the judges rather than grading every run.",
        pl: "Ocena ludzka jest powolna; służy kalibracji sędziów, a nie ocenie każdego przebiegu.",
      },
    },
  ],
  implementation: {
    items: {
      en: [
        "Typed evaluation contract (`EvalCase`, `Evaluator`) with six categories — implemented in Learning OS.",
        "Test-only fake model provider, kept out of runtime code by a regression test.",
        "Regression fixtures that pin grading score, misconception detection, schema validity and citation grounding.",
        "False-mastery evals: perfect fake, keyword and model scores across all five dimensions must not yield MASTERED.",
        "Schema-validated structured outputs and usage metadata at the model gateway, with typed errors.",
        "In development: dataset format, retrieval metrics, an LLM judge with calibration, and baseline-vs-candidate reports for RAG pipelines.",
      ],
      pl: [
        "Typowany kontrakt ewaluacji (`EvalCase`, `Evaluator`) z sześcioma kategoriami — zaimplementowany w Learning OS.",
        "Testowy dostawca modelu, trzymany z dala od kodu produkcyjnego przez test regresji.",
        "Fikstury regresji przypinające wynik oceny, wykrywanie błędnych przekonań, poprawność schematu i ugruntowanie cytatów.",
        "Ewaluacje fałszywego opanowania: idealne wyniki fake, keyword i model we wszystkich pięciu wymiarach nie mogą dać MASTERED.",
        "Walidacja schematów ustrukturyzowanych wyników i metadanych użycia w warstwie dostępu do modeli, z typowanymi błędami.",
        "W trakcie prac: format zbiorów danych, metryki wyszukiwania, sędzia LLM z kalibracją oraz raporty porównujące linię bazową z kandydatem dla potoków RAG.",
      ],
    },
  },
  verification: {
    snippets: ["lo-false-mastery"],
    body: {
      en: [
        "The Learning OS evals run in the normal Vitest suite and in CI. On 29 October 2026 all 7 eval checks passed in a local run.",
        "When the RAG harness publishes results, every number will come with its dataset, configuration and evaluator.",
      ],
      pl: [
        "Ewaluacje Learning OS działają w zwykłym zestawie Vitest i w CI. 29 października 2026 wszystkie 7 testów ewaluacyjnych przeszło w lokalnym uruchomieniu.",
        "Gdy zestaw dla RAG opublikuje wyniki, każda liczba pojawi się razem ze zbiorem danych, konfiguracją i ewaluatorem.",
      ],
    },
  },
  failureModes: [
    {
      name: { en: "Irrelevant retrieval", pl: "Nietrafione wyszukiwanie" },
      symptom: {
        en: "The retriever returns plausible but wrong passages, and the model answers fluently from them.",
        pl: "Wyszukiwarka zwraca wiarygodnie wyglądające, ale błędne fragmenty, a model płynnie na nich odpowiada.",
      },
      guard: {
        en: "Context relevance and retrieval recall / precision scored separately from the answer.",
        pl: "Trafność kontekstu oraz recall / precision wyszukiwania oceniane osobno od odpowiedzi.",
      },
      state: "designed",
    },
    {
      name: { en: "Hallucination", pl: "Halucynacja" },
      symptom: {
        en: "Claims that no retrieved source supports.",
        pl: "Twierdzenia, których nie potwierdza żadne pobrane źródło.",
      },
      guard: {
        en: "Citations must resolve to known source versions (implemented in Learning OS); claim-level groundedness evaluation is in development.",
        pl: "Cytaty muszą wskazywać znane wersje źródeł (zaimplementowane w Learning OS); ewaluacja ugruntowania na poziomie twierdzeń jest w trakcie prac.",
      },
      state: "partial",
    },
    {
      name: { en: "Context poisoning", pl: "Zatruty kontekst" },
      symptom: {
        en: "A retrieved document carries instructions or false content that steers the model.",
        pl: "Pobrany dokument zawiera instrukcje lub fałszywe treści, które sterują modelem.",
      },
      guard: {
        en: "An adversarial dataset slice with injected instructions; source provenance and allow-lists.",
        pl: "Adwersaryjny wycinek danych ze wstrzykniętymi instrukcjami; pochodzenie źródeł i listy dozwolonych źródeł.",
      },
      state: "designed",
    },
    {
      name: { en: "Prompt regressions", pl: "Regresje promptów" },
      symptom: {
        en: "A prompt edit fixes one case and silently breaks others.",
        pl: "Poprawka promptu naprawia jeden przypadek i po cichu psuje inne.",
      },
      guard: {
        en: "The full suite runs against the baseline before a change is accepted, compared per slice.",
        pl: "Zanim zmiana zostanie przyjęta, pełny zestaw jest porównywany z linią bazową w każdym wycinku.",
      },
      state: "designed",
    },
    {
      name: { en: "Missing evidence", pl: "Brak dowodów" },
      symptom: {
        en: "The answer may be right, but it cites nothing or cites the wrong source.",
        pl: "Odpowiedź może być poprawna, ale niczego nie cytuje albo cytuje złe źródło.",
      },
      guard: {
        en: "At least one citation is required by schema and validated against source versions.",
        pl: "Schemat wymaga co najmniej jednego cytatu, walidowanego względem wersji źródeł.",
      },
      state: "verified",
    },
    {
      name: { en: "Invalid structured output", pl: "Niepoprawny ustrukturyzowany wynik" },
      symptom: {
        en: "JSON that parses but violates the contract — or does not parse at all.",
        pl: "JSON, który się parsuje, ale łamie kontrakt — albo nie parsuje się wcale.",
      },
      guard: {
        en: "Schema validation at the gateway; INVALID_OUTPUT is a typed error, never a silent fallback.",
        pl: "Walidacja schematu w warstwie dostępu do modeli; INVALID_OUTPUT to typowany błąd, nigdy ciche przejście na wartość domyślną.",
      },
      state: "verified",
    },
    {
      name: { en: "Judge drift", pl: "Dryf sędziego" },
      symptom: {
        en: "An LLM judge changes its verdicts when the judge model is updated.",
        pl: "Sędzia LLM zmienia werdykty po aktualizacji swojego modelu.",
      },
      guard: {
        en: "Pinned judge model and prompt; periodic recalibration against a human-labeled sample.",
        pl: "Przypięty model i prompt sędziego; okresowa rekalibracja względem próbki ocenionej przez ludzi.",
      },
      state: "designed",
    },
  ],
  now: {
    en: [
      "Evaluator contract and categories",
      "Fake provider for deterministic regression fixtures",
      "False-mastery and regression evals in CI",
      "Schema-validated outputs and typed gateway errors",
      "Citation resolution checks",
    ],
    pl: [
      "Kontrakt ewaluatora i kategorie",
      "Testowy dostawca do deterministycznych fikstur",
      "Ewaluacje fałszywego opanowania i regresji w CI",
      "Walidowane wyniki i typowane błędy dostępu do modeli",
      "Kontrola rozwiązywania cytatów",
    ],
  },
  next: {
    en: [
      "Versioned RAG evaluation datasets",
      "Retrieval metrics: recall, precision, ranking",
      "LLM-as-a-judge with human calibration",
      "Baseline-vs-candidate regression reports",
      "Adversarial and prompt-injection slices",
      "Tool-call and agent trajectory evaluation",
    ],
    pl: [
      "Wersjonowane zbiory ewaluacyjne dla RAG",
      "Metryki wyszukiwania: recall, precyzja, ranking",
      "LLM w roli sędziego z kalibracją przez ludzi",
      "Raporty regresji: linia bazowa vs kandydat",
      "Wycinki adwersaryjne i prompt injection",
      "Ewaluacja wywołań narzędzi i trajektorii agentów",
    ],
  },
  lessons: {
    en: [
      "The most valuable eval encodes your worst failure. In Learning OS that was false mastery — not grading accuracy.",
      "Evaluation design starts before the model. If an output has no schema and no citations, there is very little to evaluate.",
      "Every evaluator needs a stated limit. A check that passes a well-formed wrong answer is still useful, as long as nobody mistakes it for a correctness check.",
    ],
    pl: [
      "Najcenniejsza ewaluacja koduje twój najgorszy błąd. W Learning OS było to fałszywe opanowanie — a nie dokładność oceniania.",
      "Projektowanie ewaluacji zaczyna się przed modelem. Jeśli wynik nie ma schematu ani cytatów, niewiele da się ocenić.",
      "Każdy ewaluator potrzebuje jawnie opisanego ograniczenia. Test, który przepuszcza poprawnie sformatowaną błędną odpowiedź, nadal jest przydatny — dopóki nikt nie bierze go za sprawdzenie poprawności.",
    ],
  },
  nextIteration: {
    en: [
      "Publish a small, versioned RAG dataset with relevance labels.",
      "Implement baseline-vs-candidate reports with per-slice deltas.",
      "Calibrate an LLM judge against a human-labeled sample and record the agreement.",
      "Wire the suite into CI as an informational check before making it blocking.",
    ],
    pl: [
      "Opublikować mały, wersjonowany zbiór RAG z oznaczeniami trafności.",
      "Zaimplementować raporty linia bazowa vs kandydat z różnicami dla każdego wycinka.",
      "Skalibrować sędziego LLM na próbce ocenionej przez ludzi i zapisać poziom zgodności.",
      "Podłączyć zestaw do CI najpierw jako test informacyjny, a dopiero potem blokujący.",
    ],
  },
};
