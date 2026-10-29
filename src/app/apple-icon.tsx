export const dynamic = "force-static";
import { ImageResponse } from "next/og";
import { ogColors, ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** An ink square with a paper "R" in the site's serif. Falls back to next/og's sans offline. */
export default async function AppleIcon() {
  const fonts = (await ogFonts({ serif: "R", sans: "" })).filter((f) => f.name === "Newsreader");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ogColors.ink,
          color: ogColors.paper,
          fontFamily: fonts.length ? "Newsreader" : undefined,
          fontSize: 132,
          lineHeight: 1,
          paddingTop: 28,
        }}
      >
        R
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
