import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
}

export const OrdersPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}: OrdersPaginationProps) => {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  // Build page numbers to show: always first, last, current ± 1, with ellipsis
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-sm opacity-50">
        {from}–{to} sur {totalItems} commande{totalItems !== 1 ? "s" : ""}
      </span>

      <div className="join">
        <button
          className="join-item btn btn-sm btn-ghost"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <button key={`ellipsis-${i}`} className="join-item btn btn-sm btn-disabled btn-ghost">
              …
            </button>
          ) : (
            <button
              key={p}
              className={`join-item btn btn-sm ${currentPage === p ? "btn-primary" : "btn-ghost"}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className="join-item btn btn-sm btn-ghost"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
