import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, Shield, Truck, RotateCcw } from "lucide-react";
import { fadeInUp } from "./utils/animations";

interface ArticlePurchaseFooterProps {
  outOfStock: boolean;
  stock: number;
  onPurchase: (quantity: number) => void;
}

const GUARANTEES = [
  { icon: Shield,    label: "Paiement sécurisé" },
  { icon: Truck,     label: "Livraison rapide"  },
  { icon: RotateCcw, label: "Retour 30 jours"  },
];

export const ArticlePurchaseFooter: React.FC<ArticlePurchaseFooterProps> = React.memo(
  function ArticlePurchaseFooter({ outOfStock, stock, onPurchase }) {
    const [qty, setQty] = useState(1);

    const dec = () => setQty((q) => Math.max(1, q - 1));
    const inc = () => setQty((q) => Math.min(stock, q + 1));

    return (
      <motion.div variants={fadeInUp} className="space-y-4 mt-auto">
        {/* Sélecteur quantité + CTA */}
        <div className="p-5 rounded-2xl bg-base-200 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            {/* Statut */}
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${outOfStock ? "bg-error" : "bg-success animate-pulse"}`} />
              <span className="text-sm font-bold">
                {outOfStock ? "Indisponible" : "Disponible à l'achat"}
              </span>
            </div>

            {/* Quantité */}
            {!outOfStock && (
              <div className="flex items-center gap-1 bg-base-300 rounded-xl px-1 py-0.5">
                <button
                  type="button"
                  onClick={dec}
                  disabled={qty <= 1}
                  className="btn btn-ghost btn-xs btn-circle disabled:opacity-30"
                >
                  <Minus size={12} />
                </button>
                <span className="w-7 text-center text-sm font-black tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={inc}
                  disabled={qty >= stock}
                  className="btn btn-ghost btn-xs btn-circle disabled:opacity-30"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Bouton achat */}
          <button
            type="button"
            onClick={() => onPurchase(qty)}
            disabled={outOfStock}
            className="btn btn-primary w-full gap-2 shadow-lg shadow-primary/20 disabled:opacity-40"
          >
            <ShoppingCart size={18} />
            {outOfStock ? "Rupture de stock" : "Acheter maintenant"}
          </button>
        </div>

        {/* Garanties */}
        <div className="grid grid-cols-3 gap-2">
          {GUARANTEES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-base-200/50 border border-white/5 text-center"
            >
              <Icon size={16} className="opacity-40" />
              <span className="text-[10px] font-semibold opacity-40 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
);