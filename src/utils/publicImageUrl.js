import { slugify } from "./slugify.js";

const S3_HOST_RE = /^https?:\/\/airacrest(?:-dev)?\.s3\.[^/]+/i;
const MEDIA_HOST_RE = /^https?:\/\/(?:www\.)?airacrest\.com\/media\//i;
const UGLY_FILE_NAME_RE =
  /chatgpt|dall-?e|midjourney|screenshot|untitled|generated/i;
const PUBLIC_ORIGIN = "https://www.airacrest.com";

export const getImageExtension = (url) => {
  try {
    const pathname = decodeURIComponent(new URL(url).pathname);
    const match = pathname.match(/\.(webp|jpe?g|png|gif|avif|svg)$/i);
    if (!match) return ".jpg";
    return match[0].toLowerCase().replace(".jpeg", ".jpg");
  } catch {
    return ".jpg";
  }
};

export const getMirroredProductImagePath = (slug, index, sourceUrl) =>
  `/media/products/${slug || "product"}-${index + 1}${getImageExtension(sourceUrl)}`;

export const isManagedS3Url = (url) =>
  typeof url === "string" && S3_HOST_RE.test(url);

const shouldRewritePublicImage = (url) =>
  typeof url === "string" &&
  (S3_HOST_RE.test(url) ||
    MEDIA_HOST_RE.test(url) ||
    UGLY_FILE_NAME_RE.test(url));

/** Public pages should never expose the airacrest-dev bucket or ChatGPT filenames. */
export const toPublicProductImageUrl = (url, { slug, index = 0 } = {}) => {
  if (!url || !slug) return url;
  const cleanUrl = `${PUBLIC_ORIGIN}${getMirroredProductImagePath(slug, index, url)}`;
  if (!shouldRewritePublicImage(url)) return url;
  return cleanUrl;
};

export const toPublicProductImages = (images, slug) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((image, index) => {
      const url = typeof image === "string" ? image : image?.url;
      const publicUrl = toPublicProductImageUrl(url, { slug, index });
      if (!publicUrl) return null;
      if (typeof image === "string") return publicUrl;
      return { ...image, url: publicUrl };
    })
    .filter(Boolean);
};

export const withPublicProductImages = (product) => {
  if (!product) return product;
  const slug = product.slug || slugify(product.name);
  return {
    ...product,
    images: toPublicProductImages(product.images, slug),
  };
};

export const toDescriptiveUploadFileName = (
  originalName,
  { slug, index } = {},
) => {
  const extMatch = String(originalName || "").match(/\.(webp|jpe?g|png|gif|avif)$/i);
  const ext = extMatch
    ? extMatch[0].toLowerCase().replace(".jpeg", ".jpg")
    : ".jpg";
  const fromSlug = slugify(slug);
  const base =
    fromSlug && !UGLY_FILE_NAME_RE.test(fromSlug) ? fromSlug : "product";
  const suffix = Number.isFinite(index) ? index + 1 : Date.now();
  return `${base}-${suffix}${ext}`;
};
