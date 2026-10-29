import type { Project } from "../types";

export const resilienceFramework: Project = {
  slug: "resilience-framework",
  index: "04",
  tier: "standard",
  title: { en: "Automation & Resilience Test Framework", pl: "Framework testów automatycznych i odporności" },
  subtitle: {
    en: "A Java and TestNG framework for testing behavior under imperfect conditions — not only the happy path.",
    pl: "Framework w Javie i TestNG do testowania zachowania w niesprzyjających warunkach — nie tylko w scenariuszu pozytywnym.",
  },
  question: {
    en: "Does the application still behave correctly when the network is slow and the files are large?",
    pl: "Czy aplikacja nadal działa poprawnie, gdy sieć jest wolna, a pliki duże?",
  },
  statuses: ["engineering-project"],
  categories: ["automation", "reliability"],
  type: { en: "Test automation framework", pl: "Framework automatyzacji testów" },
  role: { en: "Framework design · Implementation", pl: "Projekt frameworka · Implementacja" },
  contribution: {
    en: "Framework design and implementation: suite composition, file-transfer and throttling scenarios, reporting.",
    pl: "Projekt i implementacja frameworka: kompozycja zestawów, scenariusze transferu plików i ograniczania sieci, raportowanie.",
  },
  stack: { en: ["Java", "TestNG", "TestNG XML suites"], pl: ["Java", "TestNG", "zestawy XML TestNG"] },
  statusLine: {
    en: "Engineering project",
    pl: "Projekt inżynierski",
  },
  homeNote: {
    en: "Java and TestNG. The code is not public yet; the case study describes the design.",
    pl: "Java i TestNG. Kod nie jest jeszcze publiczny; opis projektu przedstawia jego założenia.",
  },
  resultsNote: {
    en: "No code or results are public yet.",
    pl: "Kod ani wyniki nie są jeszcze publiczne.",
  },
  evidenceNote: {
    en: "Engineering project. The code is not public yet, so this page describes the design: suites, conditions and what each scenario asserts.",
    pl: "Projekt inżynierski. Kod nie jest jeszcze publiczny, więc ta strona opisuje założenia: zestawy, warunki i to, co sprawdza każdy scenariusz.",
  },
  overview: {
    en: [
      "An automation framework built on Java and TestNG to test behavior under imperfect conditions: slow networks, file uploads and downloads, and execution configurations that go beyond a single happy-path run.",
      "Suites are composed through TestNG XML, so the same tests can run under different conditions without being rewritten.",
    ],
    pl: [
      "Framework automatyzacji w Javie i TestNG do testowania zachowania w niesprzyjających warunkach: przy wolnej sieci, wysyłaniu i pobieraniu plików oraz w konfiguracjach wykonania wykraczających poza pojedynczy przebieg scenariusza pozytywnego.",
      "Zestawy są komponowane przez pliki XML TestNG, więc te same testy mogą działać w różnych warunkach bez przepisywania.",
    ],
  },
  problem: {
    en: [
      "Happy-path UI automation confirms that a feature works when everything around it works. Real users upload large files on unstable connections and download reports over throttled networks. Defects in timeouts, progress handling and recovery stay invisible until production.",
    ],
    pl: [
      "Automatyzacja UI oparta na scenariuszach pozytywnych potwierdza, że funkcja działa, gdy wszystko wokół niej działa. Prawdziwi użytkownicy wysyłają duże pliki przez niestabilne łącza i pobierają raporty przy ograniczonej przepustowości. Błędy w limitach czasu, obsłudze postępu i odzyskiwaniu pozostają niewidoczne aż do produkcji.",
    ],
  },
  constraints: {
    en: [
      "Conditions must be reproducible. Throttling that varies from run to run produces noise, not evidence.",
      "Same test, different conditions. Duplicating tests for every condition does not scale.",
      "File operations are hard to assert. Uploads and downloads need verification beyond “the button was clicked”.",
      "Slow tests are expensive. Not every resilience scenario can run on every change.",
    ],
    pl: [
      "Warunki muszą być powtarzalne. Ograniczanie przepustowości, które zmienia się między uruchomieniami, daje szum, a nie dowody.",
      "Ten sam test, różne warunki. Kopiowanie testów dla każdego wariantu się nie skaluje.",
      "Operacje na plikach trudno sprawdzić. Wysyłanie i pobieranie wymagają weryfikacji wykraczającej poza „przycisk został kliknięty”.",
      "Wolne testy są drogie. Nie każdy scenariusz odporności może działać przy każdej zmianie.",
    ],
  },
  architecture: {
    body: {
      en: [
        "Tests describe behavior; suites describe conditions. TestNG XML suites combine test classes with execution parameters — network profile, runner configuration, grouping — so a scenario can run under baseline and degraded conditions without being rewritten.",
      ],
      pl: [
        "Testy opisują zachowanie, zestawy opisują warunki. Zestawy XML TestNG łączą klasy testów z parametrami wykonania — profilem sieci, konfiguracją runnera, grupowaniem — dzięki czemu scenariusz może działać w warunkach bazowych i pogorszonych bez przepisywania.",
      ],
    },
    diagrams: ["resilience-matrix"],
  },
  deepDives: [
    {
      id: "assertions",
      title: { en: "What resilience scenarios assert", pl: "Co sprawdzają scenariusze odporności" },
      body: {
        en: ["Resilience tests are only as good as their assertions. “No exception was thrown” is not one."],
        pl: ["Testy odporności są tak dobre, jak ich asercje. „Nie poleciał wyjątek” to nie jest asercja."],
      },
      terms: [
        {
          term: { en: "File upload", pl: "Wysyłanie pliku" },
          def: {
            en: "The file arrives intact, progress is reported and the interface stays usable.",
            pl: "Plik dociera w całości, postęp jest raportowany, a interfejs pozostaje używalny.",
          },
        },
        {
          term: { en: "File download", pl: "Pobieranie pliku" },
          def: {
            en: "The file is complete and its content is checked — not just that a download started.",
            pl: "Plik jest kompletny, a jego zawartość sprawdzona — a nie tylko to, że pobieranie się rozpoczęło.",
          },
        },
        {
          term: { en: "Throttled network", pl: "Ograniczona sieć" },
          def: {
            en: "Loading states and timeouts behave as designed instead of failing silently.",
            pl: "Stany ładowania i limity czasu działają zgodnie z projektem, zamiast zawodzić po cichu.",
          },
        },
        {
          term: { en: "Reporting", pl: "Raportowanie" },
          def: {
            en: "Each result records the conditions it ran under, so a failure can be reproduced.",
            pl: "Każdy wynik zapisuje warunki, w jakich powstał, więc błąd da się odtworzyć.",
          },
        },
      ],
    },
  ],
  decisions: [
    {
      decision: { en: "Separate test logic from execution conditions.", pl: "Oddzielić logikę testu od warunków wykonania." },
      why: {
        en: "One test can run under several network profiles through suite parameters.",
        pl: "Jeden test może działać w kilku profilach sieci dzięki parametrom zestawu.",
      },
      tradeoff: {
        en: "A larger configuration surface; suites have to be documented.",
        pl: "Większa powierzchnia konfiguracji; zestawy trzeba dokumentować.",
      },
    },
    {
      decision: { en: "Use TestNG XML suites as the composition layer.", pl: "Użyć zestawów XML TestNG jako warstwy kompozycji." },
      why: {
        en: "Grouping, parameters and parallelism are declared outside the code and versioned with it.",
        pl: "Grupowanie, parametry i równoległość są deklarowane poza kodem i wersjonowane razem z nim.",
      },
      tradeoff: {
        en: "XML is verbose and easy to misconfigure without validation.",
        pl: "XML jest rozwlekły i łatwo go źle skonfigurować bez walidacji.",
      },
    },
    {
      decision: { en: "Verify file content, not file events.", pl: "Weryfikować zawartość plików, a nie zdarzenia." },
      why: {
        en: "A download that started is not a download that succeeded.",
        pl: "Pobieranie, które się rozpoczęło, to nie to samo co pobieranie zakończone sukcesem.",
      },
      tradeoff: {
        en: "Extra I/O handling and cleanup inside tests.",
        pl: "Dodatkowa obsługa I/O i sprzątanie w testach.",
      },
    },
    {
      decision: { en: "Record conditions in reports.", pl: "Zapisywać warunki w raportach." },
      why: {
        en: "A failure under throttling is only actionable if you know which profile caused it.",
        pl: "Błąd przy ograniczonej sieci da się naprawić tylko wtedy, gdy wiadomo, który profil go wywołał.",
      },
      tradeoff: { en: "Report customization effort.", pl: "Nakład pracy na dostosowanie raportów." },
    },
  ],
  implementation: {
    items: {
      en: [
        "Java test framework built on TestNG, with custom test runners.",
        "XML suites for composing runs and advanced execution configuration.",
        "File upload and file download scenarios.",
        "Network throttling scenarios.",
        "Resilience-focused test cases.",
        "Test reporting.",
      ],
      pl: [
        "Framework testowy w Javie oparty na TestNG, z własnymi runnerami.",
        "Zestawy XML do komponowania uruchomień i zaawansowanej konfiguracji wykonania.",
        "Scenariusze wysyłania i pobierania plików.",
        "Scenariusze z ograniczaniem przepustowości sieci.",
        "Przypadki testowe nastawione na odporność.",
        "Raportowanie wyników testów.",
      ],
    },
  },
  verification: {
    body: {
      en: [
        "The framework is itself a verification tool. The execution matrix above shows what each scenario asserts under each network condition.",
      ],
      pl: [
        "Framework sam w sobie jest narzędziem weryfikacji. Macierz wykonania powyżej pokazuje, co sprawdza każdy scenariusz w każdych warunkach sieciowych.",
      ],
    },
  },
  failureModes: [
    {
      name: { en: "Silent timeout", pl: "Ciche przekroczenie czasu" },
      symptom: {
        en: "A slow request ends without any user-visible feedback.",
        pl: "Wolne żądanie kończy się bez żadnej informacji dla użytkownika.",
      },
      guard: {
        en: "Throttled-network scenarios assert loading and timeout behavior.",
        pl: "Scenariusze z ograniczoną siecią sprawdzają zachowanie ładowania i limitów czasu.",
      },
      state: "designed",
    },
    {
      name: { en: "Corrupted transfer", pl: "Uszkodzony transfer" },
      symptom: {
        en: "An upload or download completes with incomplete content.",
        pl: "Wysyłanie lub pobieranie kończy się z niekompletną zawartością.",
      },
      guard: {
        en: "Assertions on file presence, size and content.",
        pl: "Asercje obecności, rozmiaru i zawartości pliku.",
      },
      state: "designed",
    },
    {
      name: { en: "Flaky resilience tests", pl: "Niestabilne testy odporności" },
      symptom: {
        en: "Degraded-condition tests fail for timing reasons, not defects.",
        pl: "Testy w pogorszonych warunkach padają z powodów czasowych, a nie z powodu błędów.",
      },
      guard: {
        en: "Fixed throttling profiles and explicit waits for observable conditions.",
        pl: "Stałe profile ograniczania i jawne oczekiwanie na obserwowalne warunki.",
      },
      state: "designed",
    },
    {
      name: { en: "Misconfigured suites", pl: "Źle skonfigurowane zestawy" },
      symptom: {
        en: "An XML suite silently skips tests or runs with the wrong parameters.",
        pl: "Zestaw XML po cichu pomija testy albo działa z błędnymi parametrami.",
      },
      guard: {
        en: "Reports state what actually ran, under which configuration.",
        pl: "Raporty pokazują, co faktycznie zostało uruchomione i w jakiej konfiguracji.",
      },
      state: "designed",
    },
  ],
  now: {
    en: ["TestNG framework with XML suites", "Upload and download scenarios", "Network throttling scenarios", "Test reporting"],
    pl: ["Framework TestNG z zestawami XML", "Scenariusze wysyłania i pobierania", "Scenariusze z ograniczoną siecią", "Raportowanie testów"],
  },
  next: {
    en: [
      "Public repository with a README describing suites and conditions",
      "CI running baseline suites on every change and degraded suites on a schedule",
      "The same resilience patterns in Playwright (TypeScript), for comparison",
    ],
    pl: [
      "Publiczne repozytorium z README opisującym zestawy i warunki",
      "CI uruchamiające zestawy bazowe przy każdej zmianie, a pogorszone według harmonogramu",
      "Te same wzorce odporności w Playwright (TypeScript), dla porównania",
    ],
  },
  lessons: {
    en: [
      "Resilience is a property you have to test for deliberately; it never shows up in happy-path runs.",
      "Configuration is part of the test. If conditions are not versioned, the result is not reproducible.",
    ],
    pl: [
      "Odporność to cecha, którą trzeba celowo testować; nigdy nie wyjdzie w przebiegach scenariuszy pozytywnych.",
      "Konfiguracja jest częścią testu. Jeśli warunki nie są wersjonowane, wynik nie jest powtarzalny.",
    ],
  },
  nextIteration: {
    en: [
      "Publish the repository and document the execution matrix.",
      "Port the throttling and file-transfer patterns to Playwright and compare the two approaches.",
    ],
    pl: [
      "Opublikować repozytorium i udokumentować macierz wykonania.",
      "Przenieść wzorce ograniczania sieci i transferu plików do Playwright i porównać oba podejścia.",
    ],
  },
};
