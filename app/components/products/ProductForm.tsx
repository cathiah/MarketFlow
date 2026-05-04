import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { useFetcher, Link, href } from "react-router";
import { Save, PlusCircle, ArrowLeft } from "lucide-react";
import { StatusMessage } from "../shared/StatusMessage";
import { slugify } from "~/utils/slugify";
import { ProductFormFields } from "./ProductFormFields";
import type { Product } from "~/types/products";
import type { Category } from "~/types/category";

interface ActionData {
  success?: boolean;
  errors?: Record<string, string>;
}

interface ProductFormProps {
  actionData?: ActionData;
  initialData?: Product;
  categories: Category[];
}

export interface ProductFieldsHandle {
  resetImages: () => void;
}

export function ProductForm({ actionData, initialData, categories }: ProductFormProps) {
  const isEdit = !!initialData?.id;
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<ActionData>();
  const isSubmitting = fetcher.state === "submitting";
  
  const fieldsRef = useRef<ProductFieldsHandle>(null);
  
  const [title, setTitle] = useState(initialData?.title || "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);
  
  const initialPreviews = useMemo(() => {
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

  const [previews, setPreviews] = useState<string[]>(initialPreviews);

  const slug = useMemo(() => slugify(title), [title]);
  
  const handleReset = useCallback(() => {
    if (confirm("Voulez-vous vraiment annuler toutes les modifications ?")) {
      setTitle(initialData?.title || "");
      setIsPublished(initialData?.is_published || false);
      setPreviews(initialPreviews);
      fieldsRef.current?.resetImages();
      formRef.current?.reset();
    }
  }, [initialData, initialPreviews]);

  const result = fetcher.data ?? actionData;

  useEffect(() => {
    if (result?.success && !isEdit) {
      setTitle("");
      setIsPublished(false);
      setPreviews([]);
      formRef.current?.reset();
    }
  }, [result, isEdit]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <Link 
            to={href("/dashboard/products")}
            className="btn btn-link btn-xs pl-0 no-underline opacity-50 hover:opacity-100 flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Retour
          </Link>
          <h1 className="text-2xl font-black mt-1 flex items-center gap-2">
            {isEdit ? (
              <>
                <Save className="text-secondary" size={24} /> Editer l'offre
              </>
            ) : (
              <>
                <PlusCircle className="text-primary" size={24} /> Nouvelle annonce
              </>
            )}
          </h1>
        </div>
      </div>

      {result?.errors?.form && (
        <StatusMessage type="error" message={result.errors.form} />
      )}

      <fetcher.Form 
        ref={formRef} 
        method="post" 
        onReset={handleReset} 
        encType="multipart/form-data"
        className="space-y-8"
      >
        <ProductFormFields 
          ref={fieldsRef}
          title={title} 
          setTitle={useCallback((v: string) => setTitle(v), [])}
          slug={slug}
          isPublished={isPublished} 
          setIsPublished={useCallback((v: boolean) => setIsPublished(v), [])}
          previews={previews} 
          setPreviews={setPreviews}
          categories={categories}
          initialData={initialData}
          actionData={result}
          isSubmitting={isSubmitting}
          isEdit={isEdit}
          fileInputRef={fileInputRef}
        />
      </fetcher.Form>
    </div>
  );
}
