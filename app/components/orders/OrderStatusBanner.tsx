import { CheckCircle2, XCircle, Clock, Package } from "lucide-react";

interface OrderStatusBannerProps {
  status: string;
  shippingAddress?: string | null;
}

export const OrderStatusBanner = ({
  status,
  shippingAddress,
}: OrderStatusBannerProps) => {
  if (status === "paid") {
    return (
      <div className="alert alert-success mb-4">
        <Package className="w-5 h-5" />
        <div>
          <p className="text-sm font-semibold">Commande payée</p>
          <p className="text-xs">Statut : en cours de traitement</p>
          {shippingAddress && (
            <p className="text-xs">Livraison : {shippingAddress}</p>
          )}
        </div>
      </div>
    );
  }

  if (status === "shipped") {
    return (
      <div className="alert alert-info mb-4">
        <Package className="w-5 h-5" />
        <div>
          <p className="text-sm font-semibold">Commande expédiée</p>
          <p className="text-xs">Votre colis est en cours de livraison</p>
          {shippingAddress && (
            <p className="text-xs">Adresse : {shippingAddress}</p>
          )}
        </div>
      </div>
    );
  }

  if (status === "delivered") {
    return (
      <div className="alert alert-success mb-4">
        <CheckCircle2 className="w-5 h-5" />
        <div>
          <p className="text-sm font-semibold">Commande livrée</p>
          <p className="text-xs">Votre commande a été livrée avec succès</p>
          {shippingAddress && (
            <p className="text-xs">Adresse : {shippingAddress}</p>
          )}
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="alert alert-warning mb-4">
        <Clock className="w-5 h-5" />
        <div>
          <p className="text-sm font-semibold">Paiement requis</p>
          <p className="text-xs">
            Procédez au paiement pour valider votre commande.
          </p>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="alert alert-error mb-4">
        <XCircle className="w-5 h-5" />
        <div>
          <p className="text-sm font-semibold">
            Commande refusée ou annulée
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="alert alert-warning mb-4">
      <Clock className="w-5 h-5" />
      <p className="text-sm font-semibold">Statut : {status}</p>
    </div>
  );
};
