import { data } from "react-router";
import { createClient } from "~/lib/supabase.server";
import type { Profile } from "~/types/profile";

async function getProfile(
  supabase: ReturnType<typeof createClient>["supabase"],
  userId: string
): Promise<Profile | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>();

  if (!profile) return null;

  const avatar_url =
    profile.avatar_url && !profile.avatar_url.startsWith("http")
      ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data.publicUrl
      : profile.avatar_url;

  return { ...profile, avatar_url };
}

async function getUnreadCount(
  supabase: ReturnType<typeof createClient>["supabase"],
  userId: string
): Promise<number> {
  const { data: reads } = await supabase
    .from("notification_reads")
    .select("notification_key")
    .eq("user_id", userId);

  const readSet = new Set((reads ?? []).map((r) => r.notification_key));

  const { count: buyerOrdersCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("buyer_id", userId);

  let totalEvents = buyerOrdersCount ?? 0;

  const { data: myProducts } = await supabase
    .from("products")
    .select("id")
    .eq("seller_id", userId);

  const myProductIds = (myProducts ?? []).map((p) => p.id);

  if (myProductIds.length > 0) {
    // Orders reçus sur mes produits (dédupliqués)
    const { data: soldItems } = await supabase
      .from("order_items")
      .select("order_id")
      .in("product_id", myProductIds);
    const sellerOrderIds = new Set((soldItems ?? []).map((i) => i.order_id));
    totalEvents += sellerOrderIds.size;

    const { count: reviewsCount } = await supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .in("product_id", myProductIds)
      .neq("user_id", userId);
    totalEvents += reviewsCount ?? 0;

    const { count: likesCount } = await supabase
      .from("product_likes")
      .select("id", { count: "exact", head: true })
      .in("product_id", myProductIds)
      .neq("user_id", userId);
    totalEvents += likesCount ?? 0;
  }

  return Math.max(0, totalEvents - readSet.size);
}

export async function getLayoutData(request: Request) {
  const { supabase, headers } = createClient(request);

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return data({ user: null, unreadCount: 0 }, { headers });
  }

  const [profile, unreadCount] = await Promise.all([
    getProfile(supabase, authUser.id),
    getUnreadCount(supabase, authUser.id),
  ]);

  if (!profile) {
    return data({ user: null, unreadCount: 0 }, { headers });
  }

  return data({ user: profile, unreadCount }, { headers });
}
