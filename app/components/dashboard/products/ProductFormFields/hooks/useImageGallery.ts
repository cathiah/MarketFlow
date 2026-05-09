import { useState, useCallback, useMemo, useEffect } from "react";
import type { Product } from "~/types/products";

export function useImageGallery(
  initialData: Product | undefined,
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
  fileInputRef: React.RefObject<HTMLInputElement | null>
) {
  const existingImagesInitial = useMemo(() => {
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

  const [existingImages, setExistingImages] = useState<string[]>(existingImagesInitial);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const reset = useCallback(() => {
    setExistingImages(existingImagesInitial);
    setPreviews(existingImagesInitial);
    setNewFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [existingImagesInitial, setPreviews, fileInputRef]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map((file) => URL.createObjectURL(file));
      setNewFiles((prev) => [...prev, ...filesArray]);
      setPreviews((prev) => [...prev, ...newUrls]);
    },
    [setPreviews]
  );

  const removeImage = useCallback(
    (indexToRemove: number, previews: string[]) => {
      const urlToRemove = previews[indexToRemove];
      setPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));

      if (existingImages.includes(urlToRemove)) {
        setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
      } else {
        const relativeIdx = indexToRemove - existingImages.length;
        setNewFiles((prev) => prev.filter((_, i) => i !== relativeIdx));
      }
    },
    [existingImages, setPreviews]
  );

  useEffect(() => {
    if (!fileInputRef.current) return;
    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));
    fileInputRef.current.files = dataTransfer.files;
  }, [newFiles, fileInputRef]);

  return { existingImages, handleFileChange, removeImage, reset };
}