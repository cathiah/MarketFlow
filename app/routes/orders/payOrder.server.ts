import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import { decrementStock } from "./stock.server";
import type { Profile } from "~/types/profile";
import type { PaymentDetails, PaymentProvider } from "~/types/payment";

export type PaymentPayload = {
  provider: PaymentProvider;
  payment_details: PaymentDetails;
  external_id?: string; // transaction ID from provider
  shipping_address?: string;
};

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
    .maybeSingle<Pick<Profile, "shipping_address">>();

  const shippingAddress = paymentData.shipping_address || profile?.shipping_address;
  if (!shippingAddress)
    throw new Response("Adresse de livraison requise", {
      status: 400,
      headers,
    });

  await decrementStock(supabase, order.order_items);

  const { error: paymentError } = await supabase.from("payments").insert({
    order_id: orderId,
    amount: order.total_amount,
    provider: paymentData.provider,
    payment_details: paymentData.payment_details,
    external_id: paymentData.external_id,
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
