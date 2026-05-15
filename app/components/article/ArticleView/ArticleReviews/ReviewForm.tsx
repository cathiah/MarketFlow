import { Send } from "lucide-react";
import { StarPicker } from "./StarPicker";

interface ReviewFormProps {
  rating: number;
  comment: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onRatingChange: (v: number) => void;
  onCommentChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

export function ReviewForm({
  rating,
  comment,
  isEditing,
  isSubmitting,
  onRatingChange,
  onCommentChange,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-xs font-bold opacity-50 uppercase tracking-widest">
        {isEditing ? "Modifier mon avis" : "Laisser un avis"}
      </p>
      <StarPicker value={rating} onChange={onRatingChange} />
      <textarea
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
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
        {isEditing && onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
