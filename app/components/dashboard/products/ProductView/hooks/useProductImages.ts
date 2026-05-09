import { useState, useMemo, useCallback } from "react";
import type { Product } from "~/types/products";

interface UseProductImagesReturn {
  allImages: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  nextImage: () => void;
  prevImage: () => void;
}

export function useProductImages(product: Product): UseProductImagesReturn {
  const allImages = useMemo(
    () => [
      ...(product.main_image_url ? [product.main_image_url] : []),
      ...(product.product_images?.map((img) => img.url) || []),
    ],
    [product.main_image_url, product.product_images]
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const total = Math.max(allImages.length, 1);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  return { allImages, currentIndex, setCurrentIndex, nextImage, prevImage };
}
