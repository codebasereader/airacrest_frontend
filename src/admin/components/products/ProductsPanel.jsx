import React, { useCallback, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { adminPrimaryButtonClass } from "../../constants/formStyles";
import { getRelationId } from "../../utils/productForm";
import AdminAlert from "../shared/AdminAlert";
import AdminDrawer from "../shared/AdminDrawer";
import AdminEmptyState from "../shared/AdminEmptyState";
import AdminSpinner from "../shared/AdminSpinner";
import ProductCard from "./ProductCard";
import ProductDrawerForm from "./ProductDrawerForm";
import ProductFilters from "./ProductFilters";
import ProductViewDrawer from "./ProductViewDrawer";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";

const ProductsPanel = ({
  products,
  categories,
  subcategories,
  loading,
  saving,
  error,
  filterCategoryId,
  filterSubcategoryId,
  onCategoryFilterChange,
  onSubcategoryFilterChange,
  onDismissError,
  onCreate,
  onUpdate,
  onDelete,
  onCreateCategory,
  onCreateSubcategory,
  catalogSaving,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [defaultCategoryId, setDefaultCategoryId] = useState("");
  const [defaultSubcategoryId, setDefaultSubcategoryId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const categoryNameById = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [category._id, category.name]),
      ),
    [categories],
  );

  const subcategoryNameById = useMemo(
    () =>
      Object.fromEntries(
        subcategories.map((subcategory) => [
          subcategory._id,
          subcategory.name,
        ]),
      ),
    [subcategories],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      if (query) {
        const haystack = [product.name, product.description, product.slug]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [products, search]);

  const handleCategoryFilterChange = (value) => {
    onCategoryFilterChange(value);
    onSubcategoryFilterChange("");
  };

  const openCreateDrawer = () => {
    setEditingProduct(null);
    setDefaultCategoryId(filterCategoryId);
    setDefaultSubcategoryId(filterSubcategoryId);
    setSuccessMessage(null);
    onDismissError?.();
    setDrawerOpen(true);
  };

  const openEditDrawer = (product) => {
    setEditingProduct(product);
    setSuccessMessage(null);
    onDismissError?.();
    setDrawerOpen(true);
  };

  const openViewDrawer = (product) => {
    setViewingProduct(product);
    setViewDrawerOpen(true);
  };

  const closeViewDrawer = () => {
    setViewDrawerOpen(false);
    setViewingProduct(null);
  };

  const closeDrawer = useCallback(() => {
    if (saving) return;
    setDrawerOpen(false);
    setEditingProduct(null);
  }, [saving]);

  const handleSubmit = async (formData) => {
    if (editingProduct) {
      await onUpdate(editingProduct._id, formData);
      setSuccessMessage(`"${formData.name}" updated successfully.`);
    } else {
      const created = await onCreate(formData);
      setSuccessMessage(`"${created.name}" created successfully.`);
    }
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const requestDelete = (product) => {
    setDeleteTarget(product);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setSuccessMessage(null);
    onDismissError?.();

    try {
      await onDelete(deleteTarget._id);
      setSuccessMessage(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch {
      // Error handled by parent hook
    }
  };

  const getProductSubtitle = (product) => {
    const categoryName =
      product.category?.name ||
      categoryNameById[getRelationId(product.category)];
    const subcategoryName =
      product.subcategory?.name ||
      subcategoryNameById[getRelationId(product.subcategory)];

    if (categoryName && subcategoryName) {
      return `${categoryName} · ${subcategoryName}`;
    }

    return categoryName || subcategoryName || "";
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-[0.06em] text-maroon-900">
            All Products
          </h2>
          <p className="mt-1 font-sans text-xs text-maroon-600">
            {filteredProducts.length} product
            {filteredProducts.length === 1 ? "" : "s"}
            {search.trim() ? " matching search" : " in catalogue"}
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
          Add Product
        </button>
      </div>

      <ProductFilters
        categories={categories}
        subcategories={subcategories}
        categoryId={filterCategoryId}
        subcategoryId={filterSubcategoryId}
        search={search}
        onCategoryChange={handleCategoryFilterChange}
        onSubcategoryChange={onSubcategoryFilterChange}
        onSearchChange={setSearch}
      />

      {categories.length === 0 && (
        <AdminAlert message="Create categories and subcategories first before adding products." />
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
        <AdminSpinner label="Loading products..." />
      ) : filteredProducts.length === 0 ? (
        <AdminEmptyState
          title={search.trim() ? "No products match your search" : "No products yet"}
          description={
            categories.length === 0
              ? "Set up categories and subcategories on the Catalogue page first."
              : 'Click "Add Product" in the top right to create your first catalogue item.'
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              subtitle={getProductSubtitle(product)}
              saving={saving}
              onView={openViewDrawer}
              onEdit={openEditDrawer}
              onDelete={requestDelete}
            />
          ))}
        </div>
      )}

      <ProductViewDrawer
        open={viewDrawerOpen}
        onClose={closeViewDrawer}
        product={viewingProduct}
        categoryName={
          viewingProduct
            ? viewingProduct.category?.name ||
              categoryNameById[getRelationId(viewingProduct.category)]
            : ""
        }
        subcategoryName={
          viewingProduct
            ? viewingProduct.subcategory?.name ||
              subcategoryNameById[getRelationId(viewingProduct.subcategory)]
            : ""
        }
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name || ""}
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmMessage={`This will permanently delete "${deleteTarget?.name}". This cannot be undone. Please confirm one more time to proceed.`}
        deleting={saving}
      />

      <AdminDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        size="lg"
        title={editingProduct ? "Edit Product" : "Add Product"}
        description={
          editingProduct
            ? "Update product details, images, and export specifications."
            : "Add a new export product with category, images, and specifications."
        }
      >
        <ProductDrawerForm
          product={editingProduct}
          categories={categories}
          subcategories={subcategories}
          defaultCategoryId={defaultCategoryId}
          defaultSubcategoryId={defaultSubcategoryId}
          saving={saving}
          catalogSaving={catalogSaving}
          onCreateCategory={onCreateCategory}
          onCreateSubcategory={onCreateSubcategory}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
        />
      </AdminDrawer>
    </div>
  );
};

export default ProductsPanel;
