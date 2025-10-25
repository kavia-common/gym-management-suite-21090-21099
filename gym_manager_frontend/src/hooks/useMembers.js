import { useCallback, useEffect, useMemo, useState } from "react";
import { membershipsApi } from "../data/membershipsApi";

/**
 * PUBLIC_INTERFACE
 * useMembers loads memberships list with simple pagination and exposes CRUD helpers.
 */
export function useMembers({ pageSize = 10, initialPage = 1, filters = {}, orderBy = "created_at", ascending = false } = {}) {
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err, count: total } = await membershipsApi.list({
        limit: pageSize,
        offset,
        filters,
        orderBy,
        ascending,
      });
      if (err) throw err;
      setItems(data);
      setCount(total);
    } catch (e) {
      setError(e?.message || "Failed to load members.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, offset, filters, orderBy, ascending]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // CRUD wrappers
  const create = useCallback(async (payload) => {
    const { data, error: err } = await membershipsApi.create(payload);
    if (err) throw err;
    await fetchPage();
    return data;
  }, [fetchPage]);

  const update = useCallback(async (id, patch) => {
    const { data, error: err } = await membershipsApi.update(id, patch);
    if (err) throw err;
    await fetchPage();
    return data;
  }, [fetchPage]);

  const remove = useCallback(async (id) => {
    const { error: err } = await membershipsApi.remove(id);
    if (err) throw err;
    await fetchPage();
    return true;
  }, [fetchPage]);

  return {
    data: items,
    loading,
    error,
    page,
    pageSize,
    total: count,
    setPage,
    refresh: fetchPage,
    create,
    update,
    remove,
  };
}
