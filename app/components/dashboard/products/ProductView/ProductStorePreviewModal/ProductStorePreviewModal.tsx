import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "~/types/products";
import type { Review } from "~/types/reviews";
import { useModalDialog } from "./hooks/useModalDialog";
import { useProductLike } from "./hooks/useProductLike";
import { useProductReviews } from "./hooks/useProductReviews";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ReviewsSection } from "./ReviewsSection";

interface ProductStorePreviewModalProps {
  product: Product;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (i: number) => void;
  onClose: () => void;
  reviews: Review[];
  userReview: Review | null;
  isLiked: boolean;
  likeCount: number;
}

export const ProductStorePreviewModal: React.FC<ProductStorePreviewModalProps> = ({
  product, images, currentIndex, onNext, onPrev, onSelect, onClose,
  reviews: initialReviews, isLiked: initialIsLiked, likeCount: initialLikeCount,
}) => {
  const { dialogRef, handleBackdrop } = useModalDialog(onClose);
  const { isLiked, likeCount, handleLike } = useProductLike({
    productId: product.id,
    initialIsLiked,
    initialLikeCount,
  });
  const { reviews } = useProductReviews({
    productId: product.id,
    initialReviews,
  });

  return (
    <dialog
      ref={dialogRef}
      className="modal backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="modal-box max-w-4xl w-full p-0 overflow-hidden bg-base-100 rounded-2xl border border-base-content/10 shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-warning/10 border-b border-warning/20 px-6 py-2 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-widest text-warning opacity-80">
            👁 Aperçu boutique — non visible par les clients
          </span>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <ProductGallery
              product={product}
              images={images}
              currentIndex={currentIndex}
              onNext={onNext}
              onPrev={onPrev}
              onSelect={onSelect}
            />
            <ProductInfo
              product={product}
              reviews={reviews}
              isLiked={isLiked}
              likeCount={likeCount}
              onLike={handleLike}
            />
          </div>
          <ReviewsSection reviews={reviews} />
        </div>
      </motion.div>
    </dialog>
  );
};
