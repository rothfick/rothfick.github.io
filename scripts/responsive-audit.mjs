// Measures every route in both languages across phone, tablet, laptop and
// large-desktop viewports, and reports objective layout defects as JSON.
// Usage: start the production server, then
//   BASE_URL=http://127.0.0.1:3220 node scripts/responsive-audit.mjs > audit.json
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3220";
const routes = [
  "",
  "/projects",
  "/projects/learning-os",
  "/projects/ai-reliability-lab",
  "/projects/distributed-qa",
  "/projects/resilience-framework",
  "/projects/agentic-lab",
  "/lab",
  "/services",
  "/about",
  "/principles",
  "/contact",
  "/this-page-does-not-exist",
];
const viewports = [
  { name: "phone-320", width: 320, height: 640, touch: true },
  { name: "phone-360", width: 360, height: 780, touch: true },
  { name: "phone-375", width: 375, height: 667, touch: true },
  { name: "phone-390", width: 390, height: 844, touch: true },
  { name: "phone-414", width: 414, height: 896, touch: true },
  { name: "phone-430", width: 430, height: 932, touch: true },
  { name: "landscape-568", width: 568, height: 320, touch: true },
  { name: "landscape-667", width: 667, height: 375, touch: true },
  { name: "landscape-844", width: 844, height: 390, touch: true },
  { name: "tablet-768", width: 768, height: 1024, touch: true },
  { name: "tablet-820", width: 820, height: 1180, touch: true },
  { name: "tablet-1024", width: 1024, height: 768, touch: true },
  { name: "tablet-1180", width: 1180, height: 820, touch: true },
  { name: "laptop-1280", width: 1280, height: 800, touch: false },
  { name: "laptop-1366", width: 1366, height: 768, touch: false },
  { name: "desktop-1440", width: 1440, height: 900, touch: false },
  { name: "desktop-1536", width: 1536, height: 864, touch: false },
  { name: "desktop-1920", width: 1920, height: 1080, touch: false },
  { name: "desktop-2560", width: 2560, height: 1440, touch: false },
];

/** Runs inside the page: collects objective defects. */
function measure({ touch }) {
  const vw = document.documentElement.clientWidth;
  const out = { overflowX: document.documentElement.scrollWidth - vw, offscreen: [], smallText: [], smallTargets: [], splitWords: [], clipped: [], upscaled: [] };
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : "";
    const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50);
    return `${el.tagName.toLowerCase()}${id}${cls === "." ? "" : cls} «${text}»`;
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && cs.display !== "none" && !el.closest(".sr-only,[hidden],[aria-hidden='true']");
  };
  const inScroller = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if (ox === "auto" || ox === "scroll" || ox === "hidden" || ox === "clip") return p !== document.querySelector("main") ? true : false;
    }
    return false;
  };
  const all = [...document.body.querySelectorAll("*")];
  for (const el of all) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    // Content that sticks out of the viewport (outside an intentional scroller).
    if ((r.right > vw + 1 || r.left < -1) && !inScroller(el) && out.offscreen.length < 8) out.offscreen.push(`${describe(el)} [${Math.round(r.left)}–${Math.round(r.right)} of ${vw}]`);
    // Text clipped by its own box (excluding single-line truncation, screen-reader-only text and image crops).
    const cs = getComputedStyle(el);
    const srOnly = r.width <= 1 || cs.clip !== "auto" || cs.clipPath !== "none";
    const imageCrop = el.querySelector(":scope > img, :scope > picture") !== null;
    if ((cs.overflowX === "hidden" || cs.overflowX === "clip") && el.scrollWidth > el.clientWidth + 1 && cs.textOverflow !== "ellipsis" && !srOnly && !imageCrop && el.tagName !== "MAIN" && out.clipped.length < 8)
      out.clipped.push(`${describe(el)} [${el.scrollWidth}>${el.clientWidth}]`);
  }
  // Text smaller than 14px outside code and drawings.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.textContent.trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el || !visible(el) || el.closest("pre,code,svg,[data-diagram],[data-snippet],script,style")) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 14 && out.smallText.length < 6) out.smallText.push(`${size}px ${describe(el)}`);
  }
  // Touch targets under 44×44 on touch-sized viewports (inline links in running text are exempt).
  if (touch) {
    for (const el of document.querySelectorAll("a[href],button,label,summary,[role=button],input:not([type=hidden])")) {
      if (!visible(el) || el.closest(".sr-only")) continue;
      const r = el.getBoundingClientRect();
      const inline = getComputedStyle(el).display === "inline" && el.closest("p,li,dd,figcaption");
      if (inline) continue;
      // A stretched ::after makes the whole row the target; measure the row instead.
      const row = el.closest(".row-link");
      if (row) {
        const rr = row.getBoundingClientRect();
        if (rr.height >= 43.5 && rr.width >= 43.5) continue;
      }
      if ((r.height < 43.5 || r.width < 43.5) && out.smallTargets.length < 8) out.smallTargets.push(`${Math.round(r.width)}×${Math.round(r.height)} ${describe(el)}`);
    }
  }
  // Words split across lines in headings (a single word whose range has two line boxes).
  for (const h of document.querySelectorAll("h1,h2,h3,h4")) {
    if (!visible(h)) continue;
    const tw = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const re = /[^\s ]+/g;
      let m;
      while ((m = re.exec(n.textContent))) {
        const range = document.createRange();
        range.setStart(n, m.index);
        range.setEnd(n, m.index + m[0].length);
        const lines = new Set([...range.getClientRects()].map((x) => Math.round(x.top)));
        if (lines.size > 1 && out.splitWords.length < 6) out.splitWords.push(`«${m[0]}» in ${describe(h)}`);
      }
    }
  }
  // Raster images drawn larger than their pixels allow at 1x.
  for (const img of document.querySelectorAll("img")) {
    if (!visible(img) || !img.naturalWidth) continue;
    const r = img.getBoundingClientRect();
    const crop = getComputedStyle(img).objectFit === "cover";
    if (!crop && r.width > img.naturalWidth * 1.02 && out.upscaled.length < 4) out.upscaled.push(`${img.getAttribute("src")} drawn ${Math.round(r.width)}px from ${img.naturalWidth}px`);
  }
  return out;
}

const browser = await chromium.launch();
const results = [];
for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch, isMobile: vp.touch && vp.width < 1024, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const locale of ["en", "pl"]) {
    for (const route of routes) {
      const url = `${BASE}/${locale}${route}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(measure, { touch: vp.touch });
      const issues = Object.entries(m).filter(([k, v]) => (k === "overflowX" ? v > 0 : v.length > 0));
      if (issues.length) results.push({ viewport: vp.name, url: `/${locale}${route}`, ...Object.fromEntries(issues) });
    }
  }
  await context.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
