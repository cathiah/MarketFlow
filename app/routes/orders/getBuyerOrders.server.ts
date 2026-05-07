import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import type { Order } from "~/types/order";

export async function performGetBuyerOrders(request: Request) {
  const { supabase, headers } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Response("Non autorisé", { status: 401, headers });

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      buyer_id,
      total_amount,
      status,
      created_at,
      shipping_address,
      order_items (
        id,
        product_id,
        quantity,
        unit_price,
        product:product_id (title, price)
      )
    `
    )
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Response(error.message, { status: 500, headers });

  return data({ orders: (orders as unknown as Order[]) || [] }, { headers });
}
