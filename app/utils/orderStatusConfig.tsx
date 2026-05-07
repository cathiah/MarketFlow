import { CheckCircle2, XCircle, Clock, Package } from "lucide-react";

export const getStatusConfig = (status: string) => {
  switch (status) {
    case "paid":
      return {
        label: "Payée - En cours de traitement",
        class: "badge-success",
        icon: <CheckCircle2 className="w-5 h-5 text-success" />,
      };
    case "shipped":
      return {
        label: "En cours de livraison",
        class: "badge-info",
        icon: <Package className="w-5 h-5 text-info" />,
      };
    case "delivered":
      return {
        label: "Livrée",
        class: "badge-success",
        icon: <CheckCircle2 className="w-5 h-5 text-success" />,
      };
    case "cancelled":
      return {
        label: "Refusée",
        class: "badge-error",
        icon: <XCircle className="w-5 h-5 text-error" />,
      };
    case "pending":
      return {
        label: "Paiement en attente",
        class: "badge-warning",
        icon: <Clock className="w-5 h-5 text-warning" />,
      };
    default:
      return {
        label: status,
        class: "badge-ghost",
        icon: <Package className="w-5 h-5 opacity-70" />,
      };
  }
};
