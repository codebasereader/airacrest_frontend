import React, { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { ApiError } from "../../../api/client";
import { adminPrimaryButtonClass, adminFieldClass } from "../../constants/formStyles";
import AdminAlert from "../shared/AdminAlert";
import AdminDrawer from "../shared/AdminDrawer";
import AdminEmptyState from "../shared/AdminEmptyState";
import AdminSpinner from "../shared/AdminSpinner";
import CatalogItemCard from "../shared/CatalogItemCard";
import CatalogItemViewDrawer from "../shared/CatalogItemViewDrawer";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import DeleteConflictModal from "../shared/DeleteConflictModal";
import SubcategoryDrawerForm from "./SubcategoryDrawerForm";

const getCategoryId = (subcategory) =>
  subcategory?.category?._id || subcategory?.category || "";

const SubcategoryTabPane = ({
  categories,
  subcategories,
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
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [viewingSubcategory, setViewingSubcategory] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [defaultCategoryId, setDefaultCategoryId] = useState("");
  const [deleteConflict, setDeleteConflict] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categoryNameById = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [category._id, category.name]),
      ),
    [categories],
  );

  const filteredSubcategories = useMemo(() => {
    if (!filterCategoryId) return subcategories;
    return subcategories.filter(
      (item) => getCategoryId(item) === filterCategoryId,
    );
  }, [subcategories, filterCategoryId]);

  const openCreateDrawer = () => {
    setEditingSubcategory(null);
    setDefaultCategoryId(filterCategoryId);
    setSuccessMessage(null);
    onDismissError?.();
    setDrawerOpen(true);
  };

  const openEditDrawer = (subcategory) => {
    setEditingSubcategory(subcategory);
    setSuccessMessage(null);
    onDismissError?.();
    setDrawerOpen(true);
  };

  const openViewDrawer = (subcategory) => {
    setViewingSubcategory(subcategory);
    setViewDrawerOpen(true);
  };

  const closeViewDrawer = () => {
    setViewDrawerOpen(false);
    setViewingSubcategory(null);
  };

  const closeDrawer = () => {
    if (saving) return;
    setDrawerOpen(false);
    setEditingSubcategory(null);
  };

  const handleSubmit = async (formData) => {
    if (editingSubcategory) {
      await onUpdate(editingSubcategory._id, formData);
      setSuccessMessage(`"${formData.name}" updated successfully.`);
    } else {
      const created = await onCreate(formData);
      setSuccessMessage(`"${created.name}" created successfully.`);
    }
    setDrawerOpen(false);
    setEditingSubcategory(null);
  };

  const requestDelete = (subcategory) => {
    setDeleteTarget(subcategory);
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-[0.06em] text-maroon-900">
            All Subcategories
          </h2>
          <p className="mt-1 font-sans text-xs text-maroon-600">
            {filteredSubcategories.length} subcategor
            {filteredSubcategories.length === 1 ? "y" : "ies"}
            {filterCategoryId ? " in selected category" : " across catalogue"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-[200px]">
            <label
              htmlFor="subcategory-filter"
              className="mb-1.5 block font-sans text-[10px] font-semibold tracking-[0.12em] text-maroon-700 uppercase"
            >
              Filter by category
            </label>
            <select
              id="subcategory-filter"
              value={filterCategoryId}
              onChange={(event) => setFilterCategoryId(event.target.value)}
              className={adminFieldClass}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={openCreateDrawer}
            disabled={categories.length === 0}
            className={`${adminPrimaryButtonClass} gap-2 sm:mt-5`}
          >
            <HugeiconsIcon
              icon={Add01Icon}
              size={16}
              color="currentColor"
              strokeWidth={1.75}
            />
            Add Subcategory
          </button>
        </div>
      </div>

      {categories.length === 0 && (
        <AdminAlert message="Create a category first, then you can add subcategories under it." />
      )}

      {error && <AdminAlert message={error} onDismiss={onDismissError} />}
      {successMessage && (
        <AdminAlert
          variant="success"
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      {loading ? (
        <AdminSpinner label="Loading subcategories..." />
      ) : filteredSubcategories.length === 0 ? (
        <AdminEmptyState
          title={
            filterCategoryId
              ? "No subcategories in this category"
              : "No subcategories yet"
          }
          description={
            categories.length === 0
              ? "Add a category on the Categories tab first."
              : 'Click "Add Subcategory" to create one under a parent category.'
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSubcategories.map((subcategory) => (
            <CatalogItemCard
              key={subcategory._id}
              item={subcategory}
              subtitle={
                categoryNameById[getCategoryId(subcategory)] || "Unknown category"
              }
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
        title={editingSubcategory ? "Edit Subcategory" : "Add Subcategory"}
        description={
          editingSubcategory
            ? "Update subcategory details and parent category."
            : "Create a sub-group under an existing category."
        }
      >
        <SubcategoryDrawerForm
          subcategory={editingSubcategory}
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          saving={saving}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
        />
      </AdminDrawer>

      <CatalogItemViewDrawer
        open={viewDrawerOpen}
        onClose={closeViewDrawer}
        item={viewingSubcategory}
        type="subcategory"
        parentCategoryName={
          viewingSubcategory
            ? categoryNameById[getCategoryId(viewingSubcategory)]
            : ""
        }
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name || ""}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This is only allowed when no products are linked.`}
        confirmMessage={`This will permanently delete "${deleteTarget?.name}". Linked products must be removed first. Please confirm one more time to proceed.`}
        deleting={saving}
      />

      <DeleteConflictModal
        open={!!deleteConflict}
        onClose={() => setDeleteConflict(null)}
        title={deleteConflict?.title}
        message={deleteConflict?.message}
        conflict={deleteConflict?.conflict}
        type="subcategory"
      />
    </div>
  );
};

export default SubcategoryTabPane;
