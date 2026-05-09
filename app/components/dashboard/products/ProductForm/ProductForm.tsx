import { StatusMessage } from "~/components/shared/StatusMessage";
import { ProductFormFields } from "../ProductFormFields";
import { ProductFormHeader } from "./ProductFormHeader";
import { useProductForm } from "./hooks/useProductForm";
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

export function ProductForm({ actionData, initialData, categories }: ProductFormProps) {
  const {
    isEdit, formRef, fileInputRef, fieldsRef,
    fetcher, isSubmitting,
    title, setTitle,
    isPublished, setIsPublished,
    previews, setPreviews,
    slug, result, handleReset,
  } = useProductForm(initialData, actionData);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <ProductFormHeader isEdit={isEdit} />

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
          setTitle={setTitle}
          slug={slug}
          isPublished={isPublished}
          setIsPublished={setIsPublished}
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