import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import { restoreStock } from "./stock.server";

export async function performDeleteOrder(request: Request, orderId: string) {
  const { supabase, headers } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Response("Non autorisé", { status: 401, headers });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      id,
      buyer_id,
      status,
      order_items (product_id, quantity)
    `
    )
    .eq("id", orderId)
    .single();

  if (orderError || !order)
    throw new Response("Commande non trouvée", { status: 404, headers });

  if (order.buyer_id !== user.id)
    throw new Response("Non autorisé", { status: 403, headers });

  if (order.status === "paid" || order.status === "shipped") {
    await restoreStock(supabase, order.order_items);

    const { error: deletePaymentError } = await supabase
      .from("payments")
      .delete()
      .eq("order_id", orderId);

    if (deletePaymentError) {
      console.error(
        "Erreur suppression paiement lors de la suppression de commande :",
        deletePaymentError
      );
    }
  }

  const { error: deleteError } = await supabase
    .from("orders")
    .delete()
    .eq("id", orderId);

  if (deleteError)
    throw new Response("Erreur lors de la suppression de la commande", {
      status: 500,
      headers,
    });

  return data({ success: true }, { headers });
}
