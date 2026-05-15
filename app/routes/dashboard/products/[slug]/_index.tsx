/**
 * routes/dashboard/products/$slug/_index.tsx
 */
import { data } from "react-router";
import { ProductView } from "~/components/dashboard/products/ProductView";
import { getProductLikeInfo, getProductReviews } from "~/lib/productReviews.server";
import { createClient } from "~/lib/supabase.server";
import type { Product } from "~/types/products";
import type { Route } from "./+types/_index";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;
  const { supabase, headers } = createClient(request);

  // 1. Fetch the product directly (no data() wrapper here so we can read .id)
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (id, name),
      product_images (id, url)
    `)
    .eq("slug", slug)
    .single();

  if (error || !product) {
    throw data("Produit non trouvé", { status: 404, headers });
  }

  // 2. Now product.id is available — fetch likes and reviews in parallel
  const [{ likeCount, isLiked }, { reviews, userReview }] = await Promise.all([
    getProductLikeInfo(request, product.id),
    getProductReviews(request, product.id),
  ]);

  return data(
    {
      product: product as unknown as Product,
      likeCount,
      isLiked,
      reviews,
      userReview,
    },
    { headers }
  );
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data || !("product" in data)) {
    return [
      { title: "Produit non trouvé" },
      { name: "robots", content: "noindex, nofollow" },
    ];
  }

  const { product } = data;

  return [
    { title: `${product.title} | Dashboard` },
    { name: "description", content: product.description?.slice(0, 160) || "Aucune description" },
    { property: "og:image", content: product.main_image_url || "" },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

export default function ProductPage({
  loaderData: { product, likeCount, isLiked, reviews, userReview },
}: Route.ComponentProps) {
  return (
    <ProductView
      product={product}
      likeCount={likeCount}
      isLiked={isLiked}
      reviews={reviews}
      userReview={userReview}
    />
  );
}