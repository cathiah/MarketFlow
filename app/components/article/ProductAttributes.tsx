import React from "react";

interface ProductAttributesProps {
  attributes: Record<string, any> | null;
}

export const ProductAttributes: React.FC<ProductAttributesProps> = ({ attributes }) => {
  if (!attributes || Object.keys(attributes).length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold uppercase opacity-30 tracking-widest">
        Caractéristiques
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(attributes).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col bg-base-200 rounded-xl px-4 py-3 border border-white/5"
          >
            <span className="text-[10px] text-base-content/40 capitalize">{key}</span>
            <span className="text-sm font-semibold">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
