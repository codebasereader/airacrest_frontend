import { useCallback, useEffect, useState } from "react";
import * as productsApi from "../api/productsApi";
import { ApiError } from "../api/client";
import { normalizeLoadMoreResponse } from "../api/loadMore";
import { isMongoObjectId, sortProductsByOrder } from "../utils/productUtils";

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

export const usePublicProduct = (slugOrId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedViaId, setResolvedViaId] = useState(false);

  useEffect(() => {
    if (!slugOrId) {
      setProduct(null);
      setLoading(false);
      setResolvedViaId(false);
      return undefined;
    }

    let cancelled = false;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      setResolvedViaId(false);

      try {
        let data;
        let viaId = false;

        if (isMongoObjectId(slugOrId)) {
          data = await productsApi.getPublicProduct(slugOrId);
          viaId = true;
        } else {
          data = await productsApi.getPublicProductBySlug(slugOrId);
        }

        if (!cancelled) {
          setProduct(data ?? null);
          setResolvedViaId(viaId);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Failed to load product. Please try again.",
          );
          setProduct(null);
          setResolvedViaId(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slugOrId]);

  return { product, loading, error, resolvedViaId };
};
