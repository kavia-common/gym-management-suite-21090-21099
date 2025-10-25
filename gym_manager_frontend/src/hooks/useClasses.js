import { useCallback, useEffect, useMemo, useState } from "react";
import { classesApi } from "../data/classesApi";

/**
 * PUBLIC_INTERFACE
 * useClasses loads classes with pagination and exposes CRUD.
 */
export function useClasses({ pageSize = 10, initialPage = 1, filters = {}, orderBy = "start_time", ascending = true } = {}) {
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
      const { data, error: err, count: total } = await classesApi.list({
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
      setError(e?.message || "Failed to load classes.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, offset, filters, orderBy, ascending]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const create = useCallback(async (payload) => {
    const { data, error: err } = await classesApi.create(payload);
    if (err) throw err;
    await fetchPage();
    return data;
  }, [fetchPage]);

  const update = useCallback(async (id, patch) => {
    const { data, error: err } = await classesApi.update(id, patch);
    if (err) throw err;
    await fetchPage();
    return data;
  }, [fetchPage]);

  const remove = useCallback(async (id) => {
    const { error: err } = await classesApi.remove(id);
    if (err) throw err;
    await fetchPage();
    return true;
  }, [fetchPage]);

  return { data: items, loading, error, page, pageSize, total: count, setPage, refresh: fetchPage, create, update, remove };
}
