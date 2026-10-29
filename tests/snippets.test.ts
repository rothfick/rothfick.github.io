import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { snippets } from "@/content/snippets";

/**
 * Every code excerpt on the site must match the Learning OS source exactly.
 * Set LEARNING_OS_PATH to the repository; the check is skipped when it is absent.
 */
const root = process.env.LEARNING_OS_PATH ?? "";
const available = root !== "" && existsSync(root);

describe.skipIf(!available)("code snippets match the Learning OS repository", () => {
  for (const s of snippets) {
    it(`${s.key} — ${s.file}:${s.start}-${s.end}`, () => {
      const lines = readFileSync(join(root, s.file), "utf8").split("\n");
      expect(s.code).toBe(lines.slice(s.start - 1, s.end).join("\n"));
    });
  }
});
