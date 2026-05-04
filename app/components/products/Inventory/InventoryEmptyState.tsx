import React from "react";
import { Package } from "lucide-react";

export const InventoryEmptyState: React.FC = React.memo(function InventoryEmptyState() {
  return (
    <div className="py-32 text-center flex flex-col items-center gap-4">
      <div className="p-6 bg-base-300/30 rounded-full ring-1 ring-white/5">
        <Package size={40} className="opacity-20" />
      </div>
      <div className="space-y-1">
        <p className="font-bold opacity-40 text-lg">Votre catalogue est vide</p>
        <p className="text-sm opacity-30">Commencez par ajouter votre premier produit pour le voir apparaître ici.</p>
      </div>
    </div>
  );
});
