import { Bell, CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  created_at: string;
  status: string;
  orderId: string;
};

export const NotificationsView = ({
  notifications,
}: {
  notifications: NotificationItem[];
}) => {
  const getIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="w-6 h-6 text-success" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-info" />;
      case "delivered":
        return <Package className="w-6 h-6 text-primary" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-error" />;
      case "pending":
        return <Clock className="w-6 h-6 text-warning" />;
      default:
        return <Bell className="w-6 h-6 text-base-content/70" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-base-200 rounded-2xl">{getIcon(notification.status)}</div>
                <div className="space-y-1">
                  <p className="font-semibold text-base">{notification.title}</p>
                  <p className="text-sm opacity-70">{notification.message}</p>
                </div>
              </div>

              <div className="text-xs opacity-50 flex items-center justify-between">
                <span>Commande #{notification.orderId.slice(0, 8)}</span>
                <span>{notification.created_at}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300">
          <div className="bg-base-100 p-4 rounded-full shadow-inner mb-4">
            <Bell className="w-10 h-10 opacity-20" />
          </div>
          <p className="text-lg font-semibold opacity-60">Aucune notification</p>
          <p className="text-sm opacity-40">Vos alertes de commande et mises à jour seront affichées ici.</p>
        </div>
      )}
    </div>
  );
};
