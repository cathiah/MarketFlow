import type { Route } from "./+types/_index";
import { performGetNotifications, performUpdateOrderStatus } from "./orders.server";
import { PendingOrdersView } from "~/components/dashboard/orders/PendingOrdersView";

import { data } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const { orders, headers } = await performGetNotifications(request);
  return data({ orders }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await performUpdateOrderStatus(request);
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Commandes en attente | MarketFlow" },
    {
      name: "description",
      content:
        "Gérez vos commandes en attente sur MarketFlow. Validez ou mettez à jour le statut de vos transactions en cours.",
    },
    { property: "og:title", content: "Commandes en attente | MarketFlow" },
    {
      property: "og:description",
      content: "Suivi et gestion des commandes prioritaires pour votre boutique.",
    },
    { property: "og:type", content: "website" },
    { name: "robots", content: "noindex, nofollow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export default function PendingOrdersPage({ loaderData }: Route.ComponentProps) {
  return <PendingOrdersView orders={loaderData.orders} />;
}