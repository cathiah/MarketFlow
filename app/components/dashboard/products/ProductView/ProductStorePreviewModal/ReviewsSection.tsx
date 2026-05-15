import { MessageSquare } from "lucide-react";
import type { Review } from "~/types/reviews";
import { ReviewCard } from "./ReviewCard";

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <div className="border-t border-base-content/5 px-6 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <MessageSquare size={14} />
          Avis clients
          {reviews.length > 0 && (
            <span className="badge badge-sm badge-neutral">{reviews.length}</span>
          )}
        </h3>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      ) : (
        <p className="text-sm text-base-content/30 text-center py-6 italic">
          Aucun avis pour l'instant.
        </p>
      )}
    </div>
  );
}
