import type { NotificationItem } from "~/types/notifications";
import { NotifIcon } from "./NotifIcon";
import { KindBadge } from "./KindBadge";
import { iconBg } from "./notificationUtils";

interface NotificationRowProps {
  notification: NotificationItem;
  isRead: boolean;
  onClick: () => void;
}

export function NotificationRow({ notification: n, isRead: read, onClick }: NotificationRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left rounded-2xl border transition-all duration-200
        hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]
        ${read
          ? "bg-base-100 border-base-200 opacity-55"
          : "bg-base-100 border-primary/20 shadow-sm ring-1 ring-primary/10"
        }
      `}
    >
      <div className="p-4 flex items-start gap-3">
        <div className={`shrink-0 p-2.5 rounded-xl transition-colors ${iconBg(n.kind, read)}`}>
          <NotifIcon kind={n.kind} orderStatus={n.orderStatus} />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`font-semibold text-sm leading-tight ${read ? "text-base-content/55" : "text-base-content"}`}>
                {n.title}
              </p>
              <KindBadge kind={n.kind} />
            </div>
            {!read && (
              <span className="shrink-0 w-2 h-2 rounded-full bg-primary mt-0.5" />
            )}
          </div>

          <p className="text-xs text-base-content/50 leading-relaxed line-clamp-2">
            {n.message}
          </p>

          <p className="text-[11px] text-base-content/30 pt-0.5">
            {n.created_at}
          </p>
        </div>
      </div>
    </button>
  );
}
