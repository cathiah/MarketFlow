import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import type { Order } from "~/types/order";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  pendingCount: number;
  completedCount: number;
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
    .select(`
      id, quantity, unit_price,
      order_id (
        id, total_amount, status, created_at, shipping_address,
        buyer_id (id, full_name, email)
      ),
      product_id (id, title, price)
    `)
    .in("product_id", productIds.length > 0 ? productIds : [""]);

  const orderMap = new Map<string, Order>();

  orderItems?.forEach((item: any) => {
    if (!item.order_id || !item.product_id) return;

    const orderId = item.order_id.id;

    if (!orderMap.has(orderId)) {
      orderMap.set(orderId, {
        id: item.order_id.id,
        buyer_id: item.order_id.buyer_id?.id ?? "",
        total_amount: item.order_id.total_amount ?? 0,
        status: item.order_id.status,
        shipping_address: item.order_id.shipping_address ?? null,
        created_at: item.order_id.created_at,
        buyer: item.order_id.buyer_id
          ? {
              full_name: item.order_id.buyer_id.full_name ?? "",
              email: item.order_id.buyer_id.email ?? "",
            }
          : { full_name: "", email: "" },
        order_items: [],
      } as Order);
    }

    orderMap.get(orderId)!.order_items.push({
      id: item.id,
      order_id: item.order_id.id,
      product_id: item.product_id.id,
      quantity: item.quantity ?? 0,
      unit_price: item.unit_price ?? 0,
      product: {
        title: item.product_id.title ?? "",
        price: item.product_id.price ?? 0,
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
    totalRevenue: uniqueOrders.reduce((acc, o) => acc + toAmount(o.total_amount), 0),
    pendingCount: uniqueOrders.filter((o) => o.status === "pending").length,
    completedCount: uniqueOrders.filter((o) => o.status === "paid").length,
    shippedCount: uniqueOrders.filter((o) => o.status === "shipped").length,
    deliveredCount: uniqueOrders.filter((o) => o.status === "delivered").length,
    totalOrders: uniqueOrders.length,
    totalProducts: sellerProducts?.length ?? 0,
    activeProducts: sellerProducts?.filter((p) => p.is_published).length ?? 0,
    totalStock: sellerProducts?.reduce((acc, p) => acc + (p.stock_quantity ?? 0), 0) ?? 0,
    lowStockProducts: sellerProducts?.filter((p) => (p.stock_quantity ?? 0) < 5).length ?? 0,
  };

  return data<DashboardLoaderData>({ orders: uniqueOrders, stats }, { headers });
}