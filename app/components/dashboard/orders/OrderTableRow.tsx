import { useFetcher } from "react-router";
import type { Order } from "~/types/order";
import { formatDate } from "./utils/formatDate";
import { OrderRowActions } from "./OrderRowActions";

interface OrderTableRowProps {
  order: Order;
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

export const OrderTableRow = ({ order, fetcher }: OrderTableRowProps) => {
  const isDelivered = order.status === "delivered";
  const isInProgress = order.status === "shipped";

  return (
    <tr className="hover">
      <td>
        <div className="font-semibold">#{order.id.slice(0, 8)}</div>
        <div className="text-xs opacity-50">{formatDate(order.created_at)}</div>
      </td>
      <td>
        <div className="font-semibold">
          {order.buyer?.full_name || "Client inconnu"}
        </div>
        <div className="text-xs opacity-50">{order.buyer?.email}</div>
      </td>
      <td className="font-bold">{order.total_amount} €</td>
      <td className="text-sm">
        {formatPaymentInfo(order)}
      </td>
      <td>
        {isDelivered ? (
          <span className="badge badge-success badge-sm">Oui</span>
        ) : (
          <span className="badge badge-ghost badge-sm">Non</span>
        )}
      </td>
      <td>
        {isInProgress ? (
          <span className="badge badge-warning badge-sm">Oui</span>
        ) : (
          <span className="badge badge-ghost badge-sm">Non</span>
        )}
      </td>
      <td className="text-right">
        <OrderRowActions order={order} fetcher={fetcher} />
      </td>
    </tr>
  );
};
