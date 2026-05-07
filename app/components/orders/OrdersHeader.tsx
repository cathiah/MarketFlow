import { Bell } from "lucide-react";

interface OrdersHeaderProps {
  count: number;
}

export const OrdersHeader = ({ count }: OrdersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" />
          Suivi des commandes
        </h1>
        <p className="text-base-content/60 mt-1">
          Confirmez si la commande est déjà livrée ou si elle est encore en cours.
        </p>
      </div>
      {count > 0 && (
        <div className="badge badge-primary badge-lg gap-2 py-4 px-6 font-bold shadow-lg shadow-primary/20">
          {count} commande{count > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};
