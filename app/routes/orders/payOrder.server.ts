import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import { decrementStock } from "./stock.server";
import type { PaymentPayload } from "./types";

export async function performPayOrder(
  request: Request,
  orderId: string,
  paymentData: PaymentPayload
) {
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
      total_amount,
      shipping_address,
      order_items (product_id, quantity)
    `
    )
    .eq("id", orderId)
    .single();

  if (orderError || !order)
    throw new Response("Commande non trouvée", { status: 404, headers });

  if (order.buyer_id !== user.id)
    throw new Response("Non autorisé", { status: 403, headers });

  if (order.status !== "pending")
    throw new Response("Commande déjà payée ou annulée", {
      status: 400,
      headers,
    });

  const { data: existingPayment } = await supabase
    .from("payments")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existingPayment)
    throw new Response("Un paiement existe déjà pour cette commande", {
      status: 400,
      headers,
    });

  const { data: profile } = await supabase
    .from("profiles")
    .select("shipping_address")
    .eq("id", user.id)
    .maybeSingle();

  const shippingAddress =
    paymentData.shipping_address || profile?.shipping_address;
  if (!shippingAddress)
    throw new Response("Adresse de livraison requise", {
      status: 400,
      headers,
    });

  await decrementStock(supabase, order.order_items);

  const { error: paymentError } = await supabase.from("payments").insert({
    order_id: orderId,
    amount: order.total_amount,
    payment_method: paymentData.payment_method,
    card_number: paymentData.card_number.replace(/\s/g, "").slice(-4),
    expiry_date: paymentData.expiry_date,
    cardholder_name: paymentData.cardholder_name,
  });

  if (paymentError)
    throw new Response("Erreur lors de l'enregistrement du paiement", {
      status: 500,
      headers,
    });

  const { error: updateOrderError } = await supabase
    .from("orders")
    .update({ status: "paid", shipping_address: shippingAddress })
    .eq("id", orderId);

  if (updateOrderError)
    throw new Response("Erreur lors de la mise à jour de la commande", {
      status: 500,
      headers,
    });

  return data({ success: true }, { headers });
}
