import { useFetcher } from "react-router";
import type { Order } from "~/types/order";
import { OrderTableRow } from "./OrderTableRow";

interface OrdersTableProps {
  orders: Order[];
  fetcher: ReturnType<typeof useFetcher>;
}

export const OrdersTable = ({ orders, fetcher }: OrdersTableProps) => {
  return (
    <div className="overflow-x-auto rounded-3xl border border-base-200 bg-base-100 shadow-sm">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Commande</th>
            <th>Client</th>
            <th>Montant</th>
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
  );
};
