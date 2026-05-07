import type { Route } from "./+types/_index";
import { performGetBuyerOrders } from "./getBuyerOrders.server";
import { performOrderAction } from "./orderAction.server";
import { CartManagerView } from "~/components/orders/CartManagerView";
import { useActionData } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  return await performGetBuyerOrders(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await performOrderAction(request);
}

export const meta: Route.MetaFunction = () => [
  { title: "Mes commandes | MarketFlow" },
  {
    name: "description",
    content:
      "Gérez votre panier et vos commandes en attente, payez ou annulez directement depuis votre espace MarketFlow.",
  },
  { property: "og:title", content: "Mes commandes | MarketFlow" },
  {
    property: "og:description",
    content:
      "Suivez l'état des commandes que vous avez passées et gérez votre panier d'achat.",
  },
  { property: "og:type", content: "website" },
  { name: "robots", content: "noindex, nofollow" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];

export default function OrdersPage({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData() as { error?: string } | undefined;
  return <CartManagerView orders={loaderData.orders} actionData={actionData} />;
}
