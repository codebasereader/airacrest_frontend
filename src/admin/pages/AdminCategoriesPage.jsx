import React, { useState } from "react";
import CategoryTabPane from "../components/categories/CategoryTabPane";
import SubcategoryTabPane from "../components/subcategories/SubcategoryTabPane";
import AdminPageHeader from "../components/shared/AdminPageHeader";
import AdminTabs from "../components/shared/AdminTabs";
import { useCategories } from "../hooks/useCategories";
import { useSubcategories } from "../hooks/useSubcategories";

const CATALOGUE_TABS = [
  { id: "categories", label: "Categories" },
  { id: "subcategories", label: "Subcategories" },
];

const AdminCategoriesPage = () => {
  const [activeTab, setActiveTab] = useState("categories");

  const {
    categories,
    loading: categoriesLoading,
    saving: categoriesSaving,
    error: categoriesError,
    setError: setCategoriesError,
    createCategory,
    updateCategory,
    removeCategory,
  } = useCategories();

  const {
    subcategories,
    loading: subcategoriesLoading,
    saving: subcategoriesSaving,
    error: subcategoriesError,
    setError: setSubcategoriesError,
    createSubcategory,
    updateSubcategory,
    removeSubcategory,
  } = useSubcategories();

  return (
    <section>
      <AdminPageHeader
        title="Catalogue"
        description="Manage product categories and subcategories for the Aira Crest export catalogue. Create top-level groups, then add subcategories before assigning products."
      />

      <div className="rounded-2xl border border-maroon-200/50 bg-white p-5 shadow-sm sm:p-6">
        <AdminTabs
          tabs={CATALOGUE_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6" role="tabpanel">
          {activeTab === "categories" ? (
            <CategoryTabPane
              categories={categories}
              loading={categoriesLoading}
              saving={categoriesSaving}
              error={categoriesError}
              onDismissError={() => setCategoriesError(null)}
              onCreate={createCategory}
              onUpdate={updateCategory}
              onDelete={removeCategory}
            />
          ) : (
            <SubcategoryTabPane
              categories={categories}
              subcategories={subcategories}
              loading={subcategoriesLoading}
              saving={subcategoriesSaving}
              error={subcategoriesError}
              onDismissError={() => setSubcategoriesError(null)}
              onCreate={createSubcategory}
              onUpdate={updateSubcategory}
              onDelete={removeSubcategory}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminCategoriesPage;
