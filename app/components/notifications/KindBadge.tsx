import {
  ShoppingCart,
  ShoppingBag,
  Star,
  Heart,
} from "lucide-react";
import type { NotificationKind } from "~/types/notifications";

interface KindBadgeProps {
  kind: NotificationKind;
}

const KIND_MAP: Record<NotificationKind, { label: string; cls: string; Icon: React.ElementType }> = {
  order_buyer:  { label: "Ma commande", cls: "badge-primary",   Icon: ShoppingCart },
  order_seller: { label: "Vente",       cls: "badge-secondary", Icon: ShoppingBag  },
  review:       { label: "Avis",        cls: "badge-warning",   Icon: Star         },
  like:         { label: "Like",        cls: "badge-error",     Icon: Heart        },
};

export function KindBadge({ kind }: KindBadgeProps) {
  const { label, cls, Icon } = KIND_MAP[kind];
  return (
    <span className={`badge badge-outline badge-xs font-semibold inline-flex items-center gap-1 ${cls}`}>
      <Icon size={10} />
      {label}
    </span>
  );
}
