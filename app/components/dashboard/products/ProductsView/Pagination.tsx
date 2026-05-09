import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = React.memo(function Pagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onNext,
  onPrev,
  onPageSizeChange,
}) {
  if (totalItems === 0) return null;

  const from = Math.min((page - 1) * pageSize + 1, totalItems);
  const to = Math.min(page * pageSize, totalItems);

  const pageNumbers: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (page > 3) pageNumbers.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pageNumbers.push(i);
    }
    if (page < totalPages - 2) pageNumbers.push("…");
    pageNumbers.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
      {/* Info */}
      <span className="text-xs opacity-40 order-2 sm:order-1">
        {from}–{to} sur {totalItems} produit{totalItems > 1 ? "s" : ""}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={onPrev}
          disabled={page === 1}
          className="btn btn-ghost btn-sm btn-circle disabled:opacity-20"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 opacity-30 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`btn btn-sm btn-circle ${
                p === page
                  ? "btn-primary"
                  : "btn-ghost opacity-50 hover:opacity-100"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="btn btn-ghost btn-sm btn-circle disabled:opacity-20"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Page size */}
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="select select-bordered select-sm bg-base-200/50 order-3"
      >
        {PAGE_SIZE_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s} / page
          </option>
        ))}
      </select>
    </div>
  );
});