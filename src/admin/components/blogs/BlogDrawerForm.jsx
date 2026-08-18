import React, { useEffect, useId, useState } from "react";
import { useImageUpload } from "../../hooks/useImageUpload";
import {
  BLOG_STATUSES,
  EMPTY_BLOG_FORM,
  slugify,
  toBlogFormState,
  toBlogPayload,
} from "../../utils/blogForm";
import {
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "../../constants/formStyles";
import AdminFormField from "../shared/AdminFormField";
import AdminAlert from "../shared/AdminAlert";
import AdminSpinner from "../shared/AdminSpinner";
import AdminImageUpload from "../shared/AdminImageUpload";
import BlogRichTextEditor from "./BlogRichTextEditor";

const BlogDrawerForm = ({
  blog,
  products,
  saving,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const formId = useId();
  const [form, setForm] = useState(EMPTY_BLOG_FORM);
  const [submitError, setSubmitError] = useState(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    imageKey,
    previewUrl,
    uploading,
    error: uploadError,
    uploadFile,
    resetImage,
    clearImage,
    setError: setUploadError,
  } = useImageUpload("blogs");

  useEffect(() => {
    if (blog) {
      setForm(toBlogFormState(blog));
      resetImage(blog.coverImage);
      setSlugEdited(true);
    } else {
      setForm(EMPTY_BLOG_FORM);
      clearImage();
      setSlugEdited(false);
    }
    setSubmitError(null);
    setUploadError(null);
  }, [blog, resetImage, clearImage, setUploadError]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "title" && !slugEdited) {
        next.slug = slugify(value);
      }

      if (field === "slug") {
        setSlugEdited(true);
      }

      return next;
    });
  };

  const handleContentChange = (html) => {
    setForm((prev) => ({ ...prev, content: html }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    if (!form.title.trim()) {
      setSubmitError("Title is required.");
      return;
    }

    if (!form.content.trim() || form.content === "<br>") {
      setSubmitError("Content is required.");
      return;
    }

    try {
      const payload = toBlogPayload(form, imageKey || null);
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err?.message || "Failed to save blog. Please try again.");
    }
  };

  const productOptions = [
    { value: "", label: "No product (general article)" },
    ...products.map((product) => ({
      value: product._id,
      label: product.name,
    })),
  ];

  const statusOptions = BLOG_STATUSES.map((status) => ({
    value: status.value,
    label: status.label,
  }));

  return (
    loading ? (
      <AdminSpinner label="Loading article…" />
    ) : (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      {(submitError || uploadError) && (
        <AdminAlert message={submitError || uploadError} />
      )}

      <AdminFormField
        id={`${formId}-title`}
        label="Title"
        value={form.title}
        onChange={handleChange("title")}
        placeholder="e.g. Why Dehydrated Onion Matters for Export"
        required
        disabled={saving}
      />

      <AdminFormField
        id={`${formId}-slug`}
        label="URL Slug"
        value={form.slug}
        onChange={handleChange("slug")}
        placeholder="dehydrated-onion-export-guide"
        disabled={saving}
      />

      <AdminFormField
        id={`${formId}-excerpt`}
        label="Excerpt"
        as="textarea"
        value={form.excerpt}
        onChange={handleChange("excerpt")}
        placeholder="A short summary shown on the blog listing and in previews…"
        disabled={saving}
      />

      <AdminImageUpload
        label="Cover Image"
        previewUrl={previewUrl}
        uploading={uploading}
        error={uploadError}
        disabled={saving}
        onFileSelect={(file) => uploadFile(file, { slug: form.slug || form.title })}
        onClear={clearImage}
      />

      <BlogRichTextEditor
        value={form.content}
        onChange={handleContentChange}
        disabled={saving || uploading}
        slug={form.slug || form.title}
      />

      <AdminFormField
        id={`${formId}-product`}
        label="Related Product (optional)"
        as="select"
        value={form.product}
        onChange={handleChange("product")}
        options={productOptions}
        disabled={saving}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField
          id={`${formId}-status`}
          label="Status"
          as="select"
          value={form.status}
          onChange={handleChange("status")}
          options={statusOptions}
          disabled={saving}
        />

        <AdminFormField
          id={`${formId}-author`}
          label="Author"
          value={form.author}
          onChange={handleChange("author")}
          placeholder="Aira Crest Team"
          disabled={saving}
        />
      </div>

      <AdminFormField
        id={`${formId}-tags`}
        label="Tags"
        value={form.tags}
        onChange={handleChange("tags")}
        placeholder="Export, Dehydrated Vegetables, Spices"
        disabled={saving}
      />

      <div className="flex flex-wrap gap-3 border-t border-maroon-100 pt-5">
        <button
          type="submit"
          disabled={saving || uploading}
          className={adminPrimaryButtonClass}
        >
          {saving ? "Saving…" : blog ? "Update Blog" : "Publish Blog"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className={adminSecondaryButtonClass}
        >
          Cancel
        </button>
      </div>
    </form>
    )
  );
};

export default BlogDrawerForm;
