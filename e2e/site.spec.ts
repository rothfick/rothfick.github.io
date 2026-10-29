import { expect, test, type Locator, type Page } from "@playwright/test";

const locales = ["en", "pl"] as const;
type Locale = (typeof locales)[number];

const slugs = ["learning-os", "ai-reliability-lab", "distributed-qa", "resilience-framework", "agentic-lab"];
const pages = ["", "/projects", "/lab", "/services", "/about", "/principles", "/contact", ...slugs.map((s) => `/projects/${s}`)];
const widths = [360, 390, 768, 1024, 1440];

/** Matches text whatever spaces typo() turned into non-breaking ones. */
function loose(text: string) {
  return new RegExp(text.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&").replace(/ /g, "\\s+"));
}

/** The copy these tests look for, as it reads on the page. */
const copy = {
  en: {
    cta: "See the projects",
    readCaseStudy: "Read the case study",
    language: "Language",
    failing: loose("8 failing — 7 in the new EN/PL localization suite"),
  },
  pl: {
    cta: "Zobacz projekty",
    readCaseStudy: "Zobacz projekt od środka",
    language: "Język",
    failing: loose("8 niezaliczonych — 7 w nowym zestawie lokalizacji EN/PL"),
  },
} satisfies Record<Locale, Record<string, string | RegExp>>;

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

/** Layout is only final once the web fonts are in. */
async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

async function box(locator: Locator) {
  const b = await locator.boundingBox();
  if (!b) throw new Error(`no bounding box for ${locator}`);
  return { top: b.y, bottom: b.y + b.height, height: b.height };
}

/**
 * Primary buttons are ButtonLink variant="primary": an <a> filled with ink.
 * Counts the ones a visitor can see in the current viewport; the visually
 * hidden skip link is clipped and does not count.
 */
async function primaryButtonsInViewport(page: Page) {
  return page.locator("a.bg-ink").evaluateAll((links) =>
    links.filter((a) => {
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a);
      const clipped = s.clipPath !== "none" || (s.clip !== "auto" && s.clip !== "");
      return (
        a.checkVisibility({ opacityProperty: true, visibilityProperty: true }) &&
        !clipped &&
        r.width >= 20 &&
        r.height >= 20 &&
        r.bottom > 0 &&
        r.top < window.innerHeight &&
        r.right > 0 &&
        r.left < window.innerWidth
      );
    }).length,
  );
}

test("root redirects to English", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the site has one light theme and no theme switch", async ({ page }) => {
  await page.goto("/en");
  expect(await page.locator("html").getAttribute("data-theme")).toBeNull();
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute("content", "light");
  await expect(page.getByRole("button", { name: /theme|motyw/i })).toHaveCount(0);
});

test("homepage leads with the name and goes straight to the work", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Robert Leszczyński");
  const ids = await page.locator("main > section").evaluateAll((els) => els.map((e) => e.id || e.getAttribute("aria-labelledby")));
  expect(ids.slice(0, 3)).toEqual(["hero-title", "work", "background"]);
  // A fourth section exists only when a contact channel is configured.
  expect(ids.length).toBeLessThanOrEqual(4);
  if (ids.length === 4) expect(ids[3]).toBe("contact");
  const work = page.locator("#work");
  await expect(work.getByRole("heading", { level: 2, name: "Learning OS" })).toBeVisible();
  await expect(work.getByText("78/78", { exact: true })).toBeVisible();
  await expect(work.getByText("12/20", { exact: true })).toBeVisible();
});

test("every page renders in both languages without client errors or empty links", async ({ page }) => {
  const errors = collectErrors(page);
  for (const locale of locales) {
    for (const path of pages) {
      const response = await page.goto(`/${locale}${path}`);
      expect(response?.status(), `/${locale}${path}`).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      expect(hrefs.filter((h) => !h || h === "#" || h === "mailto:"), `/${locale}${path}`).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});

test("project navigation opens a full case study", async ({ page, isMobile }) => {
  await page.goto("/en");
  // Every project on the homepage has this link; Learning OS comes first.
  await page.locator("#work").getByRole("link", { name: "Read the case study" }).first().click();
  await expect(page).toHaveURL(/\/en\/projects\/learning-os\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Learning OS");
  // Parts are H2s (a numeral may precede the name); sections are H3s.
  for (const name of ["Problem", "Decisions", "Implementation", "Results", "Limitations"]) {
    await expect(page.getByRole("heading", { level: 2, name: new RegExp(`(^|\\s)${name}$`) })).toBeVisible();
  }
  for (const name of ["Architecture", "Verification", "Failure modes", "Current status"]) {
    await expect(page.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
  }
  if (!isMobile) await expect(page.getByRole("navigation", { name: "Contents", exact: true })).toBeVisible();

  // The interactive domain model updates its detail panel.
  const figure = page.locator('[data-diagram="lo-domain"]');
  await figure.getByRole("button", { name: "Evidence", exact: true }).click();
  await expect(figure.getByRole("button", { name: "Evidence", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(figure.getByText("verifiedBy: fake | keyword | model | human | test")).toBeVisible();

  // Code excerpts carry their real source location.
  await expect(page.locator('[data-snippet="lo-mastery"]')).toContainText("packages/learning-engine/src/index.ts:48–75");
});

test("language switch keeps the current page", async ({ page }) => {
  await page.goto("/en/projects/distributed-qa");
  await page.getByRole("link", { name: "Polski", exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/pl\/projects\/distributed-qa$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Warstwa zapewnienia jakości dla systemów rozproszonych");
  await expect(page.getByRole("heading", { level: 3, name: "Tryby awarii", exact: true })).toBeVisible();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("project filter narrows the list", async ({ page }) => {
    await page.goto("/en/projects");
    const rows = page.getByTestId("project-row");
    await expect(rows.filter({ visible: true })).toHaveCount(5);
    const filter = page.getByRole("group", { name: "Filter by area" });
    await filter.getByText("Research", { exact: true }).click();
    await expect(rows.filter({ visible: true })).toHaveCount(1);
    // AI Reliability Lab, Distributed QA and the Resilience Framework.
    await filter.getByText("Reliability", { exact: true }).click();
    await expect(rows.filter({ visible: true })).toHaveCount(3);
    await filter.getByText("All", { exact: true }).click();
    await expect(rows.filter({ visible: true })).toHaveCount(5);
  });
});

test("contact never renders empty links", async ({ page }) => {
  await page.goto("/en/contact");
  const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs.filter((h) => !h || h === "#" || h === "mailto:")).toEqual([]);
});

test("unknown pages show a localized 404", async ({ page }) => {
  const response = await page.goto("/pl/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ta strona nie istnieje.");
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("menu opens, navigates and closes", async ({ page }) => {
    await page.goto("/en");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Main navigation" }).filter({ visible: true });
    await expect(menu.getByRole("link").first()).toBeFocused();
    await menu.getByRole("link", { name: "Lab", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/lab\/$/);
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("menu closes with Escape and returns focus to the toggle", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.keyboard.press("Escape");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });

  test("no page scrolls horizontally on the device", async ({ page }) => {
    for (const locale of locales) {
      for (const path of pages) {
        await page.goto(`/${locale}${path}`);
        await settle(page);
        expect.soft(await horizontalOverflow(page), `/${locale}${path}`).toBeLessThanOrEqual(0);
      }
    }
  });
});

test("language switch preserves query and section in both directions", async ({ page }) => {
  await page.goto("/en/about?source=portfolio#background");
  await page.getByRole("link", { name: "Polski", exact: true }).click();
  await expect(page).toHaveURL(/\/pl\/about\?source=portfolio#background$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/about\?source=portfolio#background$/);
});

test("header and Polish content fit small phones and tablets", async ({ page }) => {
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/pl");
    await expect(page.getByRole("navigation", { name: "Język", exact: true })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `viewport ${width}`).toBeLessThanOrEqual(0);
    const links = page.locator("header").getByRole("link", { name: "English", exact: true });
    const box = await links.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40);
  }
});

test.describe("composition at fixed viewports", () => {
  // These set their own viewport, so one browser project is enough.
  test.skip(({ isMobile }) => isMobile, "desktop project only");

  for (const locale of locales) {
    test(`1440×900: Learning OS, its link and most of the screenshot are in the first viewport (${locale})`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/${locale}`);
      await settle(page);
      const work = page.locator("#work");

      await expect(work.getByRole("heading", { level: 2, name: "Learning OS" })).toBeInViewport();
      const shot = work.locator("img").filter({ visible: true }).first();
      await expect(shot).toBeVisible();
      const image = await box(shot);
      expect(image.top, "screenshot top").toBeLessThanOrEqual(560);
      expect((900 - image.top) / image.height, "share of the screenshot above the fold").toBeGreaterThanOrEqual(0.75);

      const link = await box(work.getByRole("link", { name: `${copy[locale].readCaseStudy} — Learning OS`, exact: true }).first());
      expect(link.bottom, "case-study link bottom").toBeLessThanOrEqual(900);

      expect(await primaryButtonsInViewport(page), "primary buttons in the first viewport").toBe(1);
    });

    test(`390×844: the call to action, the language switch and the failing tests are all there (${locale})`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/${locale}`);
      await settle(page);

      const cta = page.locator('main > section[aria-labelledby="hero-title"]').getByRole("link", { name: copy[locale].cta, exact: true });
      expect((await box(cta)).bottom, "hero CTA bottom").toBeLessThanOrEqual(420);

      const language = page.getByRole("navigation", { name: copy[locale].language, exact: true });
      await expect(language).toBeVisible();
      await expect(language).toBeInViewport();

      // Results are never collapsed or hidden on phones.
      const work = page.locator("#work");
      await expect(work.getByText("12/20", { exact: true })).toBeVisible();
      await expect(work.getByText(copy[locale].failing)).toBeVisible();
    });
  }

  for (const width of widths) {
    test(`no route scrolls sideways at ${width}px`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.setViewportSize({ width, height: 900 });
      for (const locale of locales) {
        for (const path of [...pages, "/does-not-exist"]) {
          await page.goto(`/${locale}${path}`);
          await settle(page);
          expect.soft(await horizontalOverflow(page), `/${locale}${path} at ${width}px`).toBeLessThanOrEqual(0);
          // At most one primary button per view.
          if (width === 1440) expect.soft(await primaryButtonsInViewport(page), `primary buttons on /${locale}${path}`).toBeLessThanOrEqual(1);
        }
      }
    });
  }
});
