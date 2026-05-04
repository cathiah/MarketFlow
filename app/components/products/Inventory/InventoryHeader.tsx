import React, { useMemo } from "react";
import { Link, href } from "react-router";
import { Plus } from "lucide-react";

interface InventoryHeaderProps {
  count: number;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = React.memo(function InventoryHeader({ count }) {
  const label = useMemo(() => `${count} ${count > 1 ? "produits répertoriés" : "produit répertorié"} dans votre boutique.`, [count]);

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
          Mon Catalogue
        </h1>
        <p className="text-sm opacity-50">{label}</p>
      </div>
      <Link 
        to={href("/dashboard/products/add")} 
        className="btn btn-primary btn-md shadow-lg shadow-primary/20"
      >
        <Plus size={18} /> Nouvelle Offre
      </Link>
    </div>
  );
});
