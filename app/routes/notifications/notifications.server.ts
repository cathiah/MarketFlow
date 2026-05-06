import { createClient } from "~/lib/supabase.server";
import type { Order, OrderStatus } from "~/types/order";
import { data } from "react-router";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  status: OrderStatus;
  orderId: string;
};

export async function performGetNotifications(request: Request) {
  const { supabase, headers } = createClient(request);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Response("Non autorisé", { status: 401, headers });

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Response(error.message, { status: 500, headers });

  const notifications: NotificationItem[] = (orders as unknown as Order[]).map((order) => {
    const orderRef = `#${order.id.slice(0, 8)}`;
    const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

    let title = "Mise à jour de commande";
    let message = "Votre commande a été mise à jour.";

    switch (order.status) {
      case "pending":
        title = "Paiement en attente";
        message = `Votre commande ${orderRef} attend le paiement. Montant total ${order.total_amount} €.`;
        break;
      case "paid":
        title = "Commande payée";
        message = `Votre commande ${orderRef} a été payée. Préparez-vous à la recevoir bientôt.`;
        break;
      case "shipped":
        title = "Commande expédiée";
        message = `Votre commande ${orderRef} a quitté l'entrepôt et est en cours de livraison.`;
        break;
      case "delivered":
        title = "Commande livrée";
        message = `Votre commande ${orderRef} a été livrée avec succès.`;
        break;
      case "cancelled":
        title = "Commande annulée";
        message = `Votre commande ${orderRef} a été annulée. Contactez le support si nécessaire.`;
        break;
      default:
        title = "Mise à jour de commande";
        message = `Votre commande ${orderRef} a été mise à jour.`;
        break;
    }

    return {
      id: order.id,
      title,
      message,
      created_at: formattedDate,
      status: order.status,
      orderId: order.id,
    };
  });

  return data({ notifications }, { headers });
}

