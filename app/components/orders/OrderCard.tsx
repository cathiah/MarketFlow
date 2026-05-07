import { Trash2, CreditCard } from "lucide-react";
import type { Order } from "~/types/order";
import { getStatusConfig } from "~/utils/orderStatusConfig";
import { OrderItemsList } from "./OrderItemsList";
import { OrderStatusBanner } from "./OrderStatusBanner";

interface OrderCardProps {
  order: Order;
  onDelete: (order: Order) => void;
  onPay: (order: Order) => void;
}

export const OrderCard = ({ order, onDelete, onPay }: OrderCardProps) => {
  const config = getStatusConfig(order.status);
  const isPending = order.status === "pending";

  return (
    <div className="collapse collapse-arrow bg-base-100 shadow-sm border border-base-200">
      <input type="checkbox" />

      {/* Header */}
      <div className="collapse-title flex items-center justify-between pr-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-base-200 rounded-full">{config.icon}</div>
          <div>
            <p className="font-medium text-sm sm:text-base">
              Commande{" "}
              <span className="font-mono text-xs text-secondary">
                #{order.id.slice(0, 8)}
              </span>
            </p>
            <p className="text-xs opacity-50">
              {new Date(order.created_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className={`badge ${config.class} badge-sm font-medium`}>
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="collapse-content">
        <div className="pt-4 border-t border-base-200">
          <OrderItemsList
            items={order.order_items}
            totalAmount={order.total_amount}
          />

          <div className="mt-4 pt-4 border-t border-base-200">
            <OrderStatusBanner
              status={order.status}
              shippingAddress={order.shipping_address}
            />

            <div className="flex justify-end gap-2">
              {isPending && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary gap-2"
                  onClick={() => onPay(order)}
                >
                  <CreditCard className="w-4 h-4" />
                  Payer maintenant
                </button>
              )}
              <button
                type="button"
                className="btn btn-sm btn-outline btn-error gap-2"
                onClick={() => onDelete(order)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
