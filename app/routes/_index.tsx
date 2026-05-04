import type { Route } from "./+types/_index";
import { performGetProducts, performCreateOrder } from "./home.server";
import { HomeView } from "~/components/home/HomeView";

export async function loader({ request }: Route.LoaderArgs) {
  return await performGetProducts(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await performCreateOrder(request);
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: "MarketFlow | Votre Marketplace de confiance" },
    {
      name: "description",
      content:
        "Découvrez une large sélection de produits sur MarketFlow. Achetez en toute sécurité ou commencez à vendre vos produits dès aujourd'hui sur notre plateforme.",
    },
    { property: "og:title", content: "MarketFlow | Achetez et Vendez en toute simplicité" },
    {
      property: "og:description",
      content: "Explorez notre catalogue de produits variés et profitez d'une expérience d'achat sécurisée.",
    },
    { property: "og:type", content: "website" },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export default function Home({ loaderData }: Route.ComponentProps) {
  return <HomeView products={loaderData.products} userId={loaderData.userId} />;
}