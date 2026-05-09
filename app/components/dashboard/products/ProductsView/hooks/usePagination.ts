import { useState, useMemo, useCallback, useEffect } from "react";

interface UsePaginationOptions<T> {
  items: T[];
  pageSize?: number;
}

interface UsePaginationReturn<T> {
  page: number;
  pageSize: number;
  totalPages: number;
  paginatedItems: T[];
  setPage: (page: number) => void;
  goNext: () => void;
  goPrev: () => void;
  setPageSize: (size: number) => void;
}

export function usePagination<T>({
  items,
  pageSize: initialPageSize = 10,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [page, setPageRaw] = useState(1);
  const [pageSize, setPageSizeRaw] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPageRaw(1);
  }, [items.length, pageSize]);

  const setPage = useCallback(
    (p: number) => setPageRaw(Math.min(Math.max(1, p), totalPages)),
    [totalPages]
  );

  const goNext = useCallback(() => setPageRaw((p) => Math.min(p + 1, totalPages)), [totalPages]);
  const goPrev = useCallback(() => setPageRaw((p) => Math.max(p - 1, 1)), []);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const setPageSize = useCallback((size: number) => setPageSizeRaw(size), []);

  return { page, pageSize, totalPages, paginatedItems, setPage, goNext, goPrev, setPageSize };
}