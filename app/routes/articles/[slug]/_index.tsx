import { performCreateOrder } from "~/routes/home.server";
import type { Route } from "./+types/_index";
import { getArticleBySlug } from "./article.server";
import { ArticleView } from "~/components/article/ArticleView";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { slug } = params;
  return await getArticleBySlug(request, slug);
}

export async function action({ request }: Route.ActionArgs) {
  return await performCreateOrder(request);
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.product) {
    return [{ title: "Article introuvable | MarketFlow" }];
  }
  
  const { title, description } = data.product;

  return [
    { title: `${title} | MarketFlow` },
    { name: "description", content: description ?? `Découvrez ${title} sur MarketFlow.` },
    { property: "og:title", content: title },
    { property: "og:description", content: description ?? `Découvrez ${title} sur MarketFlow.` },
    { property: "og:type", content: "product" },
    { name: "robots", content: "index, follow" },
  ];
};

export default function ArticlePage({ loaderData }: Route.ComponentProps) {
  return <ArticleView product={loaderData.product} />;
}
