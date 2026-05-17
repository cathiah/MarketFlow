// Barrel — conserve la compatibilité avec les imports existants
export type { NotificationItem, NotificationKind } from "~/types/notifications";
export { performGetNotifications } from "./notifications.loader";
export { performNotificationsAction } from "./notifications.actions";
