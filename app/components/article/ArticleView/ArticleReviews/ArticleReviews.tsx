import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../utils/animations";
import { useArticleReviews } from "../hooks/useArticleReviews";
import { ReviewForm } from "./ReviewForm";
import { ReviewCard } from "./ReviewCard";
import { UserReviewDisplay } from "./UserReviewDisplay";
import type { Review } from "~/types/reviews";

interface ArticleReviewsProps {
  reviews: Omit<Review, "product_id" | "user_id">[];
  userId: string | null;
  userReview: { id: string; rating: number; comment: string | null } | null;
}

export const ArticleReviews: React.FC<ArticleReviewsProps> = React.memo(
  function ArticleReviews({ reviews, userId, userReview }) {
    const { submitReview, deleteReview, isSubmitting } = useArticleReviews();
    const [rating, setRating] = useState(userReview?.rating ?? 0);
    const [comment, setComment] = useState(userReview?.comment ?? "");
    const [editing, setEditing] = useState(!userReview);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0) return;
      submitReview(rating, comment);
      setEditing(false);
    };

    return (
      <motion.div variants={fadeInUp} className="space-y-6 pt-4">
        <h3 className="text-[10px] font-bold uppercase opacity-30 tracking-widest">
          Avis clients ({reviews.length})
        </h3>

        {userId && (
          <div className="p-4 rounded-2xl bg-base-200 border border-white/5 space-y-3">
            {userReview && !editing ? (
              <UserReviewDisplay
                rating={userReview.rating}
                comment={userReview.comment}
                isSubmitting={isSubmitting}
                onEdit={() => setEditing(true)}
                onDelete={deleteReview}
              />
            ) : (
              <ReviewForm
                rating={rating}
                comment={comment}
                isEditing={!!userReview}
                isSubmitting={isSubmitting}
                onRatingChange={setRating}
                onCommentChange={setComment}
                onSubmit={handleSubmit}
                onCancel={userReview ? () => setEditing(false) : undefined}
              />
            )}
          </div>
        )}

        <div className="space-y-3">
          {reviews.length === 0 && (
            <p className="text-sm opacity-30 italic text-center py-6">
              Aucun avis pour l'instant. Soyez le premier !
            </p>
          )}
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </motion.div>
    );
  }
);
