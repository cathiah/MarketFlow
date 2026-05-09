import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { fadeInUp } from "./utils/animations";

interface ProductStatusFooterProps {
  isPublished: boolean;
}

export const ProductStatusFooter: React.FC<ProductStatusFooterProps> = React.memo(
  function ProductStatusFooter({ isPublished }) {
    return (
      <motion.footer
        variants={fadeInUp}
        className="mt-8 p-6 rounded-2xl bg-base-200 border border-white/5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isPublished ? "bg-success animate-pulse" : "bg-warning"
            }`}
          />
          <span className="font-bold text-sm">
            {isPublished ? "En ligne" : "Brouillon / Masqué"}
          </span>
        </div>
        <button className="btn btn-primary btn-sm gap-2">
          <ShoppingCart size={16} /> Aperçu Boutique
        </button>
      </motion.footer>
    );
  }
);
