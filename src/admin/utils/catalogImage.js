export const getImageKey = (image) => {
  if (!image) return "";
  if (typeof image === "string") {
    return image.startsWith("http") ? "" : image;
  }
  return image.key || "";
};

export const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") {
    return image.startsWith("http") ? image : null;
  }
  return image.url || null;
};

export const normalizeImages = (images) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => ({
      key: getImageKey(image),
      url: getImageUrl(image),
    }))
    .filter((image) => image.key || image.url);
};

export const getFirstImageUrl = (images) => {
  const normalized = normalizeImages(images);
  return normalized[0]?.url || null;
};

export const getImageKeys = (images) =>
  normalizeImages(images)
    .map((image) => image.key)
    .filter(Boolean);
