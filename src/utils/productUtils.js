export const getProductImageUrls = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean);
};

export const getProductPrimaryImage = (images) =>
  getProductImageUrls(images)[0] ?? "";

export const sortProductsByOrder = (products) =>
  [...products].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

const MONGO_OBJECT_ID_RE = /^[a-f\d]{24}$/i;

export const isMongoObjectId = (value) =>
  typeof value === "string" && MONGO_OBJECT_ID_RE.test(value);

export const getProductSlug = (product) =>
  product?.slug || product?.id || product?._id || "";

export const getProductPath = (product) => {
  const slug = getProductSlug(product);
  return slug ? `/products/${slug}` : "/products";
};

export const getProductFaqPath = (product) => {
  const slug = getProductSlug(product);
  return slug ? `/products/${slug}/faq` : "/products";
};

export const getVisibleFaqs = (faqs) =>
  (Array.isArray(faqs) ? faqs : []).filter(
    (faq) => faq?.question?.trim() && faq?.answer?.trim(),
  );

/** Preview ~30% of FAQs on the product detail page (at least 1 when any exist). */
export const getPreviewFaqs = (faqs) => {
  const visible = getVisibleFaqs(faqs);
  if (visible.length === 0) return [];
  const count = Math.max(1, Math.ceil(visible.length * 0.3));
  return visible.slice(0, count);
};

/**
 * Centres incomplete last rows in a 6-column grid where each item spans 2 columns.
 */
export const getCenteredProductGridClass = (index, total) => {
  const itemsPerRow = 3;
  const fullRows = Math.floor(total / itemsPerRow);
  const remainder = total % itemsPerRow;

  if (remainder === 0 || index < fullRows * itemsPerRow) {
    return "col-span-2";
  }

  const positionInLastRow = index - fullRows * itemsPerRow;

  if (remainder === 1) {
    return "col-span-2 lg:col-start-3 lg:col-end-5";
  }

  if (remainder === 2) {
    return positionInLastRow === 0
      ? "col-span-2 lg:col-start-2 lg:col-end-4"
      : "col-span-2 lg:col-start-4 lg:col-end-6";
  }

  return "col-span-2";
};
