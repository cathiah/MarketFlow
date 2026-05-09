import { useState, useMemo, useCallback } from "react";
import type { Product } from "~/types/products";
import type { StatusFilter } from "../StatusFilterDropdown";

interface UseProductFiltersReturn {
  searchQuery: string;
  statusFilter: StatusFilter;
  filteredProducts: Product[];
  stats: { total: number; published: number; drafts: number };
  setSearchQuery: (q: string) => void;
  setStatusFilter: (f: StatusFilter) => void;
}

export function useProductFilters(products: Product[]): UseProductFiltersReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        (p.categories?.name || "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "published"
          ? p.is_published
          : !p.is_published;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: products.length,
      published: products.filter((p) => p.is_published).length,
      drafts: products.filter((p) => !p.is_published).length,
    }),
    [products]
  );

  const handleSetSearchQuery = useCallback((q: string) => setSearchQuery(q), []);
  const handleSetStatusFilter = useCallback((f: StatusFilter) => setStatusFilter(f), []);

  return {
    searchQuery,
    statusFilter,
    filteredProducts,
    stats,
    setSearchQuery: handleSetSearchQuery,
    setStatusFilter: handleSetStatusFilter,
  };
}
