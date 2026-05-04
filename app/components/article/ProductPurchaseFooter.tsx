import React from "react";
import { ShoppingCart } from "lucide-react";

interface ProductPurchaseFooterProps {
  outOfStock: boolean;
  onPurchase: () => void;
}

export const ProductPurchaseFooter: React.FC<ProductPurchaseFooterProps> = ({ 
  outOfStock, 
  onPurchase 
}) => {
  return (
    <footer className="mt-auto p-6 rounded-2xl bg-base-200 border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${outOfStock ? "bg-error" : "bg-success animate-pulse"}`} />
        <span className="font-bold text-sm">
          {outOfStock ? "Indisponible" : "Disponible à l'achat"}
        </span>
      </div>

      <button
        type="button"
        onClick={onPurchase}
        disabled={outOfStock}
        className="btn btn-primary btn-sm gap-2"
      >
        <ShoppingCart size={16} />
        {outOfStock ? "Rupture" : "Acheter maintenant"}
      </button>
    </footer>
  );
};
