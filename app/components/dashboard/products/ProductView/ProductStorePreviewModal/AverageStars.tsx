import type { Review } from "~/types/reviews";
import { StarPicker } from "./StarPicker";

interface AverageStarsProps {
  reviews: Review[];
}

export function AverageStars({ reviews }: AverageStarsProps) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <div className="flex items-center gap-2">
      <StarPicker value={Math.round(avg)} readonly size={13} />
      <span className="text-xs opacity-50">
        {avg.toFixed(1)} · {reviews.length} avis
      </span>
    </div>
  );
}
