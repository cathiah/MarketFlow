import type { Route } from "./+types/_index";
import { data } from "react-router";
import { performGetDashboardData } from "./dashboard.server";
import { DashboardView } from "~/components/dashboard/DashboardView";

export async function loader({ request }: Route.LoaderArgs) {
  return await performGetDashboardData(request);
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Tableau de Bord | MarketFlow" },
    {
      name: "description",
      content:
        "Gérez votre compte, suivez vos commandes et analysez vos ventes en un clin d'œil sur votre tableau de bord MarketFlow.",
    },
    { property: "og:title", content: "Tableau de Bord | MarketFlow - Gestion simplifiée" },
    {
      property: "og:description",
      content: "Accédez à vos outils de vendeur et d'acheteur pour piloter votre activité sur MarketFlow.",
    },
    { property: "og:type", content: "website" },
    { name: "robots", content: "noindex, nofollow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};


export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <DashboardView 
      orders={loaderData.orders} 
      stats={loaderData.stats} 
    />
  );
}
