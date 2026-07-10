/**
 * Normalizes list API responses that use the load-more envelope
 * `{ items, loadMore }` or a plain array (legacy).
 */
export const normalizeLoadMoreResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      items: data,
      loadMore: {
        limit: data.length,
        skip: 0,
        loaded: data.length,
        total: data.length,
        hasMore: false,
        nextSkip: null,
      },
    };
  }

  if (data && Array.isArray(data.items)) {
    return {
      items: data.items,
      loadMore: data.loadMore ?? {
        hasMore: false,
        nextSkip: null,
        loaded: data.items.length,
        total: data.items.length,
      },
    };
  }

  return {
    items: [],
    loadMore: {
      hasMore: false,
      nextSkip: null,
      loaded: 0,
      total: 0,
    },
  };
};

export const DEFAULT_LIST_LIMIT = 12;
