import { data } from "react-router";
import { createClient } from "~/lib/supabase.server";
import { normalizeReview, type RawReview } from "~/types/reviews";

const REVIEW_SELECT = `
  id,
  user_id,
  product_id,
  rating,
  comment,
  created_at,
  profiles ( username, avatar_url )
` as const;

export async function getProductLikeInfo(request: Request, productId: string) {
  const { supabase } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  const [{ count }, { data: userLike }] = await Promise.all([
    supabase
      .from("product_likes")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId),

    user
      ? supabase
          .from("product_likes")
          .select("id")
          .eq("product_id", productId)
          .eq("user_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return { likeCount: count ?? 0, isLiked: !!userLike };
}

export async function handleLikeAction(request: Request) {
  const { supabase, headers } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw data({ error: "Non authentifié" }, { status: 401, headers });
  }

  const body = await request.formData();
  const productId = String(body.get("productId") ?? "");
  const action = String(body.get("action") ?? "like");

  if (!productId) throw data({ error: "productId manquant" }, { status: 400, headers });

  if (action === "unlike") {
    await supabase.from("product_likes").delete()
      .eq("product_id", productId).eq("user_id", user.id);
  } else {
    await supabase.from("product_likes").upsert({ product_id: productId, user_id: user.id });
  }

  const { count } = await supabase
    .from("product_likes")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  return data({ likeCount: count ?? 0, isLiked: action === "like" }, { headers });
}

export async function getProductReviews(request: Request, productId: string) {
  const { supabase } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  const { data: raw, error } = await supabase
    .from("reviews")
    .select(REVIEW_SELECT)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProductReviews error:", error);
    return { reviews: [], userReview: null };
  }

  const reviews = (raw as unknown as RawReview[]).map(normalizeReview);
  const userReview = user
    ? (reviews.find((r) => r.user_id === user.id) ?? null)
    : null;

  return { reviews, userReview };
}

export async function handleReviewAction(request: Request) {
  const { supabase, headers } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw data({ error: "Non authentifié" }, { status: 401, headers });
  }

  const body = await request.formData();
  const productId = String(body.get("productId") ?? "");
  const rating = Number(body.get("rating") ?? 0);
  const comment = String(body.get("comment") ?? "").trim() || null;

  if (!productId || rating < 1 || rating > 5) {
    throw data({ error: "Données invalides" }, { status: 400, headers });
  }

  const { data: saved, error } = await supabase
    .from("reviews")
    .upsert(
      { product_id: productId, user_id: user.id, rating, comment },
      { onConflict: "user_id,product_id" }
    )
    .select(REVIEW_SELECT)
    .single();

  if (error || !saved) {
    throw data({ error: "Erreur lors de l'enregistrement" }, { status: 500, headers });
  }

  const review = normalizeReview(saved as unknown as RawReview);
  return data({ review }, { headers });
}
