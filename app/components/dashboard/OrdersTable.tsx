import type { Order } from "~/types/order";
import {
  formatCurrency,
  formatPaymentInfo,
  getStatusBadgeClass,
  getStatusLabel,
} from "~/utils/formatters";

interface OrdersTableProps {
  orders: Order[];
}

export const OrdersTable = ({ orders }: OrdersTableProps) => {
  if (orders.length === 0) {
    return <div className="text-center py-10 opacity-40">Aucune commande</div>;
  }

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {orders.map((order) => (
          <div key={order.id} className="bg-base-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-50">
                {new Date(order.created_at).toLocaleDateString("fr-FR")}
              </span>
              <span className={`badge badge-sm ${getStatusBadgeClass(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <p className="font-semibold">{order.buyer?.full_name || "Inconnu"}</p>
            <div className="text-sm opacity-75">
              Paiement: {formatPaymentInfo(order)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-60">
                {order.order_items?.length ?? 0} article(s)
              </span>
              <span className="font-bold text-primary">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Acheteur</th>
              <th>Paiement</th>
              <th>Articles</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover">
                <td className="text-xs">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td>{order.buyer?.full_name || "Inconnu"}</td>
                <td className="text-sm">{formatPaymentInfo(order)}</td>
                <td>{order.order_items?.length ?? 0} article(s)</td>
                <td className="font-semibold">{formatCurrency(order.total_amount)}</td>
                <td>
                  <span className={`badge badge-sm ${getStatusBadgeClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
