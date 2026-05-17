import { BellOff } from "lucide-react";

export function NotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300">
      <div className="bg-base-100 p-4 rounded-full shadow-inner mb-4">
        <BellOff className="w-10 h-10 opacity-20" />
      </div>
      <p className="text-lg font-semibold opacity-60">Aucune notification</p>
      <p className="text-sm opacity-40 text-center max-w-xs mt-1">
        Les activités sur vos commandes et produits apparaîtront ici.
      </p>
    </div>
  );
}
