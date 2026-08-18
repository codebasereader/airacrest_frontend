import React, { useEffect, useId, useState } from "react";
import { EMPTY_SUBCATEGORY_FORM } from "../../hooks/useSubcategories";
import { useImageUpload } from "../../hooks/useImageUpload";
import {
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "../../constants/formStyles";
import AdminFormField from "../shared/AdminFormField";
import AdminImageUpload from "../shared/AdminImageUpload";
import AdminAlert from "../shared/AdminAlert";

const toFormState = (subcategory) => ({
  name: subcategory?.name ?? "",
  category:
    subcategory?.category?._id || subcategory?.category || "",
  description: subcategory?.description ?? "",
  sortOrder: subcategory?.sortOrder ?? 0,
  isActive: subcategory?.isActive ?? true,
});

const SubcategoryDrawerForm = ({
  subcategory,
  categories,
  defaultCategoryId = "",
  saving,
  onSubmit,
  onCancel,
}) => {
  const formId = useId();
  const activeId = useId();
  const [form, setForm] = useState(EMPTY_SUBCATEGORY_FORM);
  const [submitError, setSubmitError] = useState(null);

  const {
    imageKey,
    previewUrl,
    uploading,
    error: uploadError,
    uploadFile,
    resetImage,
    clearImage,
    setError: setUploadError,
  } = useImageUpload("subcategories");

  useEffect(() => {
    if (subcategory) {
      setForm(toFormState(subcategory));
      resetImage(subcategory.image);
    } else {
      setForm({
        ...EMPTY_SUBCATEGORY_FORM,
        category: defaultCategoryId || "",
      });
      clearImage();
    }
    setSubmitError(null);
    setUploadError(null);
  }, [subcategory, defaultCategoryId, resetImage, clearImage, setUploadError]);

  const handleChange = (field) => (event) => {
    const value =
      field === "isActive"
        ? event.target.checked
        : field === "sortOrder"
          ? Number(event.target.value)
          : event.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (file) => {
    try {
      await uploadFile(file, { slug: form.name });
    } catch {
      // Error shown via uploadError
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    if (uploading) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };

    if (imageKey) {
      payload.image = imageKey;
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err?.message || "Failed to save subcategory.");
    }
  };

  const categoryOptions = [
    { value: "", label: "Select parent category" },
    ...categories.map((category) => ({
      value: category._id,
      label: category.name,
    })),
  ];

  const isDisabled = saving || uploading || categories.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {categories.length === 0 && (
        <AdminAlert message="Create at least one category before adding subcategories." />
      )}

      {(submitError || uploadError) && (
        <AdminAlert message={submitError || uploadError} />
      )}

      <AdminFormField
        id={`${formId}-category`}
        label="Parent Category"
        as="select"
        value={form.category}
        onChange={handleChange("category")}
        options={categoryOptions}
        required
        disabled={isDisabled}
      />

      <AdminFormField
        id={`${formId}-name`}
        label="Name"
        value={form.name}
        onChange={handleChange("name")}
        placeholder="e.g. Whole Spices"
        required
        disabled={isDisabled}
      />

      <AdminFormField
        id={`${formId}-description`}
        label="Description"
        as="textarea"
        value={form.description}
        onChange={handleChange("description")}
        placeholder="Brief subcategory description"
        disabled={isDisabled}
      />

      <AdminImageUpload
        previewUrl={previewUrl}
        uploading={uploading}
        error={uploadError}
        disabled={isDisabled}
        onFileSelect={handleFileSelect}
        onClear={clearImage}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          id={`${formId}-sortOrder`}
          label="Sort Order"
          type="number"
          min={0}
          value={form.sortOrder}
          onChange={handleChange("sortOrder")}
          disabled={isDisabled}
        />

        <div className="flex items-end pb-1">
          <label className="inline-flex cursor-pointer items-center gap-2.5 font-sans text-sm text-maroon-800">
            <input
              id={activeId}
              type="checkbox"
              checked={form.isActive}
              onChange={handleChange("isActive")}
              disabled={isDisabled}
              className="h-4 w-4 rounded border-maroon-300 text-maroon-800 focus:ring-maroon-600/20"
            />
            Visible on storefront
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-maroon-100 pt-5">
        <button
          type="submit"
          disabled={isDisabled || !form.name.trim() || !form.category}
          className={adminPrimaryButtonClass}
        >
          {saving
            ? "Saving..."
            : subcategory
              ? "Update Subcategory"
              : "Create Subcategory"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isDisabled}
          className={adminSecondaryButtonClass}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SubcategoryDrawerForm;
