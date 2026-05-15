import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { fadeInUp } from "./utils/animations";
import { ProductStorePreviewModal } from "./ProductStorePreviewModal";
import type { Product } from "~/types/products";
import type { Review } from "~/types/reviews";

interface ProductStatusFooterProps {
  isPublished: boolean;
  product: Product;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (i: number) => void;
  likeCount: number;
  isLiked: boolean;
  reviews: Review[];
  userReview: Review | null;
}

export const ProductStatusFooter: React.FC<ProductStatusFooterProps> = React.memo(
  function ProductStatusFooter({
    isPublished,
    product,
    images,
    currentIndex,
    onNext,
    onPrev,
    onSelect,
    likeCount,
    isLiked,
    reviews,
    userReview,
  }) {
    const [showPreview, setShowPreview] = useState(false);

    return (
      <>
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
          <button
            onClick={() => setShowPreview(true)}
            className="btn btn-primary btn-sm gap-2"
          >
            <ShoppingCart size={16} /> Aperçu Boutique
          </button>
        </motion.footer>

        <AnimatePresence>
          {showPreview && (
            <ProductStorePreviewModal
              product={product}
              images={images}
              currentIndex={currentIndex}
              onNext={onNext}
              onPrev={onPrev}
              onSelect={onSelect}
              onClose={() => setShowPreview(false)}
              likeCount={likeCount}
              isLiked={isLiked}
              reviews={reviews}
              userReview={userReview}
            />
          )}
        </AnimatePresence>
      </>
    );
  }
);
