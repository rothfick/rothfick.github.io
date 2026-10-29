import "server-only";
import { createHighlighterCore, type HighlighterCore, type ThemeRegistration } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/** One light theme drawn on --raised; every colour meets 5:1 or better. Comments are not italic. */
const monographLight: ThemeRegistration = {
  name: "monograph-light",
  type: "light",
  colors: { "editor.background": "#fbfaf7", "editor.foreground": "#1d1c1a" },
  settings: [
    { settings: { foreground: "#1d1c1a" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6b675f", fontStyle: "" } },
    { scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.control"], settings: { foreground: "#2433b0" } },
    { scope: ["string", "string.quoted", "string.template", "punctuation.definition.string"], settings: { foreground: "#2f6b46" } },
    { scope: ["constant.numeric", "constant.language", "constant.character", "variable.other.constant"], settings: { foreground: "#8a5a00" } },
    { scope: ["entity.name.type", "support.type", "entity.name.class", "support.class", "entity.other.inherited-class"], settings: { foreground: "#5b3a8c" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#1d1c1a" } },
  ],
};

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [monographLight],
    langs: [import("shiki/langs/typescript.mjs")],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

/** Highlights code at build time; the browser receives plain HTML and no JS. */
export async function highlight(code: string, lang: "ts" = "ts"): Promise<string> {
  const h = await getHighlighter();
  return h.codeToHtml(code, {
    lang: lang === "ts" ? "typescript" : lang,
    theme: "monograph-light",
  });
}
