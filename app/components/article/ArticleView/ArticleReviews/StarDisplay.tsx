import { Star } from "lucide-react";

interface StarDisplayProps {
  rating: number;
  size?: number;
}

export function StarDisplay({ rating, size = 14 }: StarDisplayProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= rating ? "text-warning fill-warning" : "text-base-content/15"
          }
        />
      ))}
    </div>
  );
}
