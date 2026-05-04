import { data } from "react-router";
import { MyProductsView } from "~/components/products/MyProductsView";
import type { Route } from "./+types/_index";
import { getSellerProducts, performDeleteProduct } from "./products.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { products, headers } = await getSellerProducts(request);
  return data({ products }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await performDeleteProduct(request);
}

export const meta: Route.MetaFunction = ({ data }) => {
  const count = data?.products?.length || 0;
  return [
    { title: `Mes Produits (${count}) | Dashboard` },
    { name: "description", content: "Gérez votre inventaire, modifiez vos produits et suivez vos stocks en temps réel." },
    { robots: "noindex, nofollow" }
  ];
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return <MyProductsView products={loaderData.products} />;
}
