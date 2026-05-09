import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useFetcher } from "react-router";
import { slugify } from "../utils/slugify";
import type { Product } from "~/types/products";
import type { ProductFieldsHandle } from "../../ProductFormFields/index";

interface ActionData {
  success?: boolean;
  errors?: Record<string, string>;
}

export function useProductForm(initialData?: Product, actionData?: ActionData) {
  const isEdit = !!initialData?.id;

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fieldsRef = useRef<ProductFieldsHandle>(null);

  const fetcher = useFetcher<ActionData>();
  const isSubmitting = fetcher.state === "submitting";

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false);

  const initialPreviews = useMemo(() => {
    const images: string[] = [];
    if (initialData?.main_image_url) images.push(initialData.main_image_url);
    if (initialData?.product_images) {
      const secondary = [...initialData.product_images]
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.url);
      images.push(...secondary);
    }
    return images;
  }, [initialData]);

  const [previews, setPreviews] = useState<string[]>(initialPreviews);

  const slug = useMemo(() => slugify(title), [title]);

  const result = fetcher.data ?? actionData;

  const resetAll = useCallback(() => {
    setTitle(initialData?.title ?? "");
    setIsPublished(initialData?.is_published ?? false);
    setPreviews(initialPreviews);
    fieldsRef.current?.resetFields();
    formRef.current?.reset();
  }, [initialData, initialPreviews]);

  const handleReset = useCallback(() => {
    if (confirm("Voulez-vous vraiment annuler toutes les modifications ?")) {
      resetAll();
    }
  }, [resetAll]);

  // Reset après création réussie
  useEffect(() => {
    if (result?.success && !isEdit) resetAll();
  }, [result, isEdit, resetAll]);

  return {
    isEdit,
    formRef,
    fileInputRef,
    fieldsRef,
    fetcher,
    isSubmitting,
    title,
    setTitle: useCallback((v: string) => setTitle(v), []),
    isPublished,
    setIsPublished: useCallback((v: boolean) => setIsPublished(v), []),
    previews,
    setPreviews,
    slug,
    result,
    handleReset,
  };
}