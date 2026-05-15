import { Search, Filter } from "lucide-react";

export type OrderStatusFilter = "all" | "paid" | "shipped" | "delivered";

interface OrdersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatusFilter;
  onStatusChange: (status: OrderStatusFilter) => void;
  totalResults: number;
}

const STATUS_OPTIONS: { value: OrderStatusFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "paid", label: "Payée" },
  { value: "shipped", label: "En cours" },
  { value: "delivered", label: "Livrée" },
];

export const OrdersFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalResults,
}: OrdersFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <label className="input input-bordered flex items-center gap-2 flex-1 min-w-0">
        <Search className="w-4 h-4 opacity-50 shrink-0" />
        <input
          type="text"
          placeholder="Rechercher par client, email, ID…"
          className="grow"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      {/* Status filter */}
      <div className="flex items-center gap-2 shrink-0">
        <Filter className="w-4 h-4 opacity-50" />
        <div className="join">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`join-item btn btn-sm ${
                statusFilter === opt.value ? "btn-primary" : "btn-ghost border border-base-300"
              }`}
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <span className="text-sm opacity-50 shrink-0">
        {totalResults} résultat{totalResults !== 1 ? "s" : ""}
      </span>
    </div>
  );
};
