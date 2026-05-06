import type { Route } from "./+types/_index";
import { performGetNotifications, performUpdateOrderStatus } from "./orders.server";
import { PendingOrdersView } from "~/components/orders/PendingOrdersView";

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
    { title: "Notifications | MarketFlow" },
    {
      name: "description",
      content:
        "Restez informé de vos activités sur MarketFlow. Gérez vos demandes d'achat en attente et vos alertes en temps réel.",
    },
    { property: "og:title", content: "Notifications | MarketFlow" },
    {
      property: "og:description",
      content: "Consultez vos notifications et gérez vos demandes d'achat en toute simplicité.",
    },
    { property: "og:type", content: "website" },
    { name: "robots", content: "noindex, nofollow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export default function Notifications({ loaderData }: Route.ComponentProps) {
  return <PendingOrdersView orders={loaderData.orders} />;
}
