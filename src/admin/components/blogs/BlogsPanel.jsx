import React, { useCallback, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import * as blogsApi from "../../../api/blogsApi";
import { ApiError } from "../../../api/client";
import { adminFieldClass, adminPrimaryButtonClass } from "../../constants/formStyles";
import { getRelationId } from "../../utils/blogForm";
import AdminAlert from "../shared/AdminAlert";
import AdminDrawer from "../shared/AdminDrawer";
import AdminEmptyState from "../shared/AdminEmptyState";
import AdminSpinner from "../shared/AdminSpinner";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import BlogCard from "./BlogCard";
import BlogDrawerForm from "./BlogDrawerForm";
import BlogViewDrawer from "./BlogViewDrawer";

const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const BlogsPanel = ({
  blogs,
  products,
  loading,
  saving,
  error,
  statusFilter,
  onStatusFilterChange,
  onDismissError,
  onSetError,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const productNameById = useMemo(
    () =>
      Object.fromEntries(
        products.map((product) => [product._id, product.name]),
      ),
    [products],
  );

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      if (query) {
        const haystack = [blog.title, blog.excerpt, blog.slug, blog.author]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [blogs, search]);

  const openCreateDrawer = () => {
    setEditingBlog(null);
    setSuccessMessage(null);
    onDismissError?.();
    setDrawerOpen(true);
  };

  const openEditDrawer = async (blog) => {
    setSuccessMessage(null);
    onDismissError?.();
    setEditLoading(true);
    setDrawerOpen(true);
    setEditingBlog(null);

    try {
      const fullBlog = await blogsApi.getBlog(blog._id);
      setEditingBlog(fullBlog);
    } catch (err) {
      setDrawerOpen(false);
      onSetError?.(
        err instanceof ApiError
          ? err.message
          : "Failed to load blog for editing. Please try again.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  const openViewDrawer = (blog) => {
    setViewingBlog(blog);
    setViewDrawerOpen(true);
  };

  const closeViewDrawer = () => {
    setViewDrawerOpen(false);
    setViewingBlog(null);
  };

  const closeDrawer = useCallback(() => {
    if (saving) return;
    setDrawerOpen(false);
    setEditingBlog(null);
  }, [saving]);

  const handleSubmit = async (formData) => {
    if (editingBlog) {
      await onUpdate(editingBlog._id, formData);
      setSuccessMessage(`"${formData.title}" updated successfully.`);
    } else {
      const created = await onCreate(formData);
      setSuccessMessage(`"${created.title}" created successfully.`);
    }
    setDrawerOpen(false);
    setEditingBlog(null);
  };

  const requestDelete = (blog) => {
    setDeleteTarget(blog);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setSuccessMessage(null);
    onDismissError?.();

    try {
      await onDelete(deleteTarget._id);
      setSuccessMessage(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch {
      // Error handled by parent hook
    }
  };

  const getProductName = (blog) => {
    const productId = getRelationId(blog.product);
    return blog.product?.name || productNameById[productId] || "";
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-[0.06em] text-maroon-900">
            All Blogs
          </h2>
          <p className="mt-1 font-sans text-xs text-maroon-600">
            {filteredBlogs.length} article
            {filteredBlogs.length === 1 ? "" : "s"}
            {search.trim() ? " matching search" : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateDrawer}
          className={`${adminPrimaryButtonClass} gap-2 self-start`}
        >
          <HugeiconsIcon
            icon={Add01Icon}
            size={16}
            color="currentColor"
            strokeWidth={1.75}
          />
          Write Blog
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search blogs…"
          className={`${adminFieldClass} sm:max-w-xs`}
        />
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className={`${adminFieldClass} sm:max-w-[180px]`}
        >
          {STATUS_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <AdminAlert message={error} onDismiss={onDismissError} />}
      {successMessage && (
        <AdminAlert
          variant="success"
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      {loading ? (
        <AdminSpinner label="Loading blogs..." />
      ) : filteredBlogs.length === 0 ? (
        <AdminEmptyState
          title={search.trim() ? "No blogs match your search" : "No blogs yet"}
          description='Click "Write Blog" to publish your first article with images and optional product links.'
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              productName={getProductName(blog)}
              saving={saving}
              onView={openViewDrawer}
              onEdit={openEditDrawer}
              onDelete={requestDelete}
            />
          ))}
        </div>
      )}

      <BlogViewDrawer
        open={viewDrawerOpen}
        onClose={closeViewDrawer}
        blog={viewingBlog}
        productName={viewingBlog ? getProductName(viewingBlog) : ""}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.title || ""}
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmMessage={`This will permanently delete "${deleteTarget?.title}". This cannot be undone. Please confirm one more time to proceed.`}
        deleting={saving}
      />

      <AdminDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        size="xl"
        title={editingBlog ? "Edit Blog" : "Write Blog"}
        description={
          editingBlog
            ? "Update your article content, cover image, and product mapping."
            : "Compose a new article with rich text, images, and an optional related product."
        }
      >
        <BlogDrawerForm
          blog={editingBlog}
          products={products}
          saving={saving}
          loading={editLoading}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
        />
      </AdminDrawer>
    </div>
  );
};

export default BlogsPanel;
