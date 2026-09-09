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
import { toPublicProductImageUrl } from "../src/utils/publicImageUrl.js";

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
        images: Array.isArray(product.images) ? product.images : [],
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
          images: Array.isArray(detail?.images)
            ? detail.images
            : Array.isArray(product.images)
              ? product.images
              : [],
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

  const canonical = canonicalForRoute(route);
  if (!html.includes(`rel="canonical" href="${canonical}"`)) {
    missing.push(`self-referencing canonical (${canonical})`);
  }
  if (!html.includes(`property="og:url" content="${canonical}"`)) {
    missing.push(`og:url ${canonical}`);
  }
  if (/127\.0\.0\.1|localhost/i.test(html)) {
    missing.push("localhost/dev URL leaked into HTML");
  }
  if (/airacrest-dev\.s3[^"']*\/products\//i.test(html)) {
    missing.push("airacrest-dev product image URL");
  }
  if (/wa\.me\/9187454810(?!\d)/i.test(html)) {
    missing.push("WhatsApp link missing country code (wa.me/919187454810)");
  }
  if (!/wa\.me\/919187454810/i.test(html)) {
    missing.push("WhatsApp international number on this route");
  }
  if (/data-short-label/i.test(html) || />CATALOGUE<\/span>/i.test(html)) {
    missing.push("duplicated catalogue button label");
  }
  if (/CATALOGUECATALOGUE/i.test(html.replace(/\s+/g, ""))) {
    missing.push("duplicated catalogue button label");
  }
  if (/REQUESTAQUOTEENQUIRY/i.test(html.replace(/\s+/g, ""))) {
    missing.push("duplicated enquiry button label");
  }
  const visibleText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  if (!/CIN U10302KA2026PTC215246/.test(visibleText)) {
    missing.push("CIN label and number with a space between them");
  }
  if (
    (route === "/" || route === "/products" || route.startsWith("/products/")) &&
    /airacrest(?:-dev)?\.s3[^"']*\/products\//i.test(html)
  ) {
    missing.push("S3 product image URL (use /media/products)");
  }
  if (route === "/" && !html.includes("https://www.airacrest.com/Aira_Crest_Brochure.pdf")) {
    missing.push("production catalogue PDF URL");
  }
  if (
    route === "/" &&
    !html.includes("https://www.airacrest.com/media/products/") &&
    !html.includes("https://media.airacrest.com/")
  ) {
    missing.push("production product image path");
  }
  if (/ChatGPT-Image/i.test(html)) {
    missing.push("ChatGPT image filename");
  }
  if (
    route.startsWith("/products/") &&
    /property="og:title" content="Aira Crest \| Banana Powder, Moringa/i.test(html)
  ) {
    missing.push("product-specific og:title");
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
      [...matches].reverse().find((match) => prefer(match[0])) ||
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
  cleaned = cleaned
    .replaceAll(`http://127.0.0.1:${PORT}`, SITE_URL)
    .replaceAll(`http://localhost:${PORT}`, SITE_URL);
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
        !content.startsWith("Bengaluru export house")
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
        !content.startsWith("Bengaluru export house")
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

function canonicalForRoute(route) {
  return route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
}

function extractTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return decodeHtml(match?.[1]?.trim() || "");
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function replaceOrInsertHeadTag(html, pattern, tag) {
  const matches = [...html.matchAll(pattern)];
  let result = html;
  for (const match of matches) {
    result = result.replace(match[0], "");
  }
  if (!/<\/head>/i.test(result)) return `${result}${tag}`;
  return result.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function titleForRoute(route, catalog, html) {
  if (route === "/") {
    return "Aira Crest | Banana Powder, Moringa and Honey Exporter from India";
  }
  if (route === "/products") return "All Products | Aira Crest";
  if (route === "/blogs") return "Insights & Articles | Aira Crest";

  if (route.endsWith("/faq")) {
    const slug = route.replace(/^\/products\//, "").replace(/\/faq$/, "");
    const name = toBritishSpelling(catalog.productsBySlug.get(slug)?.name || "");
    if (name) return `${name} FAQ | Aira Crest`;
  } else if (route.startsWith("/products/")) {
    const slug = route.replace(/^\/products\//, "");
    const name = toBritishSpelling(catalog.productsBySlug.get(slug)?.name || "");
    if (name) return `${name} | Aira Crest`;
  }

  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)]
    .map((match) => decodeHtml(match[1].trim()))
    .filter(
      (text) =>
        text &&
        text !== "Aira Crest" &&
        !text.startsWith("Aira Crest | Banana Powder, Moringa"),
    );
  return titles.at(-1) || extractTitle(html);
}

function applySelfReferencingSeo(html, route, catalog) {
  const canonical = canonicalForRoute(route);
  const title = titleForRoute(route, catalog, html);
  let next = html;
  next = replaceOrInsertHeadTag(
    next,
    /<title\b[^>]*>[\s\S]*?<\/title>/gi,
    `<title>${escapeAttr(title)}</title>`,
  );
  next = replaceOrInsertHeadTag(
    next,
    /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi,
    `<link rel="canonical" href="${canonical}">`,
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/gi,
    `<meta property="og:url" content="${canonical}">`,
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\b[^>]*\bproperty=["']og:title["'][^>]*>/gi,
    `<meta property="og:title" content="${escapeAttr(title)}">`,
  );
  next = replaceOrInsertHeadTag(
    next,
    /<meta\b[^>]*\bname=["']twitter:title["'][^>]*>/gi,
    `<meta name="twitter:title" content="${escapeAttr(title)}">`,
  );
  next = rewriteLeakedProductImages(next, catalog);
  return next;
}

function rewriteLeakedProductImages(html, catalog) {
  let next = html;
  for (const product of catalog.productsBySlug.values()) {
    const images = Array.isArray(product.images) ? product.images : [];
    images.forEach((image, index) => {
      const url = typeof image === "string" ? image : image?.url;
      if (!url) return;
      const clean = toPublicProductImageUrl(url, {
        slug: product.slug,
        index,
      });
      if (!clean || clean === url) return;
      next = next.split(url).join(clean);
      try {
        next = next.split(encodeURI(url)).join(clean);
      } catch {
        // ignore malformed URLs
      }
    });
  }
  return next;
}

async function prerenderRoute(browser, route, catalog) {
  const page = await browser.newPage({
    // Use a normal browser UA so skipCrawlerRemount cannot freeze a stale
    // product HTML snapshot (header/footer would never rebuild).
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
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
    const html = applySelfReferencingSeo(
      cleanPrerenderHtml(await page.content()),
      route,
      catalog,
    );
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

  const spaShell = await fs.readFile(distIndex, "utf8");

  // Drop previously prerendered route HTML so vite preview always boots the
  // SPA shell. Otherwise Googlebot skip-remount can freeze an old header/footer
  // into product pages.
  await fs.rm(path.join(DIST, "products"), { recursive: true, force: true });
  await fs.rm(path.join(DIST, "blogs"), { recursive: true, force: true });

  console.log("Discovering public routes from API…");
  const { routes, catalog } = await collectRoutes();
  const orderedRoutes = [
    ...routes.filter((route) => route !== "/"),
    ...routes.filter((route) => route === "/"),
  ];
  console.log(`Prerendering ${orderedRoutes.length} routes:`);
  for (const route of orderedRoutes) console.log(`  - ${route}`);

  const { child, getOutput } = startPreviewServer();
  let browser;

  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });

    const results = [];
    for (const route of orderedRoutes) {
      await fs.writeFile(distIndex, spaShell, "utf8");
      if (route !== "/") {
        await fs.rm(routeToFile(route), { force: true });
      }
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
