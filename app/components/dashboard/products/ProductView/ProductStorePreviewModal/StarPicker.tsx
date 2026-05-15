import { useState } from "react";
import { Star } from "lucide-react";

interface StarPickerProps {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarPicker({ value, onChange, size = 20, readonly = false }: StarPickerProps) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(i)}
          onMouseEnter={() => !readonly && setHovered(i)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            size={size}
            className={
              i <= (hovered || value)
                ? "text-warning fill-warning"
                : "text-base-content/20"
            }
          />
        </button>
      ))}
    </div>
  );
}
