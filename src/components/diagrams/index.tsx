import type { DiagramKey } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { EvalPipelineDiagram, EvaluatorTypesDiagram, RegressionGateDiagram } from "./evaluation";
import { LearningArchitectureDiagram, LearningDomainDiagram, LearningLoopDiagram, MasteryLadderDiagram } from "./learning-os";
import type { DiagramProps } from "./primitives";
import { AgentLoopDiagram, ExecutionCadenceDiagram, QualityTiersDiagram, ResilienceMatrixDiagram } from "./systems";

const registry: Record<DiagramKey, (props: DiagramProps) => React.ReactElement> = {
  "lo-domain": LearningDomainDiagram,
  "lo-loop": LearningLoopDiagram,
  "lo-ladder": MasteryLadderDiagram,
  "lo-architecture": LearningArchitectureDiagram,
  "eval-pipeline": EvalPipelineDiagram,
  "eval-regression": RegressionGateDiagram,
  "eval-evaluators": EvaluatorTypesDiagram,
  "qa-tiers": QualityTiersDiagram,
  "qa-cadence": ExecutionCadenceDiagram,
  "resilience-matrix": ResilienceMatrixDiagram,
  "agent-loop": AgentLoopDiagram,
};

/**
 * Any diagram by key, as used in case studies. By default a figure keeps 32px
 * above and below on phones and 48px from 1024px (spec §4.5); pass `className`
 * to place it differently (for example "" inside a layout that sets its own gaps).
 */
export function Diagram({ id, locale, number, className = "my-8 lg:my-12" }: { id: DiagramKey; locale: Locale; number?: number; className?: string }) {
  const Component = registry[id];
  return <Component locale={locale} number={number} className={className} />;
}
