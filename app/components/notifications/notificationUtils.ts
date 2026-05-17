import type { NotificationKind } from "~/types/notifications";

export function iconBg(kind: NotificationKind, read: boolean): string {
  if (read) return "bg-base-200";

  const map: Record<NotificationKind, string> = {
    order_buyer:  "bg-primary/10",
    order_seller: "bg-secondary/10",
    review:       "bg-warning/10",
    like:         "bg-error/10",
  };

  return map[kind];
}
