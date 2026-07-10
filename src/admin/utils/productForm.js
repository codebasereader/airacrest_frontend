export const DEFAULT_PRODUCT_SPEC_LABELS = [
  "HS Code (6 digit)",
  "ITC (HS) Code (8 digit)",
  "Variety",
  "Available Forms",
  "Colour",
  "Moisture",
  "SO₂",
  "Foreign matter",
  "Microbiology",
  "Packaging",
  "Shelf life",
  "MOQ",
];

const createSpecId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `spec-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createSpecificationRow = (label = "", value = "") => ({
  id: createSpecId(),
  label,
  value,
});

export const createDefaultSpecifications = () =>
  DEFAULT_PRODUCT_SPEC_LABELS.map((label) => createSpecificationRow(label, ""));

export const normalizeSpecificationRow = (spec) => ({
  id: spec?.id || createSpecId(),
  label: spec?.label ?? "",
  value: spec?.value ?? "",
});

export const EMPTY_PRODUCT_FORM = {
  name: "",
  category: "",
  subcategory: "",
  description: "",
  highlights: "",
  note: "",
  specifications: createDefaultSpecifications(),
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
};

export const getRelationId = (value) => value?._id || value || "";

export const toProductFormState = (product) => ({
  name: product?.name ?? "",
  category: getRelationId(product?.category),
  subcategory: getRelationId(product?.subcategory),
  description: product?.description ?? "",
  highlights: Array.isArray(product?.highlights)
    ? product.highlights.join(", ")
    : (product?.highlights ?? ""),
  note: product?.note ?? "",
  specifications:
    product?.specifications?.length > 0
      ? product.specifications.map(normalizeSpecificationRow)
      : createDefaultSpecifications(),
  isFeatured: product?.isFeatured ?? false,
  isActive: product?.isActive ?? true,
  sortOrder: product?.sortOrder ?? 0,
});

export const toProductPayload = (form, imageKeys) => {
  const highlights = form.highlights
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const specifications = form.specifications
    .map((spec) => ({
      label: spec.label.trim(),
      value: spec.value.trim(),
    }))
    .filter((spec) => spec.label && spec.value);

  const payload = {
    name: form.name.trim(),
    category: form.category,
    subcategory: form.subcategory,
    description: form.description.trim(),
    highlights,
    note: form.note.trim() || null,
    specifications,
    isFeatured: form.isFeatured,
    isActive: form.isActive,
    sortOrder: Number(form.sortOrder) || 0,
  };

  if (imageKeys.length > 0) {
    payload.images = imageKeys;
  }

  return payload;
};
