import { useOutletContext, useFetcher } from "react-router";
import { X } from "lucide-react";
import { useState, useMemo } from "react";
import type { Order } from "~/types/order";
import type { Profile } from "~/types/profile";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersTable } from "./OrdersTable";
import { EmptyOrders } from "./EmptyOrders";
import { OrdersFilters, type OrderStatusFilter } from "./OrdersFilters";
import { OrdersPagination } from "./OrdersPagination";

interface PendingOrdersViewProps {
  orders: Order[];
}

const PAGE_SIZE = 10;

export const PendingOrdersView = ({ orders }: PendingOrdersViewProps) => {
  const { user } = useOutletContext<{ user: Profile }>();
  const fetcher = useFetcher();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on filter/search change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: OrderStatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  if (user?.role === "buyer") {
    return (
      <div className="alert alert-warning shadow-sm border-none">
        <X className="w-5 h-5" />
        <span>Seuls les vendeurs peuvent gérer les commandes.</span>
      </div>
    );
  }

  // Filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return (orders ?? []).filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.buyer?.full_name?.toLowerCase().includes(q) ||
        order.buyer?.email?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <OrdersHeader count={orders?.length ?? 0} />

      <OrdersFilters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        totalResults={filtered.length}
      />

      {filtered.length > 0 ? (
        <>
          <OrdersTable orders={paginated} fetcher={fetcher} />
          <OrdersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={PAGE_SIZE}
            totalItems={filtered.length}
          />
        </>
      ) : orders && orders.length > 0 ? (
        // Orders exist but none match filters
        <div className="flex flex-col items-center justify-center py-20 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-300">
          <p className="text-lg font-semibold">Aucun résultat</p>
          <p className="opacity-50 mt-1 text-sm">
            Essayez de modifier vos filtres ou votre recherche.
          </p>
        </div>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
};