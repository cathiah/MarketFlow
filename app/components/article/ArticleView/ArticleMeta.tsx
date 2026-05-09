import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import { fadeInUp } from "./utils/animations";
import type { Product } from "~/types/products";

type ArticleMetaProps = Pick<
  Product,
  "title" | "price" | "stock_quantity" | "created_at" | "categories"
>;

export const ArticleMeta: React.FC<ArticleMetaProps> = React.memo(function ArticleMeta({
  title,
  price,
  stock_quantity,
  created_at,
  categories,
}) {
  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price),
    [price]
  );

  const outOfStock = stock_quantity <= 0;

  return (
    <motion.div variants={fadeInUp} className="space-y-4">
      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary">
        <Tag size={12} />
        <span>{categories?.name || "Sans catégorie"}</span>
        <span className="opacity-20">•</span>
        <div className="flex items-center gap-1 opacity-50">
          <Calendar size={12} />
          {new Date(created_at).toLocaleDateString("fr-FR")}
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
        {title}
      </h1>

      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-black text-secondary">{formattedPrice}</span>
        <div
          className={`badge ${outOfStock ? "badge-error" : "badge-success"} badge-outline font-bold`}
        >
          {outOfStock ? "Rupture" : `${stock_quantity} en stock`}
        </div>
      </div>
    </motion.div>
  );
});
