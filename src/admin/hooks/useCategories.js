import { useCallback, useEffect, useState } from "react";
import * as categoriesApi from "../../api/categoriesApi";
import { ApiError } from "../../api/client";

export const EMPTY_CATEGORY_FORM = {
  name: "",
  description: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await categoriesApi.listAdminCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load categories. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (formData) => {
    setSaving(true);
    setError(null);

    try {
      const created = await categoriesApi.createCategory(formData);
      setCategories((prev) =>
        [...prev, created].sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
        ),
      );
      return created;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to create category. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = async (id, formData) => {
    setSaving(true);
    setError(null);

    try {
      const updated = await categoriesApi.updateCategory(id, formData);
      setCategories((prev) =>
        prev
          .map((item) => (item._id === id ? updated : item))
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      );
      return updated;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to update category. Please try again.";
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (id) => {
    setSaving(true);
    setError(null);

    try {
      await categoriesApi.deleteCategory(id);
      setCategories((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to delete category. Please try again.";
      if (!(err instanceof ApiError && err.status === 409)) {
        setError(message);
      }
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    categories,
    loading,
    saving,
    error,
    setError,
    fetchCategories,
    createCategory,
    updateCategory,
    removeCategory,
  };
};
