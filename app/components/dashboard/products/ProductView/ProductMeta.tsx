import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import { fadeInUp } from "./utils/animations";
import type { Product } from "~/types/products";

type ProductMetaProps = Pick<
  Product,
  "title" | "price" | "stock_quantity" | "created_at" | "categories"
>;

export const ProductMeta: React.FC<ProductMetaProps> = React.memo(function ProductMeta({
  title,
  price,
  stock_quantity,
  created_at,
  categories,
}) {
  const formattedPrice = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price),
    [price]
  );

  return (
    <>
      <motion.div
        variants={fadeInUp}
        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary"
      >
        <Tag size={12} />
        <span>{categories?.name || "Sans catégorie"}</span>
        <span className="opacity-20">•</span>
        <div className="flex items-center gap-1 opacity-50">
          <Calendar size={12} />
          {new Date(created_at).toLocaleDateString("fr-FR")}
        </div>
      </motion.div>

      <motion.h1
        variants={fadeInUp}
        className="text-4xl md:text-5xl font-black tracking-tighter leading-tight"
      >
        {title}
      </motion.h1>

      <motion.div variants={fadeInUp} className="flex items-baseline gap-4 py-4">
        <span className="text-4xl font-black text-secondary">{formattedPrice}</span>
        <div
          className={`badge ${
            stock_quantity > 0 ? "badge-success" : "badge-error"
          } badge-outline font-bold`}
        >
          {stock_quantity > 0 ? `${stock_quantity} en stock` : "Rupture"}
        </div>
      </motion.div>
    </>
  );
});
