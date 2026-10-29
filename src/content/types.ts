import type { Localized } from "@/lib/i18n";

export type ProjectStatus =
  | "working-mvp"
  | "active-development"
  | "engineering-lab"
  | "architecture-poc"
  | "research"
  | "engineering-project"
  | "coursework"
  | "completed";

export type ProjectCategory = "ai" | "reliability" | "automation" | "architecture" | "research";

export type DiagramKey =
  | "lo-domain"
  | "lo-loop"
  | "lo-ladder"
  | "lo-architecture"
  | "eval-pipeline"
  | "eval-regression"
  | "eval-evaluators"
  | "qa-tiers"
  | "qa-cadence"
  | "resilience-matrix"
  | "agent-loop";

export type SnippetKey =
  | "lo-mastery"
  | "lo-gateway"
  | "lo-keyword"
  | "lo-eval-contract"
  | "lo-false-mastery"
  | "lo-atom-schema"
  | "lo-schedule";

export interface Term {
  term: Localized;
  def: Localized;
}

export interface Decision {
  decision: Localized;
  why: Localized;
  tradeoff: Localized;
}

/**
 * verified: a guard exists in code and is covered by tests.
 * partial: a guard exists but does not close the failure completely.
 * designed: the mitigation is part of the architecture; nothing verifiable is shown here.
 * open: a known gap.
 */
export type GuardState = "verified" | "partial" | "designed" | "open";

export interface FailureMode {
  name: Localized;
  symptom: Localized;
  guard: Localized;
  state: GuardState;
}

export interface DeepDive {
  id: string;
  title: Localized;
  body: Localized<string[]>;
  diagram?: DiagramKey;
  snippets?: SnippetKey[];
  terms?: Term[];
}

export interface Screenshot {
  src: string;
  width: number;
  height: number;
  alt: Localized;
  caption: Localized;
  /** Short bold title for the caption, e.g. "Daily mission". */
  title?: Localized;
}

export interface Project {
  slug: string;
  index: string;
  tier: "flagship" | "standard";
  title: Localized;
  subtitle: Localized;
  /** One sentence used on cards: the problem the project exists to answer. */
  question: Localized;
  statuses: ProjectStatus[];
  categories: ProjectCategory[];
  /** Omitted for anonymized professional work, so no timeline is implied. */
  year?: string;
  type: Localized;
  role: Localized;
  /** One sentence on Robert's part in the work, derived from role and implementation. */
  contribution: Localized;
  stack: Localized<string[]>;
  /** Status as one sentence, shown after the status marker: "Working MVP · in active development". */
  statusLine: Localized;
  /** Short honest note under the homepage entry (projects 02–05). */
  homeNote?: Localized;
  /** Homepage feature copy (Learning OS only). */
  feature?: { summary: Localized; problem: Localized };
  /** Replaces the generic "no results yet" note in Part IV. */
  resultsNote?: Localized;
  /** Where the evidence on the page comes from. Shown on every case study. */
  evidenceNote: Localized;
  overview: Localized<string[]>;
  problem: Localized<string[]>;
  constraints: Localized<string[]>;
  architecture: { body: Localized<string[]>; diagrams: DiagramKey[] };
  deepDives: DeepDive[];
  decisions: Decision[];
  implementation: { intro?: Localized; items: Localized<string[]> };
  verification: { body: Localized<string[]>; showLearningOsRun?: boolean; snippets?: SnippetKey[] };
  failureModes: FailureMode[];
  now: Localized<string[]>;
  next: Localized<string[]>;
  lessons: Localized<string[]>;
  nextIteration: Localized<string[]>;
  screenshots?: Screenshot[];
  /** Only verified public URLs. Empty means the link is hidden. */
  repository?: string;
}
