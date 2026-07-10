import { useCallback, useEffect, useState } from "react";
import * as productsApi from "../../api/productsApi";
import { ApiError } from "../../api/client";
import { normalizeLoadMoreResponse } from "../../api/loadMore";

const sortByOrder = (items) =>
  [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

export const useProducts = (filters = {}) => {
  const { category = "", subcategory = "" } = filters;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const apiFilters = {};
      if (category) apiFilters.category = category;
      if (subcategory) apiFilters.subcategory = subcategory;

      const data = await productsApi.listAdminProducts(apiFilters);
      const { items } = normalizeLoadMoreResponse(data);
      setProducts(Array.isArray(items) ? sortByOrder(items) : []);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load products. Please try again.",
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }, [category, subcategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (formData) => {
    setSaving(true);
    setError(null);

    try {
      const created = await productsApi.createProduct(formData);
      await fetchProducts({ silent: true });
      return created;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to create product. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async (id, formData) => {
    setSaving(true);
    setError(null);

    try {
      const updated = await productsApi.updateProduct(id, formData);
      await fetchProducts({ silent: true });
      return updated;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to update product. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id) => {
    setSaving(true);
    setError(null);

    try {
      await productsApi.deleteProduct(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to delete product. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    products,
    loading,
    saving,
    error,
    setError,
    fetchProducts,
    createProduct,
    updateProduct,
    removeProduct,
  };
};
