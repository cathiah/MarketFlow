import { useFetcher } from "react-router";
import type { Order } from "~/types/order";
import { OrderTableRow } from "./OrderTableRow";
import { OrderRowActions } from "./OrderRowActions";
import { formatDate } from "./utils/formatDate";

interface OrdersTableProps {
  orders: Order[];
  fetcher: ReturnType<typeof useFetcher>;
}

const formatPaymentInfo = (order: Order): string => {
  if (!order.payments || order.payments.length === 0) {
    return "Non payé";
  }

  const payment = order.payments[0]; // Prendre le premier paiement
  const provider = payment.provider.charAt(0).toUpperCase() + payment.provider.slice(1);

  if (payment.provider === "card" && payment.payment_details.card_brand) {
    return `${provider} ${payment.payment_details.card_brand} ****${payment.payment_details.last_4 || "****"}`;
  }

  if (payment.provider === "paypal" && payment.payment_details.email) {
    return `${provider} ${payment.payment_details.email}`;
  }

  return provider;
};

export const OrdersTable = ({ orders, fetcher }: OrdersTableProps) => {
  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        {orders.map((order) => {
          const isDelivered = order.status === "delivered";
          const isInProgress = order.status === "shipped";

          return (
            <div key={order.id} className="bg-base-200 rounded-2xl p-4 space-y-3 border border-base-300">
              {/* Header : ID + badge statut */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-sm">
                    #{order.id.slice(0, 8)}
                  </span>
                  <p className="text-xs opacity-50">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex gap-1">
                  {isDelivered && (
                    <span className="badge badge-success badge-sm">Livrée</span>
                  )}
                  {isInProgress && (
                    <span className="badge badge-warning badge-sm">En cours</span>
                  )}
                  {!isDelivered && !isInProgress && (
                    <span className="badge badge-ghost badge-sm">En attente</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">
                    {order.buyer?.full_name || "Client inconnu"}
                  </p>
                  <p className="text-xs opacity-50">{order.buyer?.email}</p>
                </div>
                <span className="font-bold text-primary">{order.total_amount} €</span>
              </div>

              {/* Informations de paiement */}
              <div className="text-sm">
                <span className="font-medium">Paiement: </span>
                <span className="opacity-75">{formatPaymentInfo(order)}</span>
              </div>

              {/* Actions */}
              <div className="pt-1 border-t border-base-300 flex justify-end">
                <OrderRowActions order={order} fetcher={fetcher} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block overflow-x-auto rounded-3xl border border-base-200 bg-base-100 shadow-sm">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Client</th>
              <th>Montant</th>
              <th>Paiement</th>
              <th>Livrée</th>
              <th>En cours</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderTableRow key={order.id} order={order} fetcher={fetcher} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};