import { data } from "react-router";
import { createClient } from "~/lib/supabase.server";
import type { Order } from "~/types/order";
import type { NotificationItem } from "~/types/notifications";
import { fmtDate, fmtPrice } from "./notifications.helpers";

// ─────────────────────────────────────────────────────────────
// LOADER
// ─────────────────────────────────────────────────────────────

export async function performGetNotifications(request: Request) {
  const { supabase, headers } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Response("Non autorisé", { status: 401, headers });

  // ── 1. Clés déjà lues ──────────────────────────────────────
  const { data: reads } = await supabase
    .from("notification_reads")
    .select("notification_key")
    .eq("user_id", user.id);

  const readSet = new Set((reads ?? []).map((r) => r.notification_key));

  const notifications: NotificationItem[] = [];

  // ── 2. Mes commandes (acheteur) ─────────────────────────────
  const { data: buyerOrders, error: buyerErr } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (buyerErr) throw new Response(buyerErr.message, { status: 500, headers });

  for (const order of (buyerOrders ?? []) as unknown as Order[]) {
    const ref = `#${order.id.slice(0, 8)}`;
    const key = `order:${order.id}`;

    let title = "Mise à jour de commande";
    let message = `Votre commande ${ref} a été mise à jour.`;

    switch (order.status) {
      case "pending":
        title = "Paiement en attente";
        message = `Votre commande ${ref} attend le paiement · ${fmtPrice(order.total_amount)}.`;
        break;
      case "paid":
        title = "Commande confirmée";
        message = `Votre commande ${ref} a été payée. Vous la recevrez bientôt.`;
        break;
      case "shipped":
        title = "Commande expédiée";
        message = `Votre commande ${ref} a quitté l'entrepôt et est en cours de livraison.`;
        break;
      case "delivered":
        title = "Commande livrée";
        message = `Votre commande ${ref} a été livrée avec succès. Bonne réception !`;
        break;
      case "cancelled":
        title = "Commande annulée";
        message = `Votre commande ${ref} a été annulée. Contactez le support si nécessaire.`;
        break;
    }

    notifications.push({
      key,
      kind: "order_buyer",
      title,
      message,
      created_at: fmtDate(order.created_at),
      _ts: new Date(order.created_at).getTime(),
      isRead: readSet.has(key),
      destination: "/orders",
      orderStatus: order.status,
    });
  }

  // ── 3. Mes produits (pour les notifs vendeur) ────────────────
  const { data: myProducts } = await supabase
    .from("products")
    .select("id, title, slug")
    .eq("seller_id", user.id);

  const myProductIds = (myProducts ?? []).map((p) => p.id);
  const productMap = new Map(
    (myProducts ?? []).map((p) => [p.id, { title: p.title as string, slug: p.slug as string }])
  );

  if (myProductIds.length > 0) {
    // ── 3a. Commandes reçues sur mes produits ──────────────────
    const { data: soldItems } = await supabase
      .from("order_items")
      .select(
        "order_id, product_id, quantity, unit_price, orders(id, created_at, status, total_amount)"
      )
      .in("product_id", myProductIds)
      .order("order_id", { ascending: false });

    // Dédupliquer : une commande peut contenir plusieurs de mes produits
    const seenOrders = new Set<string>();
    for (const item of soldItems ?? []) {
      const order = item.orders as unknown as Order;
      if (!order || seenOrders.has(order.id)) continue;
      seenOrders.add(order.id);

      const product = productMap.get(item.product_id);
      const ref = `#${order.id.slice(0, 8)}`;
      const key = `order_seller:${order.id}`;

      notifications.push({
        key,
        kind: "order_seller",
        title: "Nouvelle commande reçue 🛒",
        message: `La commande ${ref} inclut "${product?.title ?? "votre produit"}" · ${fmtPrice(order.total_amount)}.`,
        created_at: fmtDate(order.created_at),
        _ts: new Date(order.created_at).getTime(),
        isRead: readSet.has(key),
        destination: `/dashboard/orders`,
        orderStatus: order.status,
      });
    }

    // ── 3b. Avis reçus sur mes produits ───────────────────────
    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, product_id, profiles(username)")
      .in("product_id", myProductIds)
      .neq("user_id", user.id)
      .order("created_at", { ascending: false });

    for (const review of reviews ?? []) {
      const product = productMap.get(review.product_id);
      const key = `review:${review.id}`;

      const rawProfiles = review.profiles as
        | { username: string | null }
        | { username: string | null }[]
        | null;
      const username =
        (Array.isArray(rawProfiles) ? rawProfiles[0] : rawProfiles)?.username ??
        "Un utilisateur";

      const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

      notifications.push({
        key,
        kind: "review",
        title: `Nouvel avis ${stars}`,
        message: review.comment
          ? `${username} a commenté "${product?.title ?? "votre produit"}" : "${review.comment.slice(0, 80)}${review.comment.length > 80 ? "…" : ""}"`
          : `${username} a noté "${product?.title ?? "votre produit"}" ${review.rating}/5.`,
        created_at: fmtDate(review.created_at),
        _ts: new Date(review.created_at).getTime(),
        isRead: readSet.has(key),
        destination: product?.slug
          ? `/dashboard/products/${product.slug}`
          : `/dashboard/products`,
      });
    }

    // ── 3c. Likes reçus sur mes produits ──────────────────────
    const { data: likes } = await supabase
      .from("product_likes")
      .select("id, product_id, user_id, created_at, profiles(username)")
      .in("product_id", myProductIds)
      .neq("user_id", user.id)
      .order("created_at", { ascending: false });

    for (const like of likes ?? []) {
      const product = productMap.get(like.product_id);
      const key = `like:${like.id}`;

      const rawProfiles = like.profiles as
        | { username: string | null }
        | { username: string | null }[]
        | null;
      const username =
        (Array.isArray(rawProfiles) ? rawProfiles[0] : rawProfiles)?.username ??
        "Un utilisateur";

      notifications.push({
        key,
        kind: "like",
        title: "Nouveau like ❤️",
        message: `${username} a aimé "${product?.title ?? "votre produit"}".`,
        created_at: fmtDate(like.created_at),
        _ts: new Date(like.created_at).getTime(),
        isRead: readSet.has(key),
        destination: product?.slug
          ? `/dashboard/products/${product.slug}`
          : `/dashboard/products`,
      });
    }
  }

  // ── 4. Tri global : plus récent en premier ──────────────────
  notifications.sort((a, b) => b._ts - a._ts);

  return data({ notifications, userId: user.id }, { headers });
}
