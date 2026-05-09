import React from "react";
import { motion } from "framer-motion";
import { ProductNavBar } from "./ProductNavBar";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductMeta } from "./ProductMeta";
import { ProductDescription } from "./ProductDescription";
import { ProductAttributes } from "./ProductAttributes";
import { ProductStatusFooter } from "./ProductStatusFooter";
import { useProductImages } from "./hooks/useProductImages";
import type { Product } from "~/types/products";

interface ProductViewProps {
  product: Product;
}

export const ProductView: React.FC<ProductViewProps> = React.memo(function ProductView({
  product,
}) {
  const { allImages, currentIndex, setCurrentIndex, nextImage, prevImage } =
    useProductImages(product);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      <ProductNavBar product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductImageGallery
          images={allImages}
          currentIndex={currentIndex}
          title={product.title}
          onNext={nextImage}
          onPrev={prevImage}
          onSelect={setCurrentIndex}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col"
        >
          <div className="space-y-4 flex-1">
            <ProductMeta
              title={product.title}
              price={product.price}
              stock_quantity={product.stock_quantity}
              created_at={product.created_at}
              categories={product.categories}
            />
            <ProductDescription description={product.description} />
            <ProductAttributes attributes={product.attributes} />
          </div>

          <ProductStatusFooter
            isPublished={product.is_published}
            product={product}
            images={allImages}
            currentIndex={currentIndex}
            onNext={nextImage}
            onPrev={prevImage}
            onSelect={setCurrentIndex}
          />
        </motion.div>
      </div>
    </div>
  );
});