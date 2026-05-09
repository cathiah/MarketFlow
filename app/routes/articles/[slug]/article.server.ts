import { data } from "react-router";
import { createClient } from "~/lib/supabase.server";
import type { Product } from "~/types/products";
import type { Review, ReviewProfile } from "~/types/review";

export async function getArticleBySlug(request: Request, slug: string | undefined) {
  const { supabase, headers } = createClient(request);

  try {
    if (!slug) throw new Error("Missing slug");

    const { data: { user } } = await supabase.auth.getUser();

    const { data: product, error } = await supabase
      .from("products")
      .select("*, categories(id, name), product_images(id, url, display_order)")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;
    if (!product) throw new Response("Article introuvable", { status: 404, headers });

    // Likes
    const { count: likesCount } = await supabase
      .from("product_likes")
      .select("*", { count: "exact", head: true })
      .eq("product_id", product.id);

    let userHasLiked = false;
    if (user) {
      const { data: likeRow } = await supabase
        .from("product_likes")
        .select("id")
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .maybeSingle();
      userHasLiked = !!likeRow;
    }

    const { data: rawReviews } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, profiles(username, avatar_url)")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false });

    const reviews: Review[] = (rawReviews ?? []).map((r) => {
      const rawProfiles = r.profiles as
        | { username: string | null; avatar_url: string | null }
        | { username: string | null; avatar_url: string | null }[]
        | null;

      const profiles: ReviewProfile | null = Array.isArray(rawProfiles)
        ? (rawProfiles[0] ?? null)
        : rawProfiles ?? null;

      return {
        id: r.id as string,
        rating: r.rating as number,
        comment: (r.comment ?? null) as string | null,
        created_at: r.created_at as string,
        profiles,
      };
    });

    let userReview: { id: string; rating: number; comment: string | null } | null = null;
    if (user) {
      const { data: myReview } = await supabase
        .from("reviews")
        .select("id, rating, comment")
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .maybeSingle();
      userReview = myReview
        ? { id: myReview.id, rating: myReview.rating, comment: myReview.comment ?? null }
        : null;
    }

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : null;

    return data(
      {
        product: product as unknown as Product,
        userId: user?.id ?? null,
        likesCount: likesCount ?? 0,
        userHasLiked,
        reviews,
        userReview,
        avgRating,
      },
      { headers }
    );
  } catch (error: unknown) {
    if (error instanceof Response) throw error;
    throw new Response("Le serveur ne répond pas. Réessayez dans un instant.", {
      status: 503,
      headers,
    });
  }
}

export async function handleArticleAction(request: Request, productId: string) {
  const { supabase, headers } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return data(
      { success: false, message: "Connectez-vous pour effectuer cette action." },
      { headers }
    );
  }

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "like") {
    await supabase
      .from("product_likes")
      .insert({ user_id: user.id, product_id: productId });
    return data({ success: true, intent: "like" }, { headers });
  }

  if (intent === "unlike") {
    await supabase
      .from("product_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    return data({ success: true, intent: "unlike" }, { headers });
  }

  if (intent === "review") {
    const rating = parseInt(formData.get("rating") as string, 10);
    const comment = (formData.get("comment") as string)?.trim() || null;

    if (!rating || rating < 1 || rating > 5) {
      return data({ success: false, message: "Note invalide." }, { headers });
    }

    await supabase.from("reviews").upsert(
      { user_id: user.id, product_id: productId, rating, comment },
      { onConflict: "user_id,product_id" }
    );
    return data({ success: true, intent: "review" }, { headers });
  }

  if (intent === "delete_review") {
    await supabase
      .from("reviews")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    return data({ success: true, intent: "delete_review" }, { headers });
  }

  return data({ success: false, message: "Action inconnue." }, { headers });
}