import { useOutletContext, useFetcher } from "react-router";
import type { Order } from "~/types/order";
import type { Profile } from "~/types/profile";
import { 
  Bell, 
  User, 
  PackageSearch, 
  Check, 
  X, 
  Inbox, 
  Hash,
  ShoppingBag
} from "lucide-react";

interface PendingOrdersViewProps {
  orders: Order[];
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Aujourd'hui à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  } else if (isYesterday) {
    return `Hier à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
};

export const PendingOrdersView = ({ orders }: PendingOrdersViewProps) => {
  const { user } = useOutletContext<{ user: Profile }>();
  const fetcher = useFetcher();

  if (user?.role === "buyer") {
    return (
      <div className="alert alert-warning shadow-sm border-none">
        <X className="w-5 h-5" />
        <span>Seuls les vendeurs peuvent gérer les commandes.</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Demandes de vente
          </h1>
          <p className="text-base-content/60 mt-1">Validez ou refusez les demandes d'achat reçues.</p>
        </div>
        {orders?.length > 0 && (
          <div className="badge badge-primary badge-lg gap-2 py-4 px-6 font-bold shadow-lg shadow-primary/20">
            {orders.length} nouvelle{orders.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Grid des Commandes */}
      <div className="grid gap-6">
        {orders && orders.length > 0 ? (
          orders.map((order) => {
            const isRefusing = fetcher.formData?.get("status") === "cancelled" && fetcher.formData?.get("orderId") === order.id;
            const isConfirming = fetcher.formData?.get("status") === "paid" && fetcher.formData?.get("orderId") === order.id;
            const isLoading = fetcher.state !== "idle" && fetcher.formData?.get("orderId") === order.id;

            return (
              <div key={order.id} className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                <div className="card-body p-0">
                  {/* Header de la carte */}
                  <div className="bg-warning/5 p-6 flex flex-col md:flex-row justify-between gap-6 border-b border-warning/10">
                    <div className="flex gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-warning text-warning-content rounded-full w-12 h-12 shadow-md">
                          <User className="w-6 h-6" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge badge-warning badge-sm font-bold uppercase tracking-tighter">Attente</span>
                          <span className="text-xs font-mono opacity-40 flex items-center gap-1">
                            <Hash className="w-3 h-3" /> {order.id.slice(0, 8)}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg leading-tight">
                          {(order as any).buyer?.full_name || "Client inconnu"}
                        </h3>
                        <p className="text-sm opacity-60">{(order as any).buyer?.email}</p>
                      </div>
                    </div>
                    
                    <div className="md:text-right flex flex-col justify-center">
                      <span className="text-3xl font-black text-warning leading-none">{order.total_amount} €</span>
                      <p className="text-xs opacity-50 mt-2 font-medium uppercase tracking-widest">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  {/* Liste des produits */}
                  <div className="p-6">
                    <h4 className="text-xs font-bold text-base-content/40 uppercase mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> Articles de la commande
                    </h4>
                    <div className="space-y-2">
                      {order.order_items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-base-200/50 p-3 rounded-xl border border-base-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-base-100 flex items-center justify-center text-xs font-bold">
                              {item.quantity}x
                            </div>
                            <span className="font-semibold text-sm">{item.product?.title || "Produit supprimé"}</span>
                          </div>
                          <span className="font-mono text-sm font-bold">{item.unit_price * item.quantity} €</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-6 pt-0 flex gap-3 justify-end">
                    <fetcher.Form method="post">
                      <input type="hidden" name="orderId" value={order.id} />
                      <button 
                        name="status" 
                        value="cancelled"
                        type="submit"
                        className="btn btn-ghost hover:bg-error/10 hover:text-error btn-md"
                        disabled={isLoading}
                      >
                        {isRefusing ? <span className="loading loading-spinner loading-xs"></span> : <X className="w-4 h-4" />}
                        Refuser
                      </button>
                    </fetcher.Form>

                    <fetcher.Form method="post">
                      <input type="hidden" name="orderId" value={order.id} />
                      <button 
                        name="status" 
                        value="paid"
                        type="submit"
                        className="btn btn-success px-8 shadow-lg shadow-success/20"
                        disabled={isLoading}
                      >
                        {isConfirming ? <span className="loading loading-spinner loading-xs"></span> : <Check className="w-4 h-4" />}
                        {isConfirming ? "Confirmation..." : "Confirmer la vente"}
                      </button>
                    </fetcher.Form>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-300">
            <div className="bg-base-100 p-6 rounded-full shadow-xl mb-6">
              <Inbox className="w-12 h-12 text-base-content/20" />
            </div>
            <h3 className="text-xl font-bold">Tout est à jour !</h3>
            <p className="opacity-50 mt-1 max-w-xs text-center">
              Vous n'avez aucune demande d'achat en attente pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
