import { useState } from "react";
import {
  History,
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
  ShoppingCart,
  AlertCircle,
  Zap,
  Truck,
  BarChart3,
  Layers,
} from "lucide-react";
import type { DashboardStats } from "~/routes/dashboard/dashboard.server";
import type { Order } from "~/types/order";

interface DashboardViewProps {
  orders: Order[];
  stats: DashboardStats;
}

type TabType = "pending" | "history";

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "paid":      return "badge-success";
    case "shipped":   return "badge-info";
    case "delivered": return "badge-success";
    case "pending":   return "badge-warning";
    default:          return "badge-error";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "paid":      return "Payée";
    case "shipped":   return "Expédiée";
    case "delivered": return "Livrée";
    case "pending":   return "En attente";
    case "cancelled": return "Annulée";
    default:          return status;
  }
};

const PerformanceSection = ({ stats }: { stats: DashboardStats }) => (
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
          <div className="stat-desc text-success-content/60">Toutes commandes</div>
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

const LogisticsSection = ({ stats }: { stats: DashboardStats }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Truck className="w-5 h-5 text-secondary" />
      <h2 className="text-sm font-black uppercase tracking-widest opacity-50">Logistique</h2>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-warning"><Clock className="w-6 h-6" /></div>
          <div className="stat-title text-sm">En attente</div>
          <div className="stat-value text-warning text-2xl">{stats.pendingCount}</div>
          <div className="stat-desc">Paiement requis</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-success"><CheckCircle className="w-6 h-6" /></div>
          <div className="stat-title text-sm">Payées</div>
          <div className="stat-value text-success text-2xl">{stats.completedCount}</div>
          <div className="stat-desc">À expédier</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-info"><Truck className="w-6 h-6" /></div>
          <div className="stat-title text-sm">Expédiées</div>
          <div className="stat-value text-info text-2xl">{stats.shippedCount}</div>
          <div className="stat-desc">En transit</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-accent"><CheckCircle className="w-6 h-6" /></div>
          <div className="stat-title text-sm">Livrées</div>
          <div className="stat-value text-accent text-2xl">{stats.deliveredCount}</div>
          <div className="stat-desc">Finalisées</div>
        </div>
      </div>
    </div>
  </div>
);

const CatalogueSection = ({ stats }: { stats: DashboardStats }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Layers className="w-5 h-5 text-accent" />
      <h2 className="text-sm font-black uppercase tracking-widest opacity-50">Catalogue</h2>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-info"><Package className="w-6 h-6" /></div>
          <div className="stat-title text-sm">Produits</div>
          <div className="stat-value text-info text-2xl">{stats.totalProducts}</div>
          <div className="stat-desc">Total catalogue</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-success"><Zap className="w-6 h-6" /></div>
          <div className="stat-title text-sm">Actifs</div>
          <div className="stat-value text-success text-2xl">{stats.activeProducts}</div>
          <div className="stat-desc">Publiés</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-warning"><Package className="w-6 h-6" /></div>
          <div className="stat-title text-sm">Stock total</div>
          <div className="stat-value text-warning text-2xl">{stats.totalStock}</div>
          <div className="stat-desc">Unités disponibles</div>
        </div>
      </div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-error"><AlertCircle className="w-6 h-6" /></div>
          <div className="stat-title text-sm">Stock faible</div>
          <div className="stat-value text-error text-2xl">{stats.lowStockProducts}</div>
          <div className="stat-desc">{'< 5 unités'}</div>
        </div>
      </div>
    </div>
  </div>
);

const OrdersTable = ({ orders }: { orders: Order[] }) => (
  <div className="overflow-x-auto">
    {orders.length > 0 ? (
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Acheteur</th>
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
    ) : (
      <div className="text-center py-10 opacity-40">Aucune commande</div>
    )}
  </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ orders, stats }) => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const historyOrders = orders.filter((o) => o.status !== "pending");

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10">
      <PerformanceSection stats={stats} />
      <LogisticsSection stats={stats} />
      <CatalogueSection stats={stats} />

      {/* Commandes */}
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
    </div>
  );
};