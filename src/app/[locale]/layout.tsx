import type { Metadata, Viewport } from "next";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { identity, profile, siteUrl } from "@/content/profile";
import { ui } from "@/content/ui";
import { resolveLocale, localeStaticParams, type LocaleParams } from "@/lib/page";
import "../globals.css";

// Voice: the name, headings, statements and numerals. Optical size follows font size.
const serif = Newsreader({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  style: ["normal"],
  variable: "--font-newsreader",
  display: "swap",
});
// Documentation: body text, navigation, metadata, buttons.
const sans = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  style: ["normal"],
  variable: "--font-schibsted",
  display: "swap",
});

export const dynamicParams = false;
export const generateStaticParams = localeStaticParams;

export const viewport: Viewport = {
  themeColor: "#f3f1ec",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: identity.seoTitle[locale], template: `%s — ${profile.name}` },
    description: identity.seoDescription[locale],
    applicationName: profile.name,
    authors: [{ name: profile.name }],
    creator: profile.name,
    formatDetection: { email: false, telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LocaleParams & { children: React.ReactNode }) {
  const locale = await resolveLocale(params);
  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <a
          href="#main"
          className="sr-only z-50 rounded-[2px] bg-ink px-[22px] py-3 text-base font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:px-[22px] focus:py-3"
        >
          {ui.nav.skip[locale]}
        </a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
