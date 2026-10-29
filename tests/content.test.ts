import { describe, expect, it } from "vitest";
import * as backgroundContent from "@/content/background";
import * as diagramContent from "@/content/diagrams";
import { figures } from "@/content/diagrams";
import * as educationContent from "@/content/education";
import { learningOsRun } from "@/content/evidence";
import { labItems } from "@/content/lab";
import { principles } from "@/content/principles";
import * as profileContent from "@/content/profile";
import { identity } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { services, engagementSteps } from "@/content/services";
import { skillGroups } from "@/content/skills";
import { snippets } from "@/content/snippets";
import { ui } from "@/content/ui";
import { contactLinks } from "@/components/site/contact-links";

const allContent = {
  background: backgroundContent,
  diagrams: diagramContent,
  education: educationContent,
  evidence: learningOsRun,
  lab: labItems,
  principles,
  profile: profileContent,
  projects,
  services,
  engagementSteps,
  skillGroups,
  snippets,
  ui,
};

type Found = { path: string; en: unknown; pl: unknown };

/**
 * Collects every { en, pl } pair anywhere in the content tree.
 * Functions (ui.project.failing builds a plural-aware string) are skipped here
 * and tested on their own below.
 */
function localizedPairs(value: unknown, path = "content", out: Found[] = []): Found[] {
  if (typeof value === "function") return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => localizedPairs(v, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 2 && keys.includes("en") && keys.includes("pl")) {
      const { en, pl } = value as { en: unknown; pl: unknown };
      out.push({ path, en, pl });
    } else {
      for (const k of keys) localizedPairs((value as Record<string, unknown>)[k], `${path}.${k}`, out);
    }
  }
  return out;
}

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

const pairs = localizedPairs(allContent);

describe("localized content", () => {
  it("finds a meaningful amount of localized content", () => {
    expect(pairs.length).toBeGreaterThan(400);
  });

  it("every localized value exists in English and Polish", () => {
    const broken = pairs.filter(({ en, pl }) => {
      if (typeof en === "string") return typeof pl !== "string" || !en.trim() || !pl.trim();
      if (Array.isArray(en)) return !Array.isArray(pl) || en.length !== pl.length || en.length === 0;
      return true;
    });
    expect(broken.map((b) => b.path)).toEqual([]);
  });

  it("localized lists contain no empty items", () => {
    const empty = pairs.filter(
      ({ en, pl }) => Array.isArray(en) && [...en, ...(pl as unknown[])].some((s) => typeof s !== "string" || !s.trim()),
    );
    expect(empty.map((e) => e.path)).toEqual([]);
  });

  it("Polish is not a copy of English in long-form text", () => {
    // Job titles stay in English in Polish tech usage, so the SEO title is the same in both.
    const allowed = [/\.seoTitle$/];
    const copied = pairs.filter(
      ({ path, en, pl }) => typeof en === "string" && en.length > 40 && en === pl && !allowed.some((a) => a.test(path)),
    );
    expect(copied.map((c) => c.path)).toEqual([]);
  });

  it("contains no placeholders or banned marketing phrases", () => {
    const banned = [
      /lorem/i,
      /ipsum/i,
      /\bTODO\b/,
      /\bTBD\b/,
      /placeholder/i,
      /passionate about technology/i,
      /revolutioni[sz]e/i,
      /cutting-edge/i,
      /unparalleled/i,
      /\bleverag/i,
      /world-class/i,
      /synerg/i,
    ];
    const hits = allStrings(allContent).filter((s) => banned.some((b) => b.test(s)));
    expect(hits).toEqual([]);
  });
});

describe("projects", () => {
  it("have unique slugs and indexes", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.index)).size).toBe(projects.length);
  });

  it("put Learning OS first, then the AI Reliability Lab and Distributed QA", () => {
    expect(projects.slice(0, 3).map((p) => p.slug)).toEqual(["learning-os", "ai-reliability-lab", "distributed-qa"]);
  });

  it("answer the full case-study structure", () => {
    for (const p of projects) {
      expect(p.decisions.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.failureModes.length, p.slug).toBeGreaterThanOrEqual(3);
      expect(p.now.en.length, p.slug).toBeGreaterThan(0);
      expect(p.next.en.length, p.slug).toBeGreaterThan(0);
      expect(p.architecture.diagrams.length, p.slug).toBeGreaterThan(0);
      expect(p.evidenceNote.en.length, p.slug).toBeGreaterThan(20);
    }
  });

  it("carry a status line, a contribution and a question in both languages", () => {
    for (const p of projects) {
      for (const [field, value] of Object.entries({ statusLine: p.statusLine, contribution: p.contribution, question: p.question })) {
        expect(value.en.trim(), `${p.slug}.${field}.en`).toBeTruthy();
        expect(value.pl.trim(), `${p.slug}.${field}.pl`).toBeTruthy();
      }
    }
  });

  it("have the homepage copy the homepage renders", () => {
    const [feature, ...rest] = projects;
    expect(feature?.feature?.summary.en, "learning-os feature.summary").toBeTruthy();
    expect(feature?.feature?.problem.pl, "learning-os feature.problem").toBeTruthy();
    for (const p of rest) expect(p.homeNote?.en && p.homeNote.pl, `${p.slug}.homeNote`).toBeTruthy();
    // Part IV of the anonymized work says why it shows no results.
    expect(getProject("distributed-qa")?.resultsNote?.pl).toBeTruthy();
  });

  it("never claim to be completed", () => {
    expect(projects.flatMap((p) => p.statuses)).not.toContain("completed");
    expect(labItems.map((l) => l.status)).not.toContain("completed");
    for (const p of projects) {
      expect(p.statusLine.en, p.slug).not.toMatch(/complete|finished/i);
      expect(p.statusLine.pl, p.slug).not.toMatch(/ukończ|zakończ/i);
    }
  });

  it("only link to verified https repositories", () => {
    for (const p of projects) if (p.repository) expect(p.repository).toMatch(/^https:\/\//);
  });

  it("keep anonymized professional work free of years and employer context", () => {
    const qa = getProject("distributed-qa")!;
    expect(qa.year).toBeUndefined();
    expect(allStrings(qa).join(" ")).not.toMatch(/\b(19|20)\d{2}\b/);
  });

  it("keep the screenshots the homepage crops in their places", () => {
    // Desktop plate: screenshots[0]; phone crop: screenshots[2].
    const shots = getProject("learning-os")?.screenshots ?? [];
    expect(shots[0]?.src).toMatch(/\/overview-desktop\.png$/);
    expect(shots[2]?.src).toMatch(/\/sources-mobile\.png$/);
  });

  it("only show screenshots that exist with real dimensions", async () => {
    const { existsSync } = await import("node:fs");
    for (const p of projects)
      for (const s of p.screenshots ?? []) {
        expect(existsSync(`public${s.src}`), s.src).toBe(true);
        expect(s.width).toBeGreaterThan(0);
        expect(s.height).toBeGreaterThan(0);
      }
  });
});

describe("cross-links", () => {
  it("every service links to an existing project as evidence", () => {
    for (const s of services) expect(getProject(s.evidence), s.id).toBeDefined();
  });

  it("the homepage services sentence has one slot per service", () => {
    for (const locale of ["en", "pl"] as const) {
      const slots = ui.home.servicesSentence[locale].match(/\{\d+\}/g) ?? [];
      expect(slots.sort(), locale).toEqual(services.map((_, i) => `{${i}}`));
    }
    for (const s of services) expect(s.inlineName.en && s.inlineName.pl, s.id).toBeTruthy();
  });

  it("lab items and principles link only to existing projects", () => {
    const links = [...labItems.map((l) => l.related), ...principles.map((p) => p.link)].filter(Boolean) as string[];
    for (const link of links) expect(getProject(link.replace("/projects/", "")), link).toBeDefined();
  });

  it("referenced code snippets exist", () => {
    const keys = new Set(snippets.map((s) => s.key));
    const referenced = projects.flatMap((p) => [
      ...p.deepDives.flatMap((d) => d.snippets ?? []),
      ...(p.verification.snippets ?? []),
    ]);
    for (const k of referenced) expect(keys.has(k), k).toBe(true);
  });
});

describe("evidence", () => {
  it("test-run numbers are internally consistent", () => {
    for (const s of learningOsRun.suites) {
      expect(s.passed).toBeGreaterThanOrEqual(0);
      expect(s.passed).toBeLessThanOrEqual(s.total);
    }
    expect(learningOsRun.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("every suite with failures says what fails, in both languages", () => {
    for (const s of learningOsRun.suites) {
      if (s.passed === s.total) continue;
      const note = "failNote" in s ? s.failNote : undefined;
      expect(note?.en?.trim(), s.id).toBeTruthy();
      expect(note?.pl?.trim(), s.id).toBeTruthy();
    }
  });

  it("names failures with English and Polish plural forms", () => {
    const failing = (locale: "en" | "pl", n: number) => ui.project.failing(locale, n).replace(/\s/g, " ");
    expect(failing("en", 8)).toBe("8 failing");
    expect(failing("pl", 1)).toBe("1 niezaliczony");
    expect(failing("pl", 3)).toBe("3 niezaliczone");
    expect(failing("pl", 8)).toBe("8 niezaliczonych");
    expect(failing("pl", 12)).toBe("12 niezaliczonych");
    expect(failing("pl", 22)).toBe("22 niezaliczone");
  });
});

describe("figures", () => {
  it("carry the kind that decides their honest caption prefix", () => {
    const kinds = Object.fromEntries(Object.entries(figures).map(([key, f]) => [key, f.kind]));
    expect(kinds).toEqual({
      "lo-domain": "architecture",
      "lo-loop": "architecture",
      "lo-ladder": "architecture",
      "lo-architecture": "architecture",
      "eval-pipeline": "method",
      "eval-regression": "method",
      "eval-evaluators": "method",
      "qa-tiers": "concept",
      "qa-cadence": "concept",
      "resilience-matrix": "concept",
      "agent-loop": "design",
    });
  });
});

describe("retired copy", () => {
  it("slogans, the brand loop and the theme strings stay gone", () => {
    for (const key of ["headline", "intro", "hardPart", "failureLine", "disciplines", "credibility"]) {
      expect(profileContent, `profile ${key}`).not.toHaveProperty(key);
      expect(identity, `identity.${key}`).not.toHaveProperty(key);
    }
    expect(backgroundContent).not.toHaveProperty("brandLoop");
    expect(backgroundContent).not.toHaveProperty("brandLoopNotes");
    expect(ui.nav).not.toHaveProperty("themeToDark");
    expect(ui.nav).not.toHaveProperty("themeToLight");
    expect(ui.cta).not.toHaveProperty("workWithMe");
    expect(ui.footer).not.toHaveProperty("built");
    expect(ui.footer).not.toHaveProperty("honesty");
  });

  it("says where things fail once, in the hero statement", () => {
    const hits = allStrings(allContent).filter((s) => /where they fail|gdzie (?:te systemy )?zawodzą/i.test(s));
    expect(hits).toEqual([identity.statement.en, identity.statement.pl]);
  });
});

describe("contact", () => {
  it("never produces a link for an empty channel", () => {
    for (const locale of ["en", "pl"] as const) {
      const links = contactLinks(locale);
      for (const l of links) {
        expect(l.href).not.toMatch(/^(mailto:)?$/);
        expect(l.href.length).toBeGreaterThan(8);
      }
      const configured = [profileContent.profile.email, profileContent.profile.linkedin, profileContent.profile.github, profileContent.profile.cv].filter(Boolean);
      expect(links.length).toBe(configured.length);
    }
  });
});
