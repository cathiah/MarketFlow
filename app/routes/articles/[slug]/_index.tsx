import { performCreateOrder } from "~/routes/home.server";
import type { Route } from "./+types/_index";
import { getArticleBySlug, handleArticleAction } from "./article.server";
import { ArticleView } from "~/components/article/ArticleView";

export async function loader({ request, params }: Route.LoaderArgs) {
  return await getArticleBySlug(request, params.slug);
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.clone().formData();
  const intent = formData.get("intent") as string;

  // Commande → home.server
  if (!intent || intent === "order") return await performCreateOrder(request);

  // Like / review → article.server
  const { slug } = params;
  const { supabase } = await import("~/lib/supabase.server").then(m => ({ supabase: null }));
  // On a besoin du product_id — on le récupère via le slug
  const { createClient } = await import("~/lib/supabase.server");
  const { supabase: db } = createClient(request.clone());
  const { data: p } = await db.from("products").select("id").eq("slug", slug).maybeSingle();
  if (!p) return new Response("Not found", { status: 404 });

  return await handleArticleAction(request, p.id);
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.product) return [{ title: "Article introuvable | MarketFlow" }];
  const { title, description } = data.product;
  return [
    { title: `${title} | MarketFlow` },
    { name: "description", content: description ?? `Découvrez ${title} sur MarketFlow.` },
    { property: "og:title", content: title },
    { property: "og:type", content: "product" },
    { name: "robots", content: "index, follow" },
  ];
};

export default function ArticlePage({ loaderData }: Route.ComponentProps) {
  return (
    <ArticleView
      product={loaderData.product}
      userId={loaderData.userId}
      likesCount={loaderData.likesCount}
      userHasLiked={loaderData.userHasLiked}
      reviews={loaderData.reviews}
      userReview={loaderData.userReview}
      avgRating={loaderData.avgRating}
    />
  );
}