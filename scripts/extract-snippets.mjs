// Copies line ranges verbatim from the Learning OS repository into
// src/content/snippets.json, so every code excerpt on the site is real.
// Usage: LEARNING_OS_PATH=/path/to/learning-os node scripts/extract-snippets.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.env.LEARNING_OS_PATH;
if (!root) throw new Error("Set LEARNING_OS_PATH to the Learning OS repository");

const ranges = [
  { key: "lo-mastery", file: "packages/learning-engine/src/index.ts", start: 48, end: 75 },
  { key: "lo-gateway", file: "packages/ai/src/index.ts", start: 87, end: 120 },
  { key: "lo-keyword", file: "packages/ai/src/index.ts", start: 125, end: 151 },
  { key: "lo-eval-contract", file: "packages/ai/src/index.ts", start: 157, end: 171 },
  { key: "lo-false-mastery", file: "evals/false-mastery.test.ts", start: 1, end: 30 },
  { key: "lo-atom-schema", file: "packages/domain/src/index.ts", start: 87, end: 98 },
  { key: "lo-schedule", file: "packages/learning-engine/src/index.ts", start: 113, end: 127 },
];

const snippets = ranges.map(({ key, file, start, end }) => {
  const lines = readFileSync(join(root, file), "utf8").split("\n");
  return { key, file, start, end, code: lines.slice(start - 1, end).join("\n") };
});

writeFileSync(
  new URL("../src/content/snippets.json", import.meta.url),
  JSON.stringify(snippets, null, 2) + "\n",
);
console.log(`Wrote ${snippets.length} snippets`);
