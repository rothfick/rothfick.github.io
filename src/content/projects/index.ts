import type { Project, ProjectCategory, ProjectStatus } from "../types";
import { agenticLab } from "./agentic-lab";
import { aiReliabilityLab } from "./ai-reliability-lab";
import { distributedQa } from "./distributed-qa";
import { learningOs } from "./learning-os";
import { resilienceFramework } from "./resilience-framework";

/** Order matters: this is the order used on the homepage and the projects index. */
export const projects: Project[] = [learningOs, aiReliabilityLab, distributedQa, resilienceFramework, agenticLab];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    previous: i > 0 ? projects[i - 1] : undefined,
    next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}

export const categories: ProjectCategory[] = ["ai", "reliability", "automation", "architecture", "research"];

export const allStatuses: ProjectStatus[] = [
  "working-mvp",
  "active-development",
  "engineering-lab",
  "architecture-poc",
  "research",
  "engineering-project",
  "coursework",
  "completed",
];
