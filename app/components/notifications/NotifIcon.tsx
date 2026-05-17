import {
  Bell,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  ShoppingBag,
  Star,
  Heart,
} from "lucide-react";
import type { NotificationKind } from "~/types/notifications";

interface NotifIconProps {
  kind: NotificationKind;
  orderStatus?: string;
}

export function NotifIcon({ kind, orderStatus }: NotifIconProps) {
  if (kind === "review") return <Star className="w-5 h-5 text-warning" />;
  if (kind === "like") return <Heart className="w-5 h-5 text-error" />;
  if (kind === "order_seller") return <ShoppingBag className="w-5 h-5 text-secondary" />;

  switch (orderStatus) {
    case "paid":      return <CheckCircle2 className="w-5 h-5 text-success" />;
    case "shipped":   return <Truck        className="w-5 h-5 text-info" />;
    case "delivered": return <Package      className="w-5 h-5 text-primary" />;
    case "cancelled": return <XCircle      className="w-5 h-5 text-error" />;
    case "pending":   return <Clock        className="w-5 h-5 text-warning" />;
    default:          return <Bell         className="w-5 h-5 text-base-content/50" />;
  }
}
