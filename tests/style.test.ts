import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Style lint for the design rules that are easy to break and hard to spot in review.
 * Scans every src/**\/*.tsx file. Comments are ignored; code and class names are not.
 */
const srcDir = fileURLToPath(new URL("../src/", import.meta.url));

const files = readdirSync(srcDir, { recursive: true, encoding: "utf8" })
  .map((f) => f.split("\\").join("/"))
  .filter((f) => f.endsWith(".tsx"))
  .sort()
  .map((path) => ({ path, lines: stripComments(readFileSync(srcDir + path, "utf8")).split("\n") }));

/** Blanks out comments but keeps line numbers, so hits point at the right line. */
function stripComments(source: string) {
  const blank = (m: string) => m.replace(/[^\n]/g, " ");
  return source
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:\\"'`])(\/\/.*)$/gm, (_, before: string, comment: string) => before + blank(comment));
}

type Allow = (path: string) => boolean;
const nowhere: Allow = () => false;
const only =
  (...allowed: string[]): Allow =>
  (path) =>
    allowed.some((a) => (a.endsWith("/") ? path.startsWith(a) : path === a));

function hits(pattern: RegExp, allowed: Allow = nowhere) {
  const found: string[] = [];
  for (const { path, lines } of files) {
    if (allowed(path)) continue;
    lines.forEach((line, i) => {
      const m = line.match(pattern);
      if (m) found.push(`src/${path}:${i + 1}  ${m[0]}`);
    });
  }
  return found;
}

describe("style rules (spec §11.3)", () => {
  it("scans the components and routes", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("uppercase only for the EN/PL switch", () => {
    expect(hits(/uppercase|toUpperCase\(/, only("components/site/client.tsx"))).toEqual([]);
  });

  it("monospace only for code, paths and identifiers in diagrams", () => {
    expect(
      hits(/font-mono/, only("components/project/code-block.tsx", "components/rich.tsx", "components/figure.tsx", "components/diagrams/")),
    ).toEqual([]);
  });

  it("an accent fill only on the primary button's hover and press", () => {
    // accent-wash is the fill of the one emphasised diagram node, which is allowed.
    expect(hits(/bg-accent(?!-wash)/, only("components/ui.tsx"))).toEqual([]);
  });

  it("no pill or card radii, shadows or backdrop blur", () => {
    expect(hits(/rounded-(?:[trblsexy]{1,2}-)?(?:full|[23]?xl)\b/)).toEqual([]);
    expect(hits(/shadow-/)).toEqual([]);
    expect(hits(/backdrop-blur/)).toEqual([]);
  });
});

describe("style rules from the brief", () => {
  it("no letter-spaced labels", () => {
    // Negative tracking on large type is fine; positive tracking of 0.02em or more is a label style.
    expect(hits(/tracking-(?:wide|wider|widest)\b|tracking-\[(?:0?\.0[2-9]|0?\.[1-9]|[1-9])/)).toEqual([]);
  });

  it("no content text below 14px", () => {
    // Code may be smaller (12.5px listings on phones, 13px line numbers);
    // 13px is also the size of literal paths in captions and identifiers in diagrams.
    const code = only("components/project/code-block.tsx");
    const thirteen = only("components/figure.tsx", "components/diagrams/");
    const found: string[] = [];
    for (const { path, lines } of files) {
      if (code(path)) continue;
      lines.forEach((line, i) => {
        for (const m of line.matchAll(/\btext-(?:xs|\[(\d*\.?\d+)(rem|px)\])(?![\w-])/g)) {
          const px = m[1] === undefined ? 12 : Number(m[1]) * (m[2] === "rem" ? 16 : 1);
          if (px < 14 && !(px === 13 && thirteen(path))) found.push(`src/${path}:${i + 1}  ${m[0]}`);
        }
      });
    }
    expect(found).toEqual([]);
  });

  it("only colour tokens that exist (the retired names generate no CSS)", () => {
    const retired = /(?<![\w-])(?:bg|text|border|fill|stroke|outline|decoration|ring|divide|from|via|to)-(?:bg|fg|muted|subtle|elev|sunken|accent-soft|accent-line|ok|warn|fail-soft)(?![\w-])/;
    expect(hits(retired)).toEqual([]);
  });
});
