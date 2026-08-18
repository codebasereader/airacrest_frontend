/**
 * Copies live product images into dist/media/products with descriptive names
 * so production HTML does not point at airacrest-dev or ChatGPT filenames.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const API_BASE = (
  process.env.VITE_API_BASE_URL ||
  "https://jvau29a6le.execute-api.ap-south-1.amazonaws.com/api"
).replace(/\/$/, "");

const getImageExtension = (url) => {
  try {
    const pathname = decodeURIComponent(new URL(url).pathname);
    const match = pathname.match(/\.(webp|jpe?g|png|gif|avif|svg)$/i);
    if (!match) return ".jpg";
    return match[0].toLowerCase().replace(".jpeg", ".jpg");
  } catch {
    return ".jpg";
  }
};

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

const unwrapList = (data) => (Array.isArray(data) ? data : data?.items || []);

async function downloadFile(url, dest) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await response.arrayBuffer()));
}

async function main() {
  const products = unwrapList(await fetchApi("products?limit=100"));

  let copied = 0;
  const productDir = path.join(DIST, "media", "products");
  await fs.mkdir(productDir, { recursive: true });

  for (const product of products) {
    const slug = product?.slug;
    const images = Array.isArray(product?.images) ? product.images : [];
    if (!slug) continue;

    for (const [index, image] of images.entries()) {
      const url = typeof image === "string" ? image : image?.url;
      if (!url) continue;
      const dest = path.join(
        productDir,
        `${slug}-${index + 1}${getImageExtension(url)}`,
      );
      process.stdout.write(`→ ${path.relative(DIST, dest)} … `);
      try {
        await downloadFile(url, dest);
        copied += 1;
        console.log("ok");
      } catch (error) {
        console.log(`FAILED: ${error.message}`);
        process.exitCode = 1;
      }
    }
  }

  console.log(`Mirrored ${copied} images into dist/media`);
}

main();
