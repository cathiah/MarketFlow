import { BellOff } from "lucide-react";

export const EmptyOrderList = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300">
      <div className="bg-base-100 p-4 rounded-full shadow-inner mb-4">
        <BellOff className="w-10 h-10 opacity-20" />
      </div>
      <p className="text-lg font-semibold opacity-60">
        Aucune commande pour le moment
      </p>
      <p className="text-sm opacity-40">
        Votre panier est vide ou toutes vos commandes ont déjà été traitées.
      </p>
    </div>
  );
};
