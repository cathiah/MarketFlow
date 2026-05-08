import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import type { Order } from "~/types/order";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  pendingCount: number;
  paidCount: number;
  shippedCount: number;
  deliveredCount: number;
  totalOrders: number;
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  lowStockProducts: number;
}

export interface DashboardLoaderData {
  orders: Order[];
  stats: DashboardStats;
}

export async function performGetDashboardData(request: Request) {
  const { supabase, headers } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Response("Non autorisé", { status: 401, headers });

  const { data: sellerProducts } = await supabase
    .from("products")
    .select("id, stock_quantity, is_published")
    .eq("seller_id", user.id);

  const productIds = sellerProducts?.map((p) => p.id) ?? [];

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("id, order_id, product_id, quantity, unit_price, product:product_id (id, title, price)")
    .in("product_id", productIds.length > 0 ? productIds : [""]);

  const orderIds = [
    ...new Set((orderItems ?? []).map((i: any) => i.order_id).filter(Boolean)),
  ] as string[];

  const { data: rawOrders } =
    orderIds.length > 0
      ? await supabase
          .from("orders")
          .select("id, total_amount, status, created_at, shipping_address, buyer_id (id, full_name, email), payments (id, provider, payment_details, external_id, status, created_at)")
          .in("id", orderIds)
      : { data: [] as any[] };

  const orderMap = new Map<string, Order>();

  (rawOrders ?? []).forEach((order: any) => {
    orderMap.set(order.id, {
      id: order.id,
      buyer_id: order.buyer_id?.id ?? "",
      total_amount: order.total_amount ?? 0,
      status: order.status,
      shipping_address: order.shipping_address ?? null,
      created_at: order.created_at,
      buyer: order.buyer_id
        ? {
            full_name: order.buyer_id.full_name ?? "",
            email: order.buyer_id.email ?? "",
          }
        : { full_name: "", email: "" },
      order_items: [],
      payments: order.payments || [],
    } as Order);
  });

  (orderItems ?? []).forEach((item: any) => {
    if (!item.order_id || !orderMap.has(item.order_id)) return;
    orderMap.get(item.order_id)!.order_items.push({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity ?? 0,
      unit_price: item.unit_price ?? 0,
      product: {
        title: (item.product as any)?.title ?? "",
        price: (item.product as any)?.price ?? 0,
      },
    });
  });

  const uniqueOrders: Order[] = Array.from(orderMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const toAmount = (v: unknown) => parseFloat(String(v ?? "0")) || 0;

  const stats: DashboardStats = {
    totalSales: uniqueOrders
      .filter((o) => ["paid", "shipped", "delivered"].includes(o.status))
      .reduce((acc, o) => acc + toAmount(o.total_amount), 0),
    totalRevenue: uniqueOrders.filter((o) => o.status !== "cancelled").reduce((acc, o) => acc + toAmount(o.total_amount), 0),
    pendingCount:   uniqueOrders.filter((o) => o.status === "pending").length,
    paidCount: uniqueOrders.filter((o) => o.status === "paid").length,
    shippedCount:   uniqueOrders.filter((o) => o.status === "shipped").length,
    deliveredCount: uniqueOrders.filter((o) => o.status === "delivered").length,
    totalOrders:    uniqueOrders.length,
    totalProducts:  sellerProducts?.length ?? 0,
    activeProducts: sellerProducts?.filter((p) => p.is_published).length ?? 0,
    totalStock:     sellerProducts?.reduce((acc, p) => acc + (p.stock_quantity ?? 0), 0) ?? 0,
    lowStockProducts: sellerProducts?.filter((p) => (p.stock_quantity ?? 0) < 5).length ?? 0,
  };

  return data<DashboardLoaderData>({ orders: uniqueOrders, stats }, { headers });
}
