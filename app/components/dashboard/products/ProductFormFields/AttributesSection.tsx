import React from "react";
import { Plus } from "lucide-react";
import { AttributeRow } from "./AttributeRow";
import type { AttributeItem } from "./hooks/useAttributes";

interface AttributesSectionProps {
  attributes: AttributeItem[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof AttributeItem, value: string) => void;
  onRemove: (index: number) => void;
}

export const AttributesSection: React.FC<AttributesSectionProps> = ({
  attributes,
  onAdd,
  onUpdate,
  onRemove,
}) => (
  <div className="card bg-base-200 border border-white/5 shadow-xl">
    <div className="card-body gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[10px] uppercase opacity-50 tracking-widest">
          Attributs dynamiques
        </h3>
        <button type="button" onClick={onAdd} className="btn btn-sm btn-outline gap-2">
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {attributes.map((attribute, index) => (
          <AttributeRow
            key={index}
            attribute={attribute}
            index={index}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  </div>
);