import React, {
  useState, useEffect, useImperativeHandle, forwardRef,
} from "react";
import type { Product } from "~/types/products";
import type { Category } from "~/types/category";
import { useAttributes } from "./hooks/useAttributes";
import { useImageGallery } from "./hooks/useImageGallery";
import { BasicInfoSection } from "./BasicInfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { AttributesSection } from "./AttributesSection";
import { ImageGallerySection } from "./ImageGallerySection";
import { PublishSection } from "./PublishSection";

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
  resetFields: () => void;
}

export const ProductFormFields = forwardRef<ProductFieldsHandle, ProductFormFieldsProps>(
  (props, ref) => {
    const {
      title, setTitle, slug, isPublished, setIsPublished,
      previews, setPreviews, categories, initialData,
      actionData, isSubmitting, isEdit, fileInputRef,
    } = props;

    const attrs = useAttributes(initialData);
    const gallery = useImageGallery(initialData, setPreviews, fileInputRef);

    const resetFields = () => {
      attrs.reset();
      gallery.reset();
    };

    useImperativeHandle(ref, () => ({ resetFields }), [attrs.reset, gallery.reset]);

    useEffect(() => { resetFields(); }, [initialData]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isEdit && <input type="hidden" name="id" value={initialData?.id} />}

        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection
            title={title}
            setTitle={setTitle}
            slug={slug}
            categories={categories}
            initialData={initialData}
            errors={actionData?.errors}
          />
          <DescriptionSection
            initialData={initialData}
            error={actionData?.errors?.description}
          />
          <AttributesSection
            attributes={attrs.attributes}
            onAdd={attrs.add}
            onUpdate={attrs.update}
            onRemove={attrs.remove}
          />
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          <ImageGallerySection
            previews={previews}
            existingImages={gallery.existingImages}
            fileInputRef={fileInputRef}
            onFileChange={gallery.handleFileChange}
            onRemove={(idx) => gallery.removeImage(idx, previews)}
          />
          <PublishSection
            isPublished={isPublished}
            setIsPublished={setIsPublished}
            isSubmitting={isSubmitting}
            isEdit={isEdit}
          />
        </div>
      </div>
    );
  }
);

ProductFormFields.displayName = "ProductFormFields";