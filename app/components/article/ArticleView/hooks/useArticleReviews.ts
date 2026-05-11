import { useFetcher } from "react-router";

export function useArticleReviews() {
  const fetcher = useFetcher<{ success: boolean; message?: string; intent?: string }>();
  const isSubmitting = fetcher.state !== "idle";

  const submitReview = (rating: number, comment: string) => {
    fetcher.submit(
      { intent: "review", rating: String(rating), comment },
      { method: "post" }
    );
  };

  const deleteReview = () => {
    fetcher.submit({ intent: "delete_review" }, { method: "post" });
  };

  return { submitReview, deleteReview, isSubmitting, result: fetcher.data };
}