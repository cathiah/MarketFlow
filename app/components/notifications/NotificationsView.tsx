import { Bell, CheckCheck } from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import type { NotificationItem } from "~/types/notifications";
import { NotificationRow } from "./NotificationRow";
import { NotificationsEmptyState } from "./NotificationsEmptyState";

interface NotificationsViewProps {
  notifications: NotificationItem[];
  userId: string;
}

export function NotificationsView({ notifications }: NotificationsViewProps) {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const optimisticKeys = useOptimisticKeys(fetcher, notifications);
  const isRead = (n: NotificationItem) => n.isRead || optimisticKeys.has(n.key);

  const unreadItems = notifications.filter((n) => !isRead(n));
  const unreadCount = unreadItems.length;
  const unreadKeys = unreadItems.map((n) => n.key);

  const isMarkingAllRead = fetcher.formData?.get("intent") === "mark_all_read";
  const displayedUnread = isMarkingAllRead ? 0 : unreadCount;

  const handleClick = (n: NotificationItem) => {
    if (!isRead(n)) {
      fetcher.submit({ intent: "mark_read", key: n.key }, { method: "post" });
    }
    navigate(n.destination);
  };

  const handleMarkAllRead = () => {
    if (unreadKeys.length === 0) return;
    fetcher.submit(
      { intent: "mark_all_read", keys: JSON.stringify(unreadKeys) },
      { method: "post" }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      <NotificationsHeader
        unreadCount={displayedUnread}
        showMarkAll={unreadKeys.length > 0 && !isMarkingAllRead}
        onMarkAllRead={handleMarkAllRead}
      />

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationRow
              key={n.key}
              notification={n}
              isRead={isRead(n)}
              onClick={() => handleClick(n)}
            />
          ))}
        </div>
      ) : (
        <NotificationsEmptyState />
      )}
    </div>
  );
}

interface NotificationsHeaderProps {
  unreadCount: number;
  showMarkAll: boolean;
  onMarkAllRead: () => void;
}

function NotificationsHeader({ unreadCount, showMarkAll, onMarkAllRead }: NotificationsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-base-content" />
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <span className="badge badge-primary badge-sm font-bold">
            {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {showMarkAll && (
        <button
          onClick={onMarkAllRead}
          className="btn btn-ghost btn-sm gap-2 opacity-70 hover:opacity-100"
        >
          <CheckCheck size={15} />
          Tout marquer comme lu
        </button>
      )}
    </div>
  );
}

function useOptimisticKeys(
  fetcher: ReturnType<typeof useFetcher>,
  notifications: NotificationItem[]
): Set<string> {
  const keys = new Set<string>();

  if (!fetcher.formData) return keys;

  const intent = fetcher.formData.get("intent");

  if (intent === "mark_all_read") {
    notifications.forEach((n) => keys.add(n.key));
  }

  if (intent === "mark_read") {
    const k = fetcher.formData.get("key") as string;
    if (k) keys.add(k);
  }

  return keys;
}
