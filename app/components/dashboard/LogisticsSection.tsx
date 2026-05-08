import { CheckCircle, Clock, Truck } from "lucide-react";
import type { DashboardStats } from "~/routes/dashboard/dashboard.server";

interface LogisticsSectionProps {
  stats: DashboardStats;
}

export const LogisticsSection = ({ stats }: LogisticsSectionProps) => (
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
          <div className="stat-value text-success text-2xl">{stats.paidCount}</div>
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
