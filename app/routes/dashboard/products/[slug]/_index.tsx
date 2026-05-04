import { ProductView } from "~/components/products/ProductView";
import type { Route } from "./+types/_index";
import { getProductBySlug } from "./product.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;
  return await getProductBySlug(request, slug);
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data || !('product' in data)) {
    return [
      { title: "Produit non trouvé" },
      { name: "robots", content: "noindex, nofollow" }
    ];
  }

  const { product } = data;

  return [
    { title: `${product.title} | Dashboard` },
    { name: "description", content: product.description?.slice(0, 160) || "Aucune description" },
    { property: "og:image", content: product.main_image_url || "" },
    { name: "robots", content: "noindex, nofollow" }
  ];
};


export default function ViewProduct({ loaderData: { product } }: Route.ComponentProps) {
  return <ProductView product={product} />;
}
