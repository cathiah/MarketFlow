import React, { useCallback } from "react";
import { Trash2 } from "lucide-react";
import { InputField } from "~/components/shared/FormFields";
import type { AttributeItem } from "./hooks/useAttributes";

interface AttributeRowProps {
  attribute: AttributeItem;
  index: number;
  onUpdate: (index: number, field: keyof AttributeItem, value: string) => void;
  onRemove: (index: number) => void;
}

export const AttributeRow: React.FC<AttributeRowProps> = React.memo(function AttributeRow({
  attribute,
  index,
  onUpdate,
  onRemove,
}) {
  const handleKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onUpdate(index, "key", e.target.value),
    [index, onUpdate]
  );

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onUpdate(index, "value", e.target.value),
    [index, onUpdate]
  );

  const handleRemove = useCallback(() => onRemove(index), [index, onRemove]);

  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-5">
        <InputField
          label="Clé"
          name="attribute_key"
          value={attribute.key}
          onChange={handleKeyChange}
          placeholder="Ex: taille"
        />
      </div>
      <div className="col-span-6">
        <InputField
          label="Valeur"
          name="attribute_value"
          value={attribute.value}
          onChange={handleValueChange}
          placeholder="Ex: M"
        />
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className="btn btn-square btn-sm btn-error"
        aria-label="Supprimer attribut"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
});