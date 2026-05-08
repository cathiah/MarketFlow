import { AlertCircle, Layers, Package, Zap } from "lucide-react";
import type { DashboardStats } from "~/routes/dashboard/dashboard.server";

interface CatalogueSectionProps {
  stats: DashboardStats;
}

export const CatalogueSection = ({ stats }: CatalogueSectionProps) => (
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
