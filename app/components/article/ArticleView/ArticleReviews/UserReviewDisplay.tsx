import { Pencil, Trash2 } from "lucide-react";
import { StarDisplay } from "./StarDisplay";

interface UserReviewDisplayProps {
  rating: number;
  comment: string | null;
  isSubmitting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function UserReviewDisplay({
  rating,
  comment,
  isSubmitting,
  onEdit,
  onDelete,
}: UserReviewDisplayProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Mon avis</p>
      <StarDisplay rating={rating} size={14} />
      {comment && (
        <p className="text-sm text-base-content/70">{comment}</p>
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={onEdit} className="btn btn-ghost btn-xs gap-1">
          <Pencil size={12} /> Modifier
        </button>
        <button
          onClick={onDelete}
          disabled={isSubmitting}
          className="btn btn-ghost btn-xs gap-1 text-error hover:bg-error/10"
        >
          <Trash2 size={12} /> Supprimer
        </button>
      </div>
    </div>
  );
}
