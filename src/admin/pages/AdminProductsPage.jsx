import React, { useState } from "react";
import ProductsPanel from "../components/products/ProductsPanel";
import AdminPageHeader from "../components/shared/AdminPageHeader";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { useSubcategories } from "../hooks/useSubcategories";

const AdminProductsPage = () => {
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterSubcategoryId, setFilterSubcategoryId] = useState("");

  const { categories, saving: categoriesSaving, createCategory } = useCategories();
  const {
    subcategories,
    saving: subcategoriesSaving,
    createSubcategory,
  } = useSubcategories();

  const {
    products,
    loading,
    saving,
    error,
    setError,
    createProduct,
    updateProduct,
    removeProduct,
  } = useProducts({
    category: filterCategoryId,
    subcategory: filterSubcategoryId,
  });

  return (
    <section>
      <AdminPageHeader
        title="Products"
        description="Add, edit, and organise catalogue products with images, specifications, and export details. Filter by category or subcategory, then manage items from the grid below."
      />

      <div className="rounded-2xl border border-maroon-200/50 bg-white p-5 shadow-sm sm:p-6">
        <ProductsPanel
          products={products}
          categories={categories}
          subcategories={subcategories}
          loading={loading}
          saving={saving}
          error={error}
          filterCategoryId={filterCategoryId}
          filterSubcategoryId={filterSubcategoryId}
          onCategoryFilterChange={setFilterCategoryId}
          onSubcategoryFilterChange={setFilterSubcategoryId}
          onDismissError={() => setError(null)}
          onCreate={createProduct}
          onUpdate={updateProduct}
          onDelete={removeProduct}
          onCreateCategory={createCategory}
          onCreateSubcategory={createSubcategory}
          catalogSaving={categoriesSaving || subcategoriesSaving}
        />
      </div>
    </section>
  );
};

export default AdminProductsPage;
