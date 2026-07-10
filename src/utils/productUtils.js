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
