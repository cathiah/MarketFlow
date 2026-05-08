import type { Order } from "~/types/order";
import { useNavigation } from "react-router";
import { useEffect, useState } from "react";
import { OrderCard } from "./OrderCard";
import { EmptyOrderList } from "./EmptyOrderList";
import { DeleteOrderModal } from "./DeleteOrderModal";
import { PayOrderModal } from "./PayOrderModal";

interface ActionData {
  error?: string;
}

export const CartManagerView = ({
  orders,
  actionData,
}: {
  orders: Order[];
  actionData?: ActionData;
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const openDeleteModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const openPayModal = (order: Order) => {
    setSelectedOrder(order);
    setIsPayModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isSubmitting) return;
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
  };

  const closePayModal = () => {
    if (isSubmitting) return;
    setIsPayModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (!actionData?.error && navigation.state === "idle") {
      setIsDeleteModalOpen(false);
      setIsPayModalOpen(false);
      setSelectedOrder(null);
    }
  }, [orders, actionData, navigation.state]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Mon panier et mes commandes
      </h1>

      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onDelete={openDeleteModal}
            onPay={openPayModal}
          />
        ))
      ) : (
        <EmptyOrderList />
      )}

      {isDeleteModalOpen && selectedOrder && (
        <DeleteOrderModal
          order={selectedOrder}
          isSubmitting={isSubmitting}
          error={actionData?.error}
          onClose={closeDeleteModal}
        />
      )}

      {isPayModalOpen && selectedOrder && (
        <PayOrderModal
          order={selectedOrder}
          isSubmitting={isSubmitting}
          error={actionData?.error}
          onClose={closePayModal}
        />
      )}
    </div>
  );
};
