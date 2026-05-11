import { useState } from "react";
import { useFetcher } from "react-router";

interface UseArticleLikeProps {
  initialLiked: boolean;
  initialCount: number;
  userId: string | null;
}

export function useArticleLike({ initialLiked, initialCount, userId }: UseArticleLikeProps) {
  const fetcher = useFetcher();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const toggle = () => {
    if (!userId) return; // non connecté → rien

    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));

    fetcher.submit(
      { intent: next ? "like" : "unlike" },
      { method: "post" }
    );
  };

  return { liked, count, toggle, isDisabled: !userId };
}