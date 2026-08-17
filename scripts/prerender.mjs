/**
 * Build-time prerender for Amplify / static hosting.
 *
 * 1. Starts `vite preview` against dist/
 * 2. Discovers public routes from the live API
 * 3. Opens each route in headless Chromium
 * 4. Waits for `data-prerender-ready="true"`
 * 5. Writes the fully rendered HTML into dist/.../index.html
 *
 * After deploy, `curl https://airacrest.com/` must show headings,
 * meta description, and FAQ copy in the raw HTML — not only title/viewport.
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { toBritishSpelling } from "../src/utils/britishSpelling.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = Number(process.env.PRERENDER_PORT || 4173);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const API_BASE = (
  process.env.VITE_API_BASE_URL ||
  "https://jvau29a6le.execute-api.ap-south-1.amazonaws.com/api"
).replace(/\/$/, "");
const SITE_URL = (
  process.env.VITE_SITE_URL || "https://www.airacrest.com"
).replace(/\/$/, "");
const READY_TIMEOUT_MS = Number(process.env.PRERENDER_TIMEOUT_MS || 45000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchApi(pathname) {
  const response = await fetch(`${API_BASE}/${pathname.replace(/^\//, "")}`);
  if (!response.ok) {
    throw new Error(`API ${pathname} failed: ${response.status}`);
  }
  const json = await response.json();
  if (!json?.success) {
    throw new Error(`API ${pathname} returned success=false`);
  }
  return json.data;
}

function unwrapList(data) {
  return Array.isArray(data) ? data : data?.items || [];
}

function htmlIncludesText(html, value) {
  if (!value) return false;
  const haystack = html.toLowerCase();
  const variants = [value, toBritishSpelling(value)].filter(Boolean);
  return variants.some((variant) => haystack.includes(String(variant).toLowerCase()));
}

async function collectRoutes() {
  const routes = new Set(["/", "/products"]);
  const productsBySlug = new Map();
  let featuredNames = [];

  try {
    const products = unwrapList(await fetchApi("products?limit=100"));

    for (const product of products) {
      const slug = product?.slug;
      if (!slug) continue;
      routes.add(`/products/${slug}`);
      productsBySlug.set(slug, {
        name: product.name || "",
        slug,
        faqs: [],
      });

      try {
        const detail = await fetchApi(`products/slug/${encodeURIComponent(slug)}`);
        const faqs = Array.isArray(detail?.faqs) ? detail.faqs : [];
        const visibleFaqs = faqs.filter(
          (faq) => faq?.question?.trim() && faq?.answer?.trim(),
        );
        productsBySlug.set(slug, {
          name: detail?.name || product.name || "",
          slug,
          faqs: visibleFaqs,
        });
        if (visibleFaqs.length > 0) {
          routes.add(`/products/${slug}/faq`);
        }
      } catch (error) {
        console.warn(`  skip FAQ for ${slug}:`, error.message);
      }
    }
  } catch (error) {
    console.warn("  product discovery failed:", error.message);
  }

  try {
    featuredNames = unwrapList(await fetchApi("products?featured=true&limit=100"))
      .map((product) => product?.name)
      .filter(Boolean);
  } catch (error) {
    console.warn("  featured product discovery failed:", error.message);
  }

  if (featuredNames.length === 0) {
    featuredNames = [...productsBySlug.values()].map((product) => product.name).filter(Boolean);
  }

  try {
    const blogs = unwrapList(await fetchApi("blogs?limit=100"));
    if (blogs.length >= 2) {
      routes.add("/blogs");
      for (const blog of blogs) {
        if (blog?.slug) routes.add(`/blogs/${blog.slug}`);
      }
    }
  } catch (error) {
    console.warn("  blog discovery failed:", error.message);
  }

  return {
    routes: [...routes].sort((a, b) => a.localeCompare(b)),
    catalog: {
      featuredNames,
      productsBySlug,
    },
  };
}

function assertSnapshotQuality(route, html, catalog) {
  const missing = [];
  const isHeaderOnly =
    /DOWNLOAD PRODUCT CATALOGUE/i.test(html) &&
    !/OUR MAIN PRODUCTS/i.test(html) &&
    !/<h1[\s>]/i.test(html);

  if (route === "/") {
    if (!/PREMIUM QUALITY/i.test(html)) missing.push("PREMIUM QUALITY");
    if (!/OUR MAIN PRODUCTS/i.test(html)) missing.push("OUR MAIN PRODUCTS");
    if (!html.includes("data-product-card")) missing.push("product cards");
    const foundName = catalog.featuredNames.some((name) => htmlIncludesText(html, name));
    if (catalog.featuredNames.length > 0 && !foundName) {
      missing.push(`a featured product name (${catalog.featuredNames.slice(0, 3).join(", ")})`);
    }
  } else if (route === "/products") {
    if (!html.includes("data-product-card")) missing.push("product cards");
    const names = [...catalog.productsBySlug.values()].map((product) => product.name);
    const foundName = names.some((name) => htmlIncludesText(html, name));
    if (names.length > 0 && !foundName) missing.push("a product name");
  } else if (route.endsWith("/faq")) {
    const slug = route.replace(/^\/products\//, "").replace(/\/faq$/, "");
    const product = catalog.productsBySlug.get(slug);
    if (!/"@type":\s*"FAQPage"/i.test(html) && !/"@type":"FAQPage"/i.test(html)) {
      missing.push("FAQPage JSON-LD");
    }
    if (!/Frequently Asked Questions/i.test(html)) {
      missing.push("FAQ heading");
    }
    const faq = product?.faqs?.[0];
    if (faq?.question && !htmlIncludesText(html, faq.question)) {
      missing.push("FAQ question");
    }
    if (faq?.answer && !htmlIncludesText(html, faq.answer)) {
      missing.push("FAQ answer");
    }
  } else if (route.startsWith("/products/")) {
    const slug = route.replace(/^\/products\//, "");
    const product = catalog.productsBySlug.get(slug);
    if (!/<h1[\s>]/i.test(html)) missing.push("product h1");
    if (product?.name && !htmlIncludesText(html, product.name)) {
      missing.push(`product name (${product.name})`);
    }
  }

  if (isHeaderOnly) {
    return `header-only snapshot (catalogue/contact header without page body)`;
  }
  if (missing.length > 0) {
    return `missing ${missing.join(", ")}`;
  }
  return null;
}

async function waitForRouteContent(page, route) {
  if (route === "/" || route === "/products") {
    await page.waitForSelector("[data-product-card]", { timeout: READY_TIMEOUT_MS });
    return;
  }

  if (route.endsWith("/faq")) {
    await page.waitForFunction(
      () =>
        /FAQPage/i.test(document.documentElement.innerHTML) &&
        /Frequently Asked Questions/i.test(document.body.innerText),
      { timeout: READY_TIMEOUT_MS },
    );
    return;
  }

  if (route.startsWith("/products/")) {
    await page.waitForSelector("h1", { timeout: READY_TIMEOUT_MS });
  }
}

function startPreviewServer() {
  const viteBin = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");
  const child = spawn(
    process.execPath,
    [viteBin, "preview", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
    {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
      shell: false,
      windowsHide: true,
    },
  );

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  return { child, getOutput: () => output };
}

async function waitForServer(timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(ORIGIN);
      if (response.ok || response.status === 404) return;
    } catch {
      // retry
    }
    await sleep(250);
  }
  throw new Error(`Preview server did not start on ${ORIGIN}`);
}

function routeToFile(route) {
  if (route === "/") return path.join(DIST, "index.html");
  return path.join(DIST, route.replace(/^\//, ""), "index.html");
}

/** Keep the best title / meta description / canonical (Helmet can leave duplicates). */
function cleanPrerenderHtml(html) {
  const keepPreferred = (source, pattern, prefer) => {
    const matches = [...source.matchAll(pattern)];
    if (matches.length <= 1) return source;
    const preferred =
      [...matches].find((match) => prefer(match[0])) ||
      matches[matches.length - 1];
    let result = source;
    for (const match of matches) {
      if (match[0] !== preferred[0]) {
        result = result.replace(match[0], "");
      }
    }
    return result;
  };

  const metaContent = (tag) => {
    const match = tag.match(/\bcontent=(["'])(.*?)\1/i);
    return match?.[2]?.trim() || "";
  };

  const titleText = (tag) =>
    tag.replace(/<\/?title\b[^>]*>/gi, "").trim();

  let cleaned = html;
  cleaned = keepPreferred(
    cleaned,
    /<title\b[^>]*>[\s\S]*?<\/title>/gi,
    (tag) => {
      const text = titleText(tag);
      return Boolean(text) && text !== "Aira Crest";
    },
  );
  cleaned = keepPreferred(
    cleaned,
    /<meta\b[^>]*\bname=["']description["'][^>]*>/gi,
    (tag) => {
      const content = metaContent(tag);
      return (
        content.length > 40 &&
        !content.startsWith("Aira Crest exports premium")
      );
    },
  );
  cleaned = keepPreferred(
    cleaned,
    /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi,
    (tag) => /href=(["'])https?:\/\//i.test(tag),
  );
  cleaned = keepPreferred(
    cleaned,
    /<meta\b[^>]*\bproperty=["']og:title["'][^>]*>/gi,
    (tag) => metaContent(tag) && metaContent(tag) !== "Aira Crest",
  );
  cleaned = keepPreferred(
    cleaned,
    /<meta\b[^>]*\bproperty=["']og:description["'][^>]*>/gi,
    (tag) => {
      const content = metaContent(tag);
      return (
        content.length > 40 &&
        !content.startsWith("Aira Crest exports premium")
      );
    },
  );
  cleaned = keepPreferred(
    cleaned,
    /<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/gi,
    (tag) => /content=(["'])https?:\/\//i.test(tag),
  );
  return cleaned;
}

async function prerenderRoute(browser, route, catalog) {
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    viewport: { width: 412, height: 915 },
  });
  // Disable entrance animations so crawler HTML/screenshots show real content.
  await page.emulateMedia({ reducedMotion: "reduce" });
  const url = `${ORIGIN}${route}`;

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: READY_TIMEOUT_MS });
    await page.waitForSelector('html[data-prerender-ready="true"]', {
      timeout: READY_TIMEOUT_MS,
    });
    await waitForRouteContent(page, route);
    // Extra settle time for product cards / fonts
    await sleep(500);
    await page.evaluate(() => {
      document.documentElement.classList.add("seo-static");
      document.querySelectorAll("[style*='opacity'], [style*='clip-path']").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.clipPath = "none";
      });
      // Scroll so in-view sections are painted into the HTML snapshot context
      window.scrollTo(0, document.body.scrollHeight);
      window.scrollTo(0, 0);
    });
    await sleep(200);
    const html = cleanPrerenderHtml(await page.content());
    const qualityError = assertSnapshotQuality(route, html, catalog);
    if (qualityError) {
      return { route, ok: false, error: qualityError };
    }
    const outFile = routeToFile(route);
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, html, "utf8");
    return { route, ok: true, bytes: Buffer.byteLength(html) };
  } catch (error) {
    return { route, ok: false, error: error.message };
  } finally {
    await page.close();
  }
}

async function writeSeoFiles(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.map((route) => {
    const loc = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
    let priority = "0.6";
    if (route === "/") priority = "1.0";
    else if (route.endsWith("/faq")) priority = "0.9";
    else if (route === "/products" || route.startsWith("/products/"))
      priority = "0.8";
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  await fs.writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
  await fs.writeFile(path.join(DIST, "robots.txt"), robots, "utf8");
  const faqCount = routes.filter((route) => route.endsWith("/faq")).length;
  console.log(
    `Wrote sitemap.xml (${routes.length} urls, ${faqCount} FAQ pages) and robots.txt`,
  );
}

async function main() {
  const distIndex = path.join(DIST, "index.html");
  try {
    await fs.access(distIndex);
  } catch {
    console.error("dist/index.html missing. Run `vite build` first.");
    process.exit(1);
  }

  console.log("Discovering public routes from API…");
  const { routes, catalog } = await collectRoutes();
  console.log(`Prerendering ${routes.length} routes:`);
  for (const route of routes) console.log(`  - ${route}`);

  const { child, getOutput } = startPreviewServer();
  let browser;

  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });

    const results = [];
    for (const route of routes) {
      process.stdout.write(`→ ${route} … `);
      const result = await prerenderRoute(browser, route, catalog);
      results.push(result);
      if (result.ok) {
        console.log(`ok (${result.bytes} bytes)`);
      } else {
        console.log(`FAILED: ${result.error}`);
      }
    }

    const okRoutes = results.filter((r) => r.ok).map((r) => r.route);
    await writeSeoFiles(okRoutes.length ? okRoutes : routes);

    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      console.error(`\nPrerender finished with ${failed.length} failure(s).`);
      process.exitCode = 1;
    } else {
      console.log("\nPrerender complete. Verify with:");
      console.log(`  grep -i 'meta name="description"' dist/index.html`);
      console.log(`  grep -i '<h1' dist/index.html`);
    }
  } catch (error) {
    console.error("\nPrerender failed:", error.message);
    console.error(getOutput());
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    child.kill("SIGTERM");
    await sleep(300);
    if (!child.killed) child.kill("SIGKILL");
  }
}

main();
