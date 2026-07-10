const hasSpecValue = (value) => {
  if (value == null) return false;
  const text = String(value).trim();
  return text.length > 0 && text !== "—" && text !== "-";
};

/**
 * Returns only specification rows that have a label and a non-empty value.
 * Supports array [{ label, value }] or record { [label]: value } shapes.
 */
export const getVisibleSpecifications = (specifications) => {
  if (!specifications) return [];

  if (Array.isArray(specifications)) {
    return specifications.filter(
      (spec) => hasSpecValue(spec?.label) && hasSpecValue(spec?.value),
    );
  }

  if (typeof specifications === "object") {
    return Object.entries(specifications)
      .filter(([label, value]) => hasSpecValue(label) && hasSpecValue(value))
      .map(([label, value]) => ({ label, value: String(value).trim() }));
  }

  return [];
};
