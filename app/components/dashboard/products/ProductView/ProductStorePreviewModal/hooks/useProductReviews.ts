import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { normalizeReview, type Review, type RawReview } from "~/types/reviews";

interface UseProductReviewsOptions {
  productId: string;
  initialReviews: Review[];
}

export function useProductReviews({ productId, initialReviews }: UseProductReviewsOptions) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const fetcher = useFetcher<{ review: RawReview }>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.review) {
      const saved = normalizeReview(fetcher.data.review);
      setReviews((prev) => {
        const exists = prev.some((r) => r.id === saved.id);
        return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev];
      });
    }
  }, [fetcher.state, fetcher.data]);

  const submitReview = (rating: number, comment: string) => {
    if (rating === 0) return;
    fetcher.submit(
      { productId, rating: String(rating), comment },
      { method: "POST", action: "/dashboard/products/api/review" }
    );
  };

  return { reviews, submitReview, isSubmitting: fetcher.state !== "idle" };
}
