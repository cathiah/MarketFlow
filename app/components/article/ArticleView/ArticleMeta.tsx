import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, Heart, Star } from "lucide-react";
import { fadeInUp } from "./utils/animations";
import { useArticleLike } from "./hooks/useArticleLike";
import type { Product } from "~/types/products";

type ArticleMetaProps = Pick<Product, "title" | "price" | "stock_quantity" | "created_at" | "categories"> & {
  userId: string | null;
  likesCount: number;
  userHasLiked: boolean;
  avgRating: number | null;
  reviewsCount: number;
};

export const ArticleMeta: React.FC<ArticleMetaProps> = React.memo(function ArticleMeta({
  title, price, stock_quantity, created_at, categories,
  userId, likesCount, userHasLiked, avgRating, reviewsCount,
}) {
  const { liked, count, toggle, isDisabled } = useArticleLike({
    initialLiked: userHasLiked,
    initialCount: likesCount,
    userId,
  });

  const formattedPrice = useMemo(
    () => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price),
    [price]
  );

  const outOfStock = stock_quantity <= 0;
  const displayRating = avgRating ?? 0;
  const fullStars = Math.floor(displayRating);

  return (
    <motion.div variants={fadeInUp} className="space-y-4">
      {/* Catégorie + date */}
      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
        <Tag size={12} />
        <span>{categories?.name || "Sans catégorie"}</span>
        <span className="opacity-20">•</span>
        <div className="flex items-center gap-1 opacity-50">
          <Calendar size={12} />
          {new Date(created_at).toLocaleDateString("fr-FR")}
        </div>
      </div>

      {/* Titre + like */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight flex-1">
          {title}
        </h1>
        <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
          <button
            type="button"
            onClick={toggle}
            disabled={isDisabled}
            title={isDisabled ? "Connectez-vous pour aimer ce produit" : undefined}
            className={`btn btn-circle btn-ghost border transition-all duration-300 ${
              liked
                ? "border-error/40 text-error bg-error/10 hover:bg-error/20"
                : "border-base-content/10 opacity-50 hover:opacity-100 hover:border-error/30 hover:text-error"
            } disabled:cursor-not-allowed`}
          >
            <Heart size={18} className={`transition-all duration-300 ${liked ? "fill-error" : ""}`} />
          </button>
          <span className="text-[10px] font-bold opacity-40 tabular-nums">{count}</span>
        </div>
      </div>

      {/* Étoiles réelles */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`transition-colors ${
                i < fullStars ? "text-warning fill-warning" : "text-base-content/15"
              }`}
            />
          ))}
        </div>
        {reviewsCount > 0 ? (
          <span className="text-xs opacity-40 font-medium">
            {displayRating.toFixed(1)} · {reviewsCount} avis
          </span>
        ) : (
          <span className="text-xs opacity-30 italic">Aucun avis</span>
        )}
      </div>

      {/* Prix + stock */}
      <div className="flex items-baseline gap-4 pt-1">
        <span className="text-4xl font-black text-secondary">{formattedPrice}</span>
        <div className={`badge badge-outline font-bold ${outOfStock ? "badge-error" : "badge-success"}`}>
          {outOfStock ? "Rupture" : `${stock_quantity} en stock`}
        </div>
      </div>
    </motion.div>
  );
});