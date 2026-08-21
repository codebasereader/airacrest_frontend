import React, { useEffect, useId, useMemo, useState } from "react";
import { useMultipleImageUpload } from "../../hooks/useMultipleImageUpload";
import {
  EMPTY_PRODUCT_FORM,
  createFaqRow,
  createSpecificationRow,
  findDuplicateFaqQuestions,
  toProductFormState,
  toProductPayload,
} from "../../utils/productForm";
import {
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "../../constants/formStyles";
import AdminFormField from "../shared/AdminFormField";
import AdminAlert from "../shared/AdminAlert";
import CatalogSelectField from "../shared/CatalogSelectField";
import ProductImagesField from "./ProductImagesField";
import ProductSpecificationsEditor from "./ProductSpecificationsEditor";
import ProductFaqsEditor from "./ProductFaqsEditor";
import CreateCategoryModal from "./CreateCategoryModal";
import CreateSubcategoryModal from "./CreateSubcategoryModal";

const ProductDrawerForm = ({
  product,
  categories,
  subcategories,
  defaultCategoryId = "",
  defaultSubcategoryId = "",
  saving,
  catalogSaving = false,
  onCreateCategory,
  onCreateSubcategory,
  onSubmit,
  onCancel,
}) => {
  const formId = useId();
  const featuredId = useId();
  const activeId = useId();
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [submitError, setSubmitError] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);

  const {
    images,
    imageKeys,
    uploading,
    error: uploadError,
    uploadFiles,
    resetImages,
    clearImages,
    removeImage,
    setError: setUploadError,
  } = useMultipleImageUpload("products");

  useEffect(() => {
    if (product) {
      setForm(toProductFormState(product));
      resetImages(product.images);
    } else {
      setForm({
        ...EMPTY_PRODUCT_FORM,
        category: defaultCategoryId || "",
        subcategory: defaultSubcategoryId || "",
      });
      clearImages();
    }
    setSubmitError(null);
    setUploadError(null);
  }, [
    product,
    defaultCategoryId,
    defaultSubcategoryId,
    resetImages,
    clearImages,
    setUploadError,
  ]);

  const filteredSubcategories = useMemo(
    () =>
      form.category
        ? subcategories.filter(
            (item) => (item.category?._id || item.category) === form.category,
          )
        : [],
    [form.category, subcategories],
  );

  const handleChange = (field) => (event) => {
    const value =
      field === "isFeatured" || field === "isActive"
        ? event.target.checked
        : field === "sortOrder"
          ? Number(event.target.value)
          : event.target.value;

    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "category") {
        const subsForCategory = subcategories.filter(
          (item) => (item.category?._id || item.category) === value,
        );
        const subStillValid = subsForCategory.some(
          (item) => item._id === prev.subcategory,
        );
        if (!subStillValid) {
          next.subcategory = "";
        }
      }

      return next;
    });
  };

  const handleSpecChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, specIndex) =>
        specIndex === index ? { ...spec, [field]: value } : spec,
      ),
    }));
  };

  const handleAddSpec = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, createSpecificationRow()],
    }));
  };

  const handleRemoveSpec = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter(
        (_, specIndex) => specIndex !== index,
      ),
    }));
  };

  const handleReorderSpec = (fromIndex, toIndex) => {
    setForm((prev) => {
      const specifications = [...prev.specifications];
      const [moved] = specifications.splice(fromIndex, 1);
      specifications.splice(toIndex, 0, moved);
      return { ...prev, specifications };
    });
  };

  const handleFaqChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [field]: value } : faq,
      ),
    }));
  };

  const handleAddFaq = () => {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, createFaqRow()],
    }));
  };

  const handleRemoveFaq = (index) => {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, faqIndex) => faqIndex !== index),
    }));
  };

  const handleReorderFaq = (fromIndex, toIndex) => {
    setForm((prev) => {
      const faqs = [...prev.faqs];
      const [moved] = faqs.splice(fromIndex, 1);
      faqs.splice(toIndex, 0, moved);
      return { ...prev, faqs };
    });
  };

  const duplicateFaqIndexes = useMemo(
    () => findDuplicateFaqQuestions(form.faqs),
    [form.faqs],
  );

  const handleFileSelect = async (files) => {
    try {
      await uploadFiles(files, {
        slug: product?.slug || form.name,
      });
    } catch {
      // Error shown via uploadError
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    if (uploading) return;

    if (!form.category || !form.subcategory) {
      setSubmitError("Category and subcategory are required.");
      return;
    }

    if (duplicateFaqIndexes.length > 0) {
      setSubmitError(
        "Duplicate FAQ questions are not allowed on the same product.",
      );
      return;
    }

    try {
      const payload = toProductPayload(form, imageKeys);
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err?.message || "Failed to save product.");
    }
  };

  const categoryOptions = [
    { value: "", label: "Select category" },
    ...categories.map((category) => ({
      value: category._id,
      label: category.name,
    })),
  ];

  const subcategoryOptions = [
    { value: "", label: "Select subcategory" },
    ...filteredSubcategories.map((subcategory) => ({
      value: subcategory._id,
      label: subcategory.name,
    })),
  ];

  const isDisabled = saving || uploading || catalogSaving;

  const handleCategoryCreated = (created) => {
    if (!created) {
      setCategoryModalOpen(false);
      return;
    }

    setForm((prev) => ({
      ...prev,
      category: created._id,
      subcategory: "",
    }));
    setCategoryModalOpen(false);
  };

  const handleSubcategoryCreated = (created) => {
    if (!created) {
      setSubcategoryModalOpen(false);
      return;
    }

    const parentCategoryId = created.category?._id || created.category;

    setForm((prev) => ({
      ...prev,
      category: parentCategoryId || prev.category,
      subcategory: created._id,
    }));
    setSubcategoryModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {categories.length === 0 && (
        <AdminAlert message='No categories yet. Use "+ Add" above the category field to create one.' />
      )}
      {categories.length > 0 && subcategories.length === 0 && (
        <AdminAlert message='No subcategories yet. Use "+ Add" above the subcategory field to create one.' />
      )}

      {(submitError || uploadError) && (
        <AdminAlert message={submitError || uploadError} />
      )}

      <AdminFormField
        id={`${formId}-name`}
        label="Product Name"
        value={form.name}
        onChange={handleChange("name")}
        placeholder="e.g. Turmeric Powder"
        required
        disabled={isDisabled}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <CatalogSelectField
          id={`${formId}-category`}
          label="Category"
          value={form.category}
          onChange={handleChange("category")}
          options={categoryOptions}
          required
          disabled={isDisabled}
          onAdd={() => setCategoryModalOpen(true)}
          addDisabled={catalogSaving}
        />

        <CatalogSelectField
          id={`${formId}-subcategory`}
          label="Subcategory"
          value={form.subcategory}
          onChange={handleChange("subcategory")}
          options={subcategoryOptions}
          required
          disabled={isDisabled}
          onAdd={() => setSubcategoryModalOpen(true)}
          addDisabled={catalogSaving || categories.length === 0}
        />
      </div>

      <AdminFormField
        id={`${formId}-description`}
        label="Description"
        as="textarea"
        value={form.description}
        onChange={handleChange("description")}
        placeholder="Full product description for buyers"
        disabled={isDisabled}
      />

      <ProductImagesField
        images={images}
        uploading={uploading}
        error={uploadError}
        disabled={isDisabled}
        onFileSelect={handleFileSelect}
        onRemove={removeImage}
      />

      <AdminFormField
        id={`${formId}-highlights`}
        label="Highlights"
        value={form.highlights}
        onChange={handleChange("highlights")}
        placeholder="Premium quality, Export grade, High curcumin"
        disabled={isDisabled}
      />
      <p className="-mt-3 font-sans text-[11px] text-maroon-500">
        Separate highlights with commas.
      </p>

      <AdminFormField
        id={`${formId}-note`}
        label="Note (optional)"
        as="textarea"
        value={form.note}
        onChange={handleChange("note")}
        placeholder="e.g. Parameters meet EU / US import standards; every batch is lab verified."
        disabled={isDisabled}
      />
      <p className="-mt-3 font-sans text-[11px] text-maroon-500">
        Shown on the product detail page below specifications.
      </p>

      <ProductSpecificationsEditor
        specifications={form.specifications}
        disabled={isDisabled}
        onChange={handleSpecChange}
        onAdd={handleAddSpec}
        onRemove={handleRemoveSpec}
        onReorder={handleReorderSpec}
      />

      <ProductFaqsEditor
        faqs={form.faqs}
        disabled={isDisabled}
        duplicateIndexes={duplicateFaqIndexes}
        onChange={handleFaqChange}
        onAdd={handleAddFaq}
        onRemove={handleRemoveFaq}
        onReorder={handleReorderFaq}
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

        <div className="space-y-3 sm:pt-6">
          <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-maroon-800">
            <input
              id={featuredId}
              type="checkbox"
              checked={form.isFeatured}
              onChange={handleChange("isFeatured")}
              disabled={isDisabled}
              className="h-4 w-4 rounded border-maroon-300 text-maroon-800 focus:ring-maroon-600/20"
            />
            Show on homepage
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-maroon-800">
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
          disabled={
            isDisabled ||
            !form.name.trim() ||
            !form.category ||
            !form.subcategory
          }
          className={adminPrimaryButtonClass}
        >
          {saving
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
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

      <CreateCategoryModal
        open={categoryModalOpen}
        saving={catalogSaving}
        onClose={handleCategoryCreated}
        onCreate={onCreateCategory}
      />

      <CreateSubcategoryModal
        open={subcategoryModalOpen}
        categories={categories}
        defaultCategoryId={form.category}
        saving={catalogSaving}
        onClose={handleSubcategoryCreated}
        onCreate={onCreateSubcategory}
      />
    </form>
  );
};

export default ProductDrawerForm;
