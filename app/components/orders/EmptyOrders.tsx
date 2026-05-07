import { Inbox } from "lucide-react";

export const EmptyOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-base-200/30 rounded-[3rem] border-2 border-dashed border-base-300">
      <div className="bg-base-100 p-6 rounded-full shadow-xl mb-6">
        <Inbox className="w-12 h-12 text-base-content/20" />
      </div>
      <h3 className="text-xl font-bold">Tout est à jour !</h3>
      <p className="opacity-50 mt-1 max-w-xs text-center">
        Aucune commande à confirmer comme livrée ou en cours pour le moment.
      </p>
    </div>
  );
};
