import { useState, useCallback } from "react";
import { useFetcher } from "react-router";

interface UseProductLikeOptions {
  productId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
}

export function useProductLike({ productId, initialIsLiked, initialLikeCount }: UseProductLikeOptions) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const fetcher = useFetcher();

  const handleLike = useCallback(() => {
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    fetcher.submit(
      { productId, action: next ? "like" : "unlike" },
      { method: "POST", action: "/dashboard/products/api/like" }
    );
  }, [isLiked, productId, fetcher]);

  return { isLiked, likeCount, handleLike };
}
