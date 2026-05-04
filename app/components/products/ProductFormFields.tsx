import React, { useEffect, useState, useImperativeHandle, forwardRef, useCallback, useMemo } from "react";
import { Type, Link2, Euro, Hash, FileText, ImageIcon, X } from "lucide-react";
import { InputField, TextAreaField, PublishToggle, FormActions } from "../shared/FormFields";
import type { Product } from "~/types/products";
import type { Category } from "~/types/category";

interface ProductFormFieldsProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
  previews: string[];
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
  categories: Category[];
  initialData?: Product;
  actionData?: { errors?: Record<string, string> };
  isSubmitting: boolean;
  isEdit: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface ProductFieldsHandle {
  resetImages: () => void;
}

export const ProductFormFields = forwardRef<ProductFieldsHandle, ProductFormFieldsProps>((props, ref) => {
  const {
    title, setTitle, slug, isPublished, setIsPublished, previews, setPreviews,
    categories, initialData, actionData, isSubmitting, isEdit, fileInputRef
  } = props;

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const existingImagesInitial = useMemo(() => {
    const images: string[] = [];
    if (initialData?.main_image_url) images.push(initialData.main_image_url);
    if (initialData?.product_images) {
      const secondary = [...initialData.product_images]
        .sort((a, b) => a.display_order - b.display_order)
        .map(img => img.url);
      images.push(...secondary);
    }
    return images;
  }, [initialData]);

  const [existingImages, setExistingImages] = useState<string[]>(existingImagesInitial);

  const resetImages = useCallback(() => {
    setExistingImages(existingImagesInitial);
    setPreviews(existingImagesInitial);
    setNewFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [existingImagesInitial, setPreviews, fileInputRef]);

  useImperativeHandle(ref, () => ({
    resetImages
  }), [resetImages]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newUrls = filesArray.map(file => URL.createObjectURL(file));

      setNewFiles(prev => [...prev, ...filesArray]);
      setPreviews(prev => [...prev, ...newUrls]);
    }
  }, [setPreviews]);

  const removeImage = useCallback((indexToRemove: number) => {
    const urlToRemove = previews[indexToRemove];
    setPreviews(prev => prev.filter((_, i) => i !== indexToRemove));

    if (existingImages.includes(urlToRemove)) {
      setExistingImages(prev => prev.filter(url => url !== urlToRemove));
    } else {
      const relativeIdx = indexToRemove - existingImages.length;
      setNewFiles(prev => prev.filter((_, i) => i !== relativeIdx));
    }
  }, [previews, existingImages]);

  useEffect(() => {
    resetImages();
  }, [initialData, resetImages]);

  useEffect(() => {
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  }, [newFiles, fileInputRef]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {isEdit && <input type="hidden" name="id" value={initialData?.id} />}
      
      <div className="lg:col-span-2 space-y-6">
        <div className="card bg-base-200 border border-white/5 shadow-xl">
          <div className="card-body gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Nom de la produit" 
                icon={Type} 
                name="title" 
                value={title}
                required 
                onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value), [setTitle])} 
                error={actionData?.errors?.title} 
              />
              <InputField 
                label="Lien (automatique)" 
                icon={Link2} 
                value={slug} 
                readOnly 
                className="bg-base-300 opacity-60 cursor-not-allowed" 
              />
              <input type="hidden" name="slug" value={slug} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Prix (€)" icon={Euro} name="price" type="number" required step="0.01" defaultValue={initialData?.price} error={actionData?.errors?.price} />
              <InputField label="Stock" icon={Hash} name="stock_quantity" type="number" required defaultValue={initialData?.stock_quantity} error={actionData?.errors?.stock_quantity} />
              
              <div className="form-control w-full">
                <label className="label uppercase text-[10px] font-bold opacity-50 tracking-widest">Catégorie</label>
                <select 
                  name="category_id" 
                  className="select select-bordered" 
                  defaultValue={initialData?.category_id || ""}
                >
                  <option value="" disabled>Choisir...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {actionData?.errors?.category_id && (
                  <p className="text-error text-[10px] mt-1 font-bold">{actionData.errors.category_id}</p>
                )}
              </div>
            </div>

            <TextAreaField 
              label="Description" 
              icon={FileText} 
              name="description" 
              defaultValue={initialData?.description || ""} 
              rows={8} 
              error={actionData?.errors?.description}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* GALERIE PHOTOS */}
        <div className="card bg-base-200 border border-white/5 shadow-xl">
          <div className="card-body">
            <h3 className="font-bold text-[10px] uppercase opacity-50 mb-2">Galerie Photos</h3>
            
            {existingImages.map((url, i) => (
              <input key={i} type="hidden" name="keep_images" value={url} />
            ))}
            
            <div className="grid grid-cols-2 gap-2">
              {previews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg border border-white/10 bg-base-300 overflow-hidden group">
                  <img src={src} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)} 
                    className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary text-[8px] text-center font-bold text-primary-content uppercase py-0.5">
                      Principale
                    </span>
                  )}
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="btn btn-outline border-dashed aspect-square h-full flex flex-col gap-1 border-white/20 hover:border-primary transition-colors"
              >
                <ImageIcon size={18} className="opacity-30" />
                <span className="text-[9px]">Ajouter</span>
              </button>
            </div>
            
            <input 
              ref={fileInputRef} 
              type="file" 
              name="images" 
              multiple 
              className="hidden" 
              onChange={handleFileChange} 
              accept="image/*" 
            />
          </div>
        </div>

        {/* STATUT ET ACTIONS */}
        <div className="card bg-base-200 border border-white/5 shadow-xl">
          <div className="card-body gap-6">
            <PublishToggle isPublished={isPublished} onChange={setIsPublished} />
            <input type="hidden" name="is_published" value={isPublished ? "on" : "off"} />
            
            <FormActions 
              isSubmitting={isSubmitting} 
              isPublished={isPublished} 
              submitLabel={isEdit ? "Mettre à jour" : "Mettre en vente"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ProductFormFields.displayName = "ProductFormFields";
