import { useState, useCallback } from "react";
import { useFetcher, href } from "react-router";
import type { Product } from "~/types/products";

interface UseDeleteProductReturn {
  targetProduct: Product | null;
  isSubmitting: boolean;
  requestDelete: (product: Product) => void;
  confirmDelete: (productId: string) => void;
  cancelDelete: () => void;
}

export function useDeleteProduct(): UseDeleteProductReturn {
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const deleteFetcher = useFetcher();

  const requestDelete = useCallback((product: Product) => {
    setTargetProduct(product);
  }, []);

  const confirmDelete = useCallback(
    (productId: string) => {
      deleteFetcher.submit(
        { productId },
        {
          method: "DELETE",
          action: href("/dashboard/products"),
        }
      );
      setTargetProduct(null);
    },
    [deleteFetcher]
  );

  const cancelDelete = useCallback(() => setTargetProduct(null), []);

  return {
    targetProduct,
    isSubmitting: deleteFetcher.state !== "idle",
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
