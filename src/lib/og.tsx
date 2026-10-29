import { ImageResponse } from "next/og";
import type { Locale } from "./i18n";
import { typo } from "./typo";

export const ogSize = { width: 1200, height: 630 };

/** The site palette, written out because ImageResponse cannot read CSS variables. */
export const ogColors = {
  paper: "#f3f1ec",
  ink: "#1d1c1a",
  ink2: "#55524b",
  accent: "#2b3cc4",
};

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 500; style: "normal" };

/**
 * Fetches a TTF subset of a Google font holding only the glyphs in `text`
 * (Polish letters included). Returns undefined when the network is not
 * available, so the image falls back to next/og's built-in sans.
 */
async function googleFont(family: string, axes: string, text: string): Promise<ArrayBuffer | undefined> {
  if (!text.trim()) return undefined;
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:${axes}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return undefined;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : undefined;
  } catch {
    return undefined;
  }
}

/** Newsreader for the voice (title), Schibsted Grotesk for the documentation lines. */
export async function ogFonts({ serif, sans }: { serif: string; sans: string }): Promise<OgFont[]> {
  const [newsreader, schibsted] = await Promise.all([
    googleFont("Newsreader", "opsz,wght@72,400", serif),
    googleFont("Schibsted+Grotesk", "wght@400", sans),
  ]);
  const fonts: OgFont[] = [];
  if (newsreader) fonts.push({ name: "Newsreader", data: newsreader, weight: 400, style: "normal" });
  if (schibsted) fonts.push({ name: "Schibsted Grotesk", data: schibsted, weight: 400, style: "normal" });
  return fonts;
}

/**
 * One OpenGraph layout for the whole site: a short ultramarine rule, an
 * optional status line, the title in the serif voice and one supporting line.
 * Paper ground, no grid, no monogram.
 */
export async function renderOg({
  locale,
  eyebrow: rawEyebrow,
  title: rawTitle,
  subtitle: rawSubtitle,
  footer,
}: {
  locale: Locale;
  eyebrow?: string;
  title: string;
  subtitle: string;
  footer?: string;
}) {
  // Same line-break rules as the pages: no stranded Polish one-letter words, no line-initial dashes.
  const eyebrow = rawEyebrow && typo(locale, rawEyebrow);
  const title = typo(locale, rawTitle);
  const subtitle = typo(locale, rawSubtitle);
  const fonts = await ogFonts({ serif: title, sans: [eyebrow, subtitle, footer].filter(Boolean).join(" ") });
  const serif = fonts.some((f) => f.name === "Newsreader") ? "Newsreader" : undefined;
  const sans = fonts.some((f) => f.name === "Schibsted Grotesk") ? "Schibsted Grotesk" : undefined;
  const titleSize = title.length > 48 ? 64 : title.length > 22 ? 76 : 84;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 80px 72px",
          background: ogColors.paper,
          color: ogColors.ink,
          fontFamily: sans,
        }}
      >
        <div style={{ display: "flex", width: 48, height: 4, background: ogColors.accent }} />
        {eyebrow && <div style={{ display: "flex", marginTop: 36, fontSize: 26, lineHeight: 1.4, color: ogColors.ink2 }}>{eyebrow}</div>}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              fontFamily: serif,
              fontSize: titleSize,
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              maxWidth: 1040,
              textWrap: "balance",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, lineHeight: 1.4, color: ogColors.ink2, maxWidth: 980 }}>{subtitle}</div>
          {footer && <div style={{ display: "flex", marginTop: 36, fontSize: 24, lineHeight: 1.4, color: ogColors.ink2 }}>{footer}</div>}
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
