import { useState, useCallback, useMemo } from "react";
import type { Product } from "~/types/products";

export interface AttributeItem {
  key: string;
  value: string;
}

export function useAttributes(initialData?: Product) {
  const initialAttributes = useMemo<AttributeItem[]>(() => {
    if (!initialData?.attributes) return [{ key: "", value: "" }];
    const attrs = Object.entries(initialData.attributes).map(([key, value]) => ({
      key,
      value: String(value),
    }));
    return attrs.length > 0 ? attrs : [{ key: "", value: "" }];
  }, [initialData]);

  const [attributes, setAttributes] = useState<AttributeItem[]>(initialAttributes);

  const reset = useCallback(() => setAttributes(initialAttributes), [initialAttributes]);

  const add = useCallback(() => {
    setAttributes((prev) => [...prev, { key: "", value: "" }]);
  }, []);

  const update = useCallback((index: number, field: keyof AttributeItem, value: string) => {
    setAttributes((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  }, []);

  const remove = useCallback((index: number) => {
    setAttributes((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  return { attributes, reset, add, update, remove };
}