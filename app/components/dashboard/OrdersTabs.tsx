import { useState } from "react";
import { Clock, History } from "lucide-react";
import type { Order } from "~/types/order";
import { OrdersTable } from "./OrdersTable";

type TabType = "pending" | "history";

interface OrdersTabsProps {
  orders: Order[];
}

export const OrdersTabs = ({ orders }: OrdersTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const historyOrders = orders.filter((o) => o.status !== "pending");

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4 sm:p-6">
        <div className="tabs tabs-boxed mb-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
          >
            <Clock className="w-4 h-4 mr-2" />
            En attente ({pendingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`tab ${activeTab === "history" ? "tab-active" : ""}`}
          >
            <History className="w-4 h-4 mr-2" />
            Historique ({historyOrders.length})
          </button>
        </div>

        <OrdersTable
          orders={activeTab === "pending" ? pendingOrders : historyOrders}
        />
      </div>
    </div>
  );
};
