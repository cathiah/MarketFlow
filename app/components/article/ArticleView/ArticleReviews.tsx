import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Pencil, Trash2, Send } from "lucide-react";
import { fadeInUp } from "./utils/animations";
import { useArticleReviews } from "./hooks/useArticleReviews";
import { Avatar } from "~/components/shared/Avatar";
import type { Review } from "~/types/review";
import { getReviewProfile } from "~/types/review";

interface ArticleReviewsProps {
  reviews: Review[];
  userId: string | null;
  userReview: { id: string; rating: number; comment: string | null } | null;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={22}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "text-warning fill-warning"
                : "text-base-content/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
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

        {/* Formulaire — connecté seulement */}
        {userId && (
          <div className="p-4 rounded-2xl bg-base-200 border border-white/5 space-y-3">
            {userReview && !editing ? (
              <div className="space-y-2">
                <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Mon avis</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= userReview.rating
                          ? "text-warning fill-warning"
                          : "text-base-content/15"
                      }
                    />
                  ))}
                </div>
                {userReview.comment && (
                  <p className="text-sm text-base-content/70">{userReview.comment}</p>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-ghost btn-xs gap-1"
                  >
                    <Pencil size={12} /> Modifier
                  </button>
                  <button
                    onClick={deleteReview}
                    disabled={isSubmitting}
                    className="btn btn-ghost btn-xs gap-1 text-error hover:bg-error/10"
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs font-bold opacity-50 uppercase tracking-widest">
                  {userReview ? "Modifier mon avis" : "Laisser un avis"}
                </p>
                <StarPicker value={rating} onChange={setRating} />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience (optionnel)…"
                  rows={3}
                  className="textarea textarea-bordered w-full text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="btn btn-primary btn-sm gap-2 disabled:opacity-40"
                  >
                    {isSubmitting
                      ? <span className="loading loading-spinner loading-xs" />
                      : <Send size={14} />}
                    Publier
                  </button>
                  {userReview && (
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn btn-ghost btn-sm"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Liste des avis */}
        <div className="space-y-3">
          {reviews.length === 0 && (
            <p className="text-sm opacity-30 italic text-center py-6">
              Aucun avis pour l'instant. Soyez le premier !
            </p>
          )}
          {reviews.map((review) => {
            const profile = getReviewProfile(review);
            return (
              <div
                key={review.id}
                className="p-4 rounded-xl bg-base-200/50 border border-white/5 space-y-2"
              >
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
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          className={
                            s <= review.rating
                              ? "text-warning fill-warning"
                              : "text-base-content/15"
                          }
                        />
                      ))}
                    </div>
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
          })}
        </div>
      </motion.div>
    );
  }
);