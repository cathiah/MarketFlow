import { useState, useCallback } from "react";
import type { Product } from "~/types/products";

interface UseArticleOrderReturn {
  selectedProduct: Product | null;
  openOrder: (product: Product) => void;
  closeOrder: () => void;
}

export function useArticleOrder(): UseArticleOrderReturn {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openOrder = useCallback((product: Product) => setSelectedProduct(product), []);
  const closeOrder = useCallback(() => setSelectedProduct(null), []);

  return { selectedProduct, openOrder, closeOrder };
}
