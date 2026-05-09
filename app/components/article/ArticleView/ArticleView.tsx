import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "./utils/animations";
import { ArticleNavBar } from "./ArticleNavBar";
import { ArticleMeta } from "./ArticleMeta";
import { ArticleDescription } from "./ArticleDescription";
import { ArticleAttributes } from "./ArticleAttributes";
import { ArticleGallery } from "./ArticleGallery";
import { ArticlePurchaseFooter } from "./ArticlePurchaseFooter";
import { ArticleReviews } from "./ArticleReviews";
import { useArticleOrder } from "./hooks/useArticleOrder";
import { OrderModal } from "~/components/home/OrderModal";
import type { Product } from "~/types/products";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: { username: string | null; avatar_url: string | null } | null;
}

interface ArticleViewProps {
  product: Product & { categories: { name: string } | null };
  userId: string | null;
  likesCount: number;
  userHasLiked: boolean;
  reviews: Review[];
  userReview: { id: string; rating: number; comment: string | null } | null;
  avgRating: number | null;
}

export const ArticleView: React.FC<ArticleViewProps> = React.memo(function ArticleView({
  product, userId, likesCount, userHasLiked, reviews, userReview, avgRating,
}) {
  const { selectedProduct, openOrder, closeOrder } = useArticleOrder();

  const allImages = useMemo(
    () => [
      ...(product.main_image_url ? [product.main_image_url] : []),
      ...(product.product_images?.map((img) => img.url) ?? []),
    ],
    [product]
  );

  const outOfStock = product.stock_quantity <= 0;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4 pt-4">
      <ArticleNavBar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galerie */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <ArticleGallery images={allImages} title={product.title} />
        </motion.div>

        {/* Colonne droite */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col gap-6"
        >
          <ArticleMeta
            title={product.title}
            price={product.price}
            stock_quantity={product.stock_quantity}
            created_at={product.created_at}
            categories={product.categories}
            userId={userId}
            likesCount={likesCount}
            userHasLiked={userHasLiked}
            avgRating={avgRating}
            reviewsCount={reviews.length}
          />

          <ArticleDescription description={product.description} />
          <ArticleAttributes attributes={product.attributes} />

          <ArticlePurchaseFooter
            outOfStock={outOfStock}
            stock={product.stock_quantity}
            onPurchase={() => openOrder(product)}
          />
        </motion.div>
      </div>

      {/* Avis — pleine largeur sous le grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <ArticleReviews
          reviews={reviews}
          userId={userId}
          userReview={userReview}
        />
      </motion.div>

      {selectedProduct && (
        <OrderModal product={selectedProduct} onClose={closeOrder} />
      )}
    </div>
  );
});

ArticleView.displayName = "ArticleView";