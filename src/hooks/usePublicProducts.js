import { useCallback, useEffect, useState } from "react";
import * as productsApi from "../api/productsApi";
import { ApiError } from "../api/client";
import { normalizeLoadMoreResponse } from "../api/loadMore";
import { sortProductsByOrder } from "../utils/productUtils";

export const usePublicProducts = (filters = {}) => {
  const { category, subcategory, featured, search } = filters;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiFilters = {};
      if (category) apiFilters.category = category;
      if (subcategory) apiFilters.subcategory = subcategory;
      if (featured) apiFilters.featured = true;
      if (search) apiFilters.search = search;

      const data = await productsApi.listPublicProducts(apiFilters);
      const { items } = normalizeLoadMoreResponse(data);
      setProducts(sortProductsByOrder(items));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to load products. Please try again.",
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, subcategory, featured, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

export const usePublicProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await productsApi.getPublicProduct(id);
        if (!cancelled) setProduct(data ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Failed to load product. Please try again.",
          );
          setProduct(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
};
