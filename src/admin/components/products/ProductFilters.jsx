import React from "react";
import { adminFieldClass, adminLabelClass } from "../../constants/formStyles";

const ProductFilters = ({
  categories,
  subcategories,
  categoryId,
  subcategoryId,
  search,
  onCategoryChange,
  onSubcategoryChange,
  onSearchChange,
}) => {
  const filteredSubcategories = categoryId
    ? subcategories.filter(
        (item) => (item.category?._id || item.category) === categoryId,
      )
    : subcategories;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="product-search" className={adminLabelClass}>
          Search
        </label>
        <input
          id="product-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by product name..."
          className={adminFieldClass}
        />
      </div>

      <div>
        <label htmlFor="product-category-filter" className={adminLabelClass}>
          Category
        </label>
        <select
          id="product-category-filter"
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
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

      <div>
        <label htmlFor="product-subcategory-filter" className={adminLabelClass}>
          Subcategory
        </label>
        <select
          id="product-subcategory-filter"
          value={subcategoryId}
          onChange={(event) => onSubcategoryChange(event.target.value)}
          disabled={!categoryId && filteredSubcategories.length === 0}
          className={adminFieldClass}
        >
          <option value="">All subcategories</option>
          {filteredSubcategories.map((subcategory) => (
            <option key={subcategory._id} value={subcategory._id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
