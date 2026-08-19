const S3_HOST_RE = /^https?:\/\/airacrest(?:-dev)?\.s3\.[^/]+/i;
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

/** Production HTML should not expose the airacrest-dev bucket or ChatGPT filenames. */
export const toPublicProductImageUrl = (url, { slug, index = 0 } = {}) => {
  if (!url || !isManagedS3Url(url) || !slug) return url;
  if (!import.meta.env.PROD) return url;
  return `${PUBLIC_ORIGIN}${getMirroredProductImagePath(slug, index, url)}`;
};

export const toDescriptiveUploadFileName = (originalName, { slug, index } = {}) => {
  const extMatch = String(originalName || "").match(/\.(webp|jpe?g|png|gif|avif)$/i);
  const ext = extMatch ? extMatch[0].toLowerCase().replace(".jpeg", ".jpg") : ".jpg";
  const base = slug || "image";
  const suffix = Number.isFinite(index) ? index + 1 : Date.now();
  return `${base}-${suffix}${ext}`;
};
