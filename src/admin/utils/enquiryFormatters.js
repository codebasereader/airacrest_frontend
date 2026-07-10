export const formatEnquiryDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getProductName = (line) =>
  line?.productName || line?.product?.name || "—";

export const getProductSummary = (products) => {
  if (!products?.length) return "—";
  const first = getProductName(products[0]);
  if (products.length === 1) return first;
  return `${first} +${products.length - 1} more`;
};

export const getQuantitySummary = (products) => {
  if (!products?.length) return "—";
  const first = products[0].estimatedQuantity || "—";
  if (products.length === 1) return first;
  return `${first} (+${products.length - 1})`;
};
