import { Avatar } from "~/components/shared/Avatar";
import { StarDisplay } from "./StarDisplay";
import { getReviewProfile, type Review } from "~/types/reviews";

interface ReviewCardProps {
  review: Omit<Review, "product_id" | "user_id">;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const profile = getReviewProfile(review);
  return (
    <div className="p-4 rounded-xl bg-base-200/50 border border-white/5 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar
            avatarPath={profile?.avatar_url}
            username={profile?.username}
            size={28}
          />
          <span className="text-xs font-bold opacity-70">
            {profile?.username ?? "Utilisateur"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StarDisplay rating={review.rating} size={11} />
          <span className="text-[10px] opacity-25">
            {new Date(review.created_at).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-base-content/60 leading-relaxed pl-9">
          {review.comment}
        </p>
      )}
    </div>
  );
}
