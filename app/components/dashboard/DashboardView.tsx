import type { DashboardStats } from "~/routes/dashboard/dashboard.server";
import type { Order } from "~/types/order";
import { CatalogueSection } from "./CatalogueSection";
import { LogisticsSection } from "./LogisticsSection";
import { OrdersTabs } from "./OrdersTabs";
import { PerformanceSection } from "./PerformanceSection";

interface DashboardViewProps {
  orders: Order[];
  stats: DashboardStats;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ orders, stats }) => (
  <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10">
    <PerformanceSection stats={stats} />
    <LogisticsSection stats={stats} />
    <CatalogueSection stats={stats} />
    <OrdersTabs orders={orders} />
  </div>
);
