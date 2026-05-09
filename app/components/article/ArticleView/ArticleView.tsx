import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "./utils/animations";
import { ArticleNavBar } from "./ArticleNavBar";
import { ArticleMeta } from "./ArticleMeta";
import { ArticleDescription } from "./ArticleDescription";
import { ArticleAttributes } from "./ArticleAttributes";
import { useArticleOrder } from "./hooks/useArticleOrder";
import { ArticleGallery } from "./ArticleGallery";
import { ArticlePurchaseFooter } from "./ArticlePurchaseFooter";
import { OrderModal } from "~/components/home/OrderModal";
import type { Product } from "~/types/products";

interface ArticleViewProps {
  product: Product & { categories: { name: string } | null };
}

export const ArticleView: React.FC<ArticleViewProps> = React.memo(function ArticleView({
  product,
}) {
  const { selectedProduct, openOrder, closeOrder } = useArticleOrder();

  const allImages = useMemo(
    () => [
      ...(product.main_image_url ? [product.main_image_url] : []),
      ...(product.product_images?.map((img) => img.url) || []),
    ],
    [product]
  );

  const outOfStock = product.stock_quantity <= 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      <ArticleNavBar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <ArticleGallery images={allImages} title={product.title} />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col gap-6"
        >
          <ArticleMeta
            title={product.title}
            price={product.price}
            stock_quantity={product.stock_quantity}
            created_at={product.created_at}
            categories={product.categories}
          />

          <ArticleDescription description={product.description} />

          <ArticleAttributes attributes={product.attributes} />

          <ArticlePurchaseFooter
            outOfStock={outOfStock}
            onPurchase={() => openOrder(product)}
          />
        </motion.div>
      </div>

      {selectedProduct && (
        <OrderModal product={selectedProduct} onClose={closeOrder} />
      )}
    </div>
  );
});

ArticleView.displayName = "ArticleView";
