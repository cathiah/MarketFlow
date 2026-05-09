import { TrendingUp, ShoppingCart, Zap, BarChart3 } from "lucide-react";
import type { DashboardStats } from "~/routes/dashboard/dashboard.server";
import { formatCurrency } from "./utils/formatters";

interface PerformanceSectionProps {
  stats: DashboardStats;
}

export const PerformanceSection = ({ stats }: PerformanceSectionProps) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <BarChart3 className="w-5 h-5 text-primary" />
      <h2 className="text-sm font-black uppercase tracking-widest opacity-50">Performance</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="stats shadow bg-primary text-primary-content">
        <div className="stat">
          <div className="stat-figure"><TrendingUp className="w-8 h-8" /></div>
          <div className="stat-title text-primary-content/60">Chiffre d'affaires</div>
          <div className="stat-value text-lg">{formatCurrency(stats.totalSales)}</div>
          <div className="stat-desc text-primary-content/60">Payées + expédiées + livrées</div>
        </div>
      </div>
      <div className="stats shadow bg-success text-success-content">
        <div className="stat">
          <div className="stat-figure"><Zap className="w-8 h-8" /></div>
          <div className="stat-title text-success-content/60">Revenu total</div>
          <div className="stat-value text-lg">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-desc text-success-content/60">Hors annulées</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-info"><ShoppingCart className="w-8 h-8" /></div>
          <div className="stat-title">Commandes totales</div>
          <div className="stat-value text-info">{stats.totalOrders}</div>
          <div className="stat-desc">Toutes réceptions confondues</div>
        </div>
      </div>
    </div>
  </div>
);
