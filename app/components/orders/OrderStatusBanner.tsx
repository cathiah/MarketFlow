import { CheckCircle2, XCircle, Clock, Package, Truck } from "lucide-react";

interface OrderStatusBannerProps {
  status: string;
  shippingAddress?: string | null;
}

export const OrderStatusBanner = ({ status, shippingAddress }: OrderStatusBannerProps) => {
  if (status === "paid") {
    return (
      <div className="alert bg-success/20 border border-success/30 text-success-content mb-4">
        <Package className="w-5 h-5 text-success shrink-0" />
        <div>
          <p className="text-sm font-semibold text-success">Commande payée</p>
          <p className="text-xs opacity-70">Statut : en cours de traitement</p>
          {shippingAddress && (
            <p className="text-xs opacity-70">Livraison : {shippingAddress}</p>
          )}
        </div>
      </div>
    );
  }

  if (status === "shipped") {
    return (
      <div className="alert bg-info/20 border border-info/30 mb-4">
        <Truck className="w-5 h-5 text-info shrink-0" />
        <div>
          <p className="text-sm font-semibold text-info">Commande expédiée</p>
          <p className="text-xs opacity-70">Votre colis est en cours de livraison</p>
          {shippingAddress && (
            <p className="text-xs opacity-70">Adresse : {shippingAddress}</p>
          )}
        </div>
      </div>
    );
  }

  if (status === "delivered") {
    return (
      <div className="alert bg-primary/20 border border-primary/30 mb-4">
        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary">Commande livrée</p>
          <p className="text-xs opacity-70">Votre commande a été livrée avec succès</p>
          {shippingAddress && (
            <p className="text-xs opacity-70">Adresse : {shippingAddress}</p>
          )}
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="alert bg-warning/20 border border-warning/30 mb-4">
        <Clock className="w-5 h-5 text-warning shrink-0" />
        <div>
          <p className="text-sm font-semibold text-warning">Paiement requis</p>
          <p className="text-xs opacity-70">
            Procédez au paiement pour valider votre commande.
          </p>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="alert bg-error/20 border border-error/30 mb-4">
        <XCircle className="w-5 h-5 text-error shrink-0" />
        <div>
          <p className="text-sm font-semibold text-error">Commande refusée ou annulée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alert bg-base-200 border border-base-300 mb-4">
      <Clock className="w-5 h-5 opacity-50 shrink-0" />
      <p className="text-sm font-semibold">Statut : {status}</p>
    </div>
  );
};