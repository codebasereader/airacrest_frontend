import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { ApiError } from "../../../api/client";
import { adminPrimaryButtonClass } from "../../constants/formStyles";
import AdminAlert from "../shared/AdminAlert";
import AdminDrawer from "../shared/AdminDrawer";
import AdminEmptyState from "../shared/AdminEmptyState";
import AdminSpinner from "../shared/AdminSpinner";
import CatalogItemCard from "../shared/CatalogItemCard";
import CatalogItemViewDrawer from "../shared/CatalogItemViewDrawer";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import DeleteConflictModal from "../shared/DeleteConflictModal";
import CategoryDrawerForm from "./CategoryDrawerForm";

const CategoryTabPane = ({
  categories,
  loading,
  saving,
  error,
  onDismissError,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConflict, setDeleteConflict] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreateDrawer = () => {
    setEditingCategory(null);
    setSuccessMessage(null);
    onDismissError?.();
    setDrawerOpen(true);
  };

  const openEditDrawer = (category) => {
    setEditingCategory(category);
    setSuccessMessage(null);
    onDismissError?.();
    setDrawerOpen(true);
  };

  const openViewDrawer = (category) => {
    setViewingCategory(category);
    setViewDrawerOpen(true);
  };

  const closeViewDrawer = () => {
    setViewDrawerOpen(false);
    setViewingCategory(null);
  };

  const closeDrawer = () => {
    if (saving) return;
    setDrawerOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (formData) => {
    if (editingCategory) {
      await onUpdate(editingCategory._id, formData);
      setSuccessMessage(`"${formData.name}" updated successfully.`);
    } else {
      const created = await onCreate(formData);
      setSuccessMessage(`"${created.name}" created successfully.`);
    }
    setDrawerOpen(false);
    setEditingCategory(null);
  };

  const requestDelete = (category) => {
    setDeleteTarget(category);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setSuccessMessage(null);
    setDeleteConflict(null);
    onDismissError?.();

    try {
      await onDelete(deleteTarget._id);
      setSuccessMessage(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setDeleteConflict({
          title: deleteTarget.name,
          message: err.message,
          conflict: err.data,
        });
        setDeleteTarget(null);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-[0.06em] text-maroon-900">
            All Categories
          </h2>
          <p className="mt-1 font-sans text-xs text-maroon-600">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}{" "}
            in your catalogue
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateDrawer}
          className={`${adminPrimaryButtonClass} gap-2`}
        >
          <HugeiconsIcon
            icon={Add01Icon}
            size={16}
            color="currentColor"
            strokeWidth={1.75}
          />
          Add Category
        </button>
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
        <AdminSpinner label="Loading categories..." />
      ) : categories.length === 0 ? (
        <AdminEmptyState
          title="No categories yet"
          description='Click "Add Category" to create your first catalogue group.'
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CatalogItemCard
              key={category._id}
              item={category}
              saving={saving}
              onView={openViewDrawer}
              onEdit={openEditDrawer}
              onDelete={requestDelete}
            />
          ))}
        </div>
      )}

      <AdminDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingCategory ? "Edit Category" : "Add Category"}
        description={
          editingCategory
            ? "Update category details and storefront visibility."
            : "Create a new top-level group for your export products."
        }
      >
        <CategoryDrawerForm
          category={editingCategory}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
        />
      </AdminDrawer>

      <CatalogItemViewDrawer
        open={viewDrawerOpen}
        onClose={closeViewDrawer}
        item={viewingCategory}
        type="category"
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name || ""}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This is only allowed when no subcategories or products are linked.`}
        confirmMessage={`This will permanently delete "${deleteTarget?.name}". Linked subcategories or products must be removed first. Please confirm one more time to proceed.`}
        deleting={saving}
      />

      <DeleteConflictModal
        open={!!deleteConflict}
        onClose={() => setDeleteConflict(null)}
        title={deleteConflict?.title}
        message={deleteConflict?.message}
        conflict={deleteConflict?.conflict}
        type="category"
      />
    </div>
  );
};

export default CategoryTabPane;
