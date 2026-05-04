import { createClient } from "~/lib/supabase.server";
import { useOutletContext, useLoaderData, useFetcher } from "react-router";
import { data } from "react-router";
import type { Route } from "./+types/notifications";
import type { UserRole } from "~/types/profile";
import type { Order } from "~/types/order";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Response("Non autorisé", { status: 401, headers });

    const { data: sellerProducts } = await supabase
      .from("products")
      .select("id")
      .eq("seller_id", user.id);

    const productIds = sellerProducts?.map(p => p.id) ?? [];

    if (productIds.length === 0) {
      return data({ orders: [] }, { headers });
    }

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("order_id")
      .in("product_id", productIds);

    const orderIds = [...new Set(orderItems?.map(i => i.order_id) ?? [])];

    if (orderIds.length === 0) {
      return data({ orders: [] }, { headers });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        total_amount,
        status,
        created_at,
        buyer:buyer_id ( full_name, email ),
        order_items (
          id,
          quantity,
          unit_price,
          product:product_id ( title, price )
        )
      `)
      .in("id", orderIds)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw new Response(error.message, { status: 500, headers });

    return data({ orders: (orders as unknown as Order[]) || [] }, { headers });
  } catch (e) {
    if (e instanceof Response) throw e;
    throw new Response("Service temporairement indisponible", { status: 503, headers });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createClient(request);
  
  try {
    const formData = await request.formData();
    const orderId = formData.get("orderId");
    const newStatus = formData.get("status");

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) return data({ success: false, error: error.message }, { headers });
    return data({ success: true }, { headers });
  } catch (e) {
    if (e instanceof Response) throw e;
    throw new Response("Service temporairement indisponible", { status: 503, headers });
  }
}

export default function NotificationsPage() {
  const { orders } = useLoaderData<typeof loader>();
  const { role } = useOutletContext<{ role: UserRole }>();
  const fetcher = useFetcher();

  if (role === "buyer") {
    return (
      <div className="alert alert-warning">
        <span>Seuls les vendeurs peuvent gérer les commandes.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Notifications d'achat</h1>
          <p className="text-base-content/70">Gérez les demandes de commandes entrantes.</p>
        </div>
        <div className="badge badge-secondary p-4">{orders?.length || 0} en attente</div>
      </div>

      <div className="grid gap-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="card bg-base-100 shadow-xl border border-base-content/10">
              <div className="card-body p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono opacity-50">#{order.id.slice(0, 8)}</span>
                      <div className="badge badge-outline badge-info italic">En attente</div>
                    </div>
                    <h3 className="font-bold text-lg">
                      {order.buyer?.full_name || "Client inconnu"} 
                      <span className="text-sm font-normal opacity-70 ml-2">({order.buyer?.email})</span>
                    </h3>
                    <div className="text-sm">
                      {order.order_items.map((item: any, i: number) => (
                        <div key={i} className="text-base-content/80">
                          • {item.quantity}x {item.product.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between min-w-37.5">
                    <span className="text-2xl font-black text-secondary">
                      {order.total_amount} €
                    </span>
                    
                    <div className="flex gap-2 mt-4">
                      <fetcher.Form method="post">
                        <input type="hidden" name="orderId" value={order.id} />
                        <button 
                          name="status" 
                          value="cancelled" 
                          className="btn btn-error btn-sm lg:btn-md"
                          disabled={fetcher.state !== "idle"}
                        >
                          Refuser
                        </button>
                      </fetcher.Form>

                      <fetcher.Form method="post">
                        <input type="hidden" name="orderId" value={order.id} />
                        <button 
                          name="status" 
                          value="paid" 
                          className="btn btn-success btn-sm lg:btn-md"
                          disabled={fetcher.state !== "idle"}
                        >
                          Accepter
                        </button>
                      </fetcher.Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="hero bg-base-200 rounded-box p-10">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <p className="py-6 opacity-60">Aucune nouvelle notification pour le moment.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
