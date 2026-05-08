export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "paid":      return "badge-success";
    case "shipped":   return "badge-info";
    case "delivered": return "badge-success";
    case "pending":   return "badge-warning";
    default:          return "badge-error";
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "paid":      return "Payée";
    case "shipped":   return "Expédiée";
    case "delivered": return "Livrée";
    case "pending":   return "En attente";
    case "cancelled": return "Annulée";
    default:          return status;
  }
};

export const formatPaymentInfo = (order: import("~/types/order").Order): string => {
  if (!order.payments || order.payments.length === 0) return "Non payé";

  const payment = order.payments[0];
  const provider = payment.provider.charAt(0).toUpperCase() + payment.provider.slice(1);

  if (payment.provider === "card" && payment.payment_details.card_brand) {
    return `${provider} ${payment.payment_details.card_brand} ****${payment.payment_details.last_4 || "****"}`;
  }
  if (payment.provider === "paypal" && payment.payment_details.email) {
    return `${provider} ${payment.payment_details.email}`;
  }
  return provider;
};
