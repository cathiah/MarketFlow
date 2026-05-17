import type { OrderStatus } from "~/types/order";

export type NotificationKind =
  | "order_buyer"
  | "order_seller"
  | "review"
  | "like";

export type NotificationItem = {
  key: string;
  kind: NotificationKind;
  title: string;
  message: string;
  created_at: string;
  _ts: number;
  isRead: boolean;
  destination: string;
  orderStatus?: OrderStatus;
};
