import { useState } from "react";
import { 
  History, 
  TrendingUp, 
  Package, 
  CheckCircle, 
  Clock,
  ShoppingCart,
  AlertCircle,
  Zap
} from "lucide-react";
import type { DashboardStats } from "~/routes/dashboard/dashboard.server";
import type { Order } from "~/types/order";

interface DashboardViewProps {
  orders: Order[];
  stats: DashboardStats;
}

type TabType = "pending" | "history";

export const DashboardView: React.FC<DashboardViewProps> = ({ orders, stats }) => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const pendingOrders: Order[] = orders.filter(o => o.status === "pending");
  const historyOrders: Order[] = orders.filter(o => o.status !== "pending");

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'badge-success';
      case 'shipped':
        return 'badge-info';
      case 'delivered':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-error';
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* --- MAIN STATS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chiffre d'affaires */}
        <div className="stats shadow bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-figure"><TrendingUp className="w-8 h-8" /></div>
            <div className="stat-title text-primary-content/60">Chiffre d'affaires</div>
            <div className="stat-value text-lg">{formatCurrency(stats.totalSales)}</div>
            <div className="stat-desc text-primary-content/60">Ventes confirmées</div>
          </div>
        </div>

        {/* Revenu Total */}
        <div className="stats shadow bg-success text-success-content">
          <div className="stat">
            <div className="stat-figure"><Zap className="w-8 h-8" /></div>
            <div className="stat-title text-success-content/60">Revenu Total</div>
            <div className="stat-value text-lg">{formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-desc text-success-content/60">Toutes commandes</div>
          </div>
        </div>

        {/* Commandes Totales */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-info"><ShoppingCart className="w-8 h-8" /></div>
            <div className="stat-title">Commandes</div>
            <div className="stat-value text-info">{stats.totalOrders}</div>
            <div className="stat-desc">Total reçues</div>
          </div>
        </div>

        {/* Stock Total */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-warning"><Package className="w-8 h-8" /></div>
            <div className="stat-title">Stock</div>
            <div className="stat-value text-warning">{stats.totalStock}</div>
            <div className="stat-desc">Unités disponibles</div>
          </div>
        </div>
      </div>

      {/* --- SECONDARY STATS SECTION --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* En attente */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-warning"><Clock className="w-6 h-6" /></div>
            <div className="stat-title text-sm">En attente</div>
            <div className="stat-value text-warning text-2xl">{stats.pendingCount}</div>
          </div>
        </div>

        {/* Payées */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-success"><CheckCircle className="w-6 h-6" /></div>
            <div className="stat-title text-sm">Payées</div>
            <div className="stat-value text-success text-2xl">{stats.completedCount}</div>
          </div>
        </div>

        {/* Expédiées */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent"><TrendingUp className="w-6 h-6" /></div>
            <div className="stat-title text-sm">Expédiées</div>
            <div className="stat-value text-accent text-2xl">{stats.shippedCount}</div>
          </div>
        </div>

        {/* Produits Total */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-info"><Package className="w-6 h-6" /></div>
            <div className="stat-title text-sm">Produits</div>
            <div className="stat-value text-info text-2xl">{stats.totalProducts}</div>
          </div>
        </div>

        {/* Produits Actifs */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-success"><Zap className="w-6 h-6" /></div>
            <div className="stat-title text-sm">Actifs</div>
            <div className="stat-value text-success text-2xl">{stats.activeProducts}</div>
          </div>
        </div>

        {/* Stock Faible */}
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-error"><AlertCircle className="w-6 h-6" /></div>
            <div className="stat-title text-sm">Stock faible</div>
            <div className="stat-value text-error text-2xl">{stats.lowStockProducts}</div>
          </div>
        </div>
      </div>

      {/* --- TABS SECTION --- */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-4 sm:p-6">
          <div className="tabs tabs-boxed mb-4">
            <button
              onClick={() => setActiveTab("pending")}
              className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Commandes en attente ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`tab ${activeTab === "history" ? "tab-active" : ""}`}
            >
              <History className="w-4 h-4 mr-2" />
              Historique ({historyOrders.length})
            </button>
          </div>

          {/* Orders List */}
          <div className="overflow-x-auto">
            {activeTab === "pending" && pendingOrders.length > 0 ? (
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Acheteur</th>
                    <th>Produits</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>{order.buyer?.full_name || 'Inconnu'}</td>
                      <td>{order.order_items?.length || 0} article(s)</td>
                      <td>{formatCurrency(order.total_amount)}</td>
                      <td><span className="badge badge-warning">{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === "pending" ? (
              <div className="text-center py-8 text-gray-500">
                Aucune commande en attente
              </div>
            ) : null}

            {activeTab === "history" && historyOrders.length > 0 ? (
              <table className="table table-compact w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Acheteur</th>
                    <th>Produits</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {historyOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                      <td>{order.buyer?.full_name || 'Inconnu'}</td>
                      <td>{order.order_items?.length || 0} article(s)</td>
                      <td>{formatCurrency(order.total_amount)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === "history" ? (
              <div className="text-center py-8 text-gray-500">
                Aucune commande
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
