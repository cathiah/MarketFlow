import { useOutletContext, useFetcher } from "react-router";
import { X } from "lucide-react";
import type { Order } from "~/types/order";
import type { Profile } from "~/types/profile";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersTable } from "./OrdersTable";
import { EmptyOrders } from "./EmptyOrders";

interface PendingOrdersViewProps {
  orders: Order[];
}

export const PendingOrdersView = ({ orders }: PendingOrdersViewProps) => {
  const { user } = useOutletContext<{ user: Profile }>();
  const fetcher = useFetcher();

  if (user?.role === "buyer") {
    return (
      <div className="alert alert-warning shadow-sm border-none">
        <X className="w-5 h-5" />
        <span>Seuls les vendeurs peuvent gérer les commandes.</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <OrdersHeader count={orders?.length ?? 0} />

      {orders && orders.length > 0 ? (
        <OrdersTable orders={orders} fetcher={fetcher} />
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
};
