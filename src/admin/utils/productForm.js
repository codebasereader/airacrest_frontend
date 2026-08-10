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

const createRowId = (prefix = "row") =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createSpecificationRow = (label = "", value = "") => ({
  id: createRowId("spec"),
  label,
  value,
});

export const createDefaultSpecifications = () =>
  DEFAULT_PRODUCT_SPEC_LABELS.map((label) => createSpecificationRow(label, ""));

export const normalizeSpecificationRow = (spec) => ({
  id: spec?.id || createRowId("spec"),
  label: spec?.label ?? "",
  value: spec?.value ?? "",
});

export const createFaqRow = (question = "", answer = "") => ({
  id: createRowId("faq"),
  question,
  answer,
});

export const normalizeFaqRow = (faq) => ({
  id: faq?.id || faq?._id || createRowId("faq"),
  question: faq?.question ?? "",
  answer: faq?.answer ?? "",
});

export const normalizeFaqQuestionKey = (question) =>
  question.trim().toLowerCase().replace(/\s+/g, " ");

export const findDuplicateFaqQuestions = (faqs) => {
  const seen = new Map();
  const duplicates = new Set();

  faqs.forEach((faq, index) => {
    const key = normalizeFaqQuestionKey(faq.question || "");
    if (!key) return;

    if (seen.has(key)) {
      duplicates.add(index);
      duplicates.add(seen.get(key));
    } else {
      seen.set(key, index);
    }
  });

  return [...duplicates].sort((a, b) => a - b);
};

export const EMPTY_PRODUCT_FORM = {
  name: "",
  category: "",
  subcategory: "",
  description: "",
  highlights: "",
  note: "",
  specifications: createDefaultSpecifications(),
  faqs: [],
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
  faqs: Array.isArray(product?.faqs)
    ? product.faqs.map(normalizeFaqRow)
    : [],
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

  const faqs = form.faqs
    .map((faq) => ({
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    }))
    .filter((faq) => faq.question && faq.answer);

  const payload = {
    name: form.name.trim(),
    category: form.category,
    subcategory: form.subcategory,
    description: form.description.trim(),
    highlights,
    note: form.note.trim() || null,
    specifications,
    faqs,
    isFeatured: form.isFeatured,
    isActive: form.isActive,
    sortOrder: Number(form.sortOrder) || 0,
  };

  if (imageKeys.length > 0) {
    payload.images = imageKeys;
  }

  return payload;
};
