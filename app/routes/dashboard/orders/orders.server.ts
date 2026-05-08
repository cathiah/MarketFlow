import { data } from "react-router";
import { createAdminClient, createClient } from "~/lib/supabase.server";
import type { Order } from "~/types/order";

export async function performGetNotifications(request: Request) {
  const { supabase, headers } = createClient(request);
  const supabaseAdmin = createAdminClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Response("Non autorisé", { status: 401, headers });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "seller") {
      return { orders: [], headers };
    }

    const { data: sellerProducts } = await supabase
      .from("products")
      .select("id")
      .eq("seller_id", user.id);

    const productIds = sellerProducts?.map((p) => p.id) ?? [];
    if (productIds.length === 0) return { orders: [], headers };

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("order_id")
      .in("product_id", productIds);

    const orderIds = [...new Set(orderItems?.map((i) => i.order_id) ?? [])];
    if (orderIds.length === 0) return { orders: [], headers };

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id, total_amount, status, created_at,
        buyer:buyer_id (full_name, email, username),
        order_items (
          id, quantity, unit_price,
          product:product_id (id, title, price)
        ),
        payments (
          id, provider, payment_details, external_id, status, created_at
        )
      `)
      .in("id", orderIds)
      .in("status", ["paid", "shipped", "delivered"])
      .order("created_at", { ascending: false });

    if (error) throw new Response(error.message, { status: 500, headers });

    return { orders: (orders as unknown as Order[]) || [], headers };
  } catch (e) {
    if (e instanceof Response) throw e;
    throw new Response("Erreur serveur", { status: 500, headers });
  }
}

export async function performUpdateOrderStatus(request: Request) {
  const { supabase, headers } = createClient(request);
  const supabaseAdmin = createAdminClient();

  const formData = await request.formData();
  const orderId = formData.get("orderId") as string;
  const newStatus = formData.get("status") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Response("Non autorisé", { status: 401, headers });

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) return data({ success: false, error: error.message }, { headers });

  // Si la commande est acceptée, soustraire le stock
  if (newStatus === "paid") {
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Erreur lors de la récupération des articles:", itemsError);
      return data({ success: false, error: "Erreur lors de la récupération des articles" }, { headers });
    }

    // Mettre à jour le stock pour chaque produit
    for (const item of orderItems || []) {
      const { data: product, error: productError } = await supabaseAdmin
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single();

      if (productError || !product) {
        console.error("Erreur lors de la récupération du produit:", productError);
        continue;
      }

      const newQuantity = product.stock_quantity - item.quantity;
      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({ stock_quantity: newQuantity })
        .eq("id", item.product_id);

      if (updateError) {
        console.error("Erreur lors de la mise à jour du stock:", updateError);
      }
    }
  }

  return data({ success: true }, { headers });
}
