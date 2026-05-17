import type { Route } from "./+types/_index";
import {
  performGetNotifications,
  performNotificationsAction,
} from "./notifications.server";
import { NotificationsView } from "~/components/notifications/NotificationsView";

export const meta: Route.MetaFunction = () => [
  { title: "Notifications | MarketFlow" },
  { name: "description", content: "Consultez vos alertes de commande et les mises à jour importantes de votre compte MarketFlow." },
  { property: "og:title", content: "Notifications | MarketFlow" },
  { property: "og:type", content: "website" },
  { name: "robots", content: "noindex, nofollow" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];

export async function loader({ request }: Route.LoaderArgs) {
  return await performGetNotifications(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await performNotificationsAction(request);
}

export default function NotificationsPage({ loaderData }: Route.ComponentProps) {
  return (
    <NotificationsView
      notifications={loaderData.notifications}
      userId={loaderData.userId}
    />
  );
}