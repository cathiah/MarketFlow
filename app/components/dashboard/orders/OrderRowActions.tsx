import { useFetcher } from "react-router";
import type { Order } from "~/types/order";

interface OrderRowActionsProps {
  order: Order;
  fetcher: ReturnType<typeof useFetcher>;
}

export const OrderRowActions = ({ order, fetcher }: OrderRowActionsProps) => {
  const isShipping =
    fetcher.formData?.get("status") === "shipped" &&
    fetcher.formData?.get("orderId") === order.id;
  const isDelivering =
    fetcher.formData?.get("status") === "delivered" &&
    fetcher.formData?.get("orderId") === order.id;
  const isLoading =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("orderId") === order.id;

  if (order.status === "delivered") {
    return <span className="text-xs opacity-50">Aucune action</span>;
  }

  return (
    <div className="space-x-2">
      <fetcher.Form method="post" className="inline-block">
        <input type="hidden" name="orderId" value={order.id} />
        <button
          name="status"
          value="delivered"
          type="submit"
          className="btn btn-sm btn-success"
          disabled={isLoading}
        >
          {isDelivering ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            "Livrée"
          )}
        </button>
      </fetcher.Form>

      {order.status !== "shipped" && (
        <fetcher.Form method="post" className="inline-block">
          <input type="hidden" name="orderId" value={order.id} />
          <button
            name="status"
            value="shipped"
            type="submit"
            className="btn btn-sm btn-warning"
            disabled={isLoading}
          >
            {isShipping ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "En cours"
            )}
          </button>
        </fetcher.Form>
      )}
    </div>
  );
};
