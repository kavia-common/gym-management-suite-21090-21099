import { useCallback, useEffect, useMemo, useState } from "react";
import { trainersApi } from "../data/trainersApi";

/**
 * PUBLIC_INTERFACE
 * useTrainers loads trainers with pagination and exposes CRUD.
 */
export function useTrainers({ pageSize = 10, initialPage = 1, filters = {}, orderBy = "name", ascending = true } = {}) {
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
      const { data, error: err, count: total } = await trainersApi.list({
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
      setError(e?.message || "Failed to load trainers.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, offset, filters, orderBy, ascending]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const create = useCallback(async (payload) => {
    const { data, error: err } = await trainersApi.create(payload);
    if (err) throw err;
    await fetchPage();
    return data;
  }, [fetchPage]);

  const update = useCallback(async (id, patch) => {
    const { data, error: err } = await trainersApi.update(id, patch);
    if (err) throw err;
    await fetchPage();
    return data;
  }, [fetchPage]);

  const remove = useCallback(async (id) => {
    const { error: err } = await trainersApi.remove(id);
    if (err) throw err;
    await fetchPage();
    return true;
  }, [fetchPage]);

  return { data: items, loading, error, page, pageSize, total: count, setPage, refresh: fetchPage, create, update, remove };
}
