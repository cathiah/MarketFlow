import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Form, href, Link, useNavigation } from "react-router";
import { 
  FolderTree, Type, Link2, Save, PlusCircle, 
  ArrowLeft
} from "lucide-react";
import { StatusMessage } from "~/components/shared/StatusMessage";
import { slugify } from "~/utils/slugify";
import { InputField, FormActions } from "~/components/shared/FormFields";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
}

interface CategoryFormProps {
  actionData?: { 
    success?: boolean; 
    errors?: Record<string, string>;
    error?: string;
  };
  initialData?: Category;
  categories: { id: string; name: string }[];
}

export const CategoryForm: React.FC<CategoryFormProps> = React.memo(function CategoryForm({ actionData, initialData, categories = [] }) {
  const isEdit = !!initialData?.id;
  const formRef = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  const [name, setName] = useState(initialData?.name || "");
  const slug = useMemo(() => slugify(name), [name]);

  const handleReset = useCallback(() => setName(initialData?.name || ""), [initialData]);

  useEffect(() => {
    if (actionData?.success && !isEdit) {
      setName("");
      formRef.current?.reset();
    }
  }, [actionData, isEdit]);

  const errorMessage = actionData?.errors?.form || (actionData as any)?.error;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <Link to={href("/dashboard/categories")} className="btn btn-link btn-xs pl-0 no-underline opacity-50 hover:opacity-100">
          <ArrowLeft size={14} /> Retour
        </Link>
        <h1 className="text-2xl font-black mt-1 flex items-center gap-2">
          {isEdit ? <Save className="text-secondary" /> : <PlusCircle className="text-primary" />}
          {isEdit ? "Editer la catégorie" : "Nouvelle catégorie"}
        </h1>
      </div>

      {errorMessage && <StatusMessage type="error" message={errorMessage} />}

      <Form 
        ref={formRef} 
        method="post" 
        onReset={handleReset}
        className="card bg-base-200 border border-white/5 shadow-xl"
      >
        <div className="card-body gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nom de la catégorie"
              icon={Type}
              name="name"
              required
              value={name}
              placeholder="Ex: Électronique"
              onChange={(e) => setName(e.target.value)}
              error={actionData?.errors?.name}
            />
            <InputField
              label="Lien (automatique)"
              icon={Link2}
              value={slug}
              readOnly
              className="bg-base-300 opacity-60"
            />
            <input type="hidden" name="slug" value={slug} />
          </div>

          <div className="form-control">
            <label className="label uppercase text-[10px] font-bold opacity-50 tracking-widest">
              <span className="flex items-center gap-2"><FolderTree size={12}/> Catégorie Parente</span>
            </label>
            <select 
              name="parent_id" 
              className="select select-bordered w-full" 
              defaultValue={initialData?.parent_id || ""}
            >
              <option value="">Aucune (Catégorie racine)</option>
              {Array.isArray(categories) && categories
                .filter(c => c.id !== initialData?.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              }
            </select>
          </div>

          <div className="divider opacity-5 my-2"></div>

          <div className="flex flex-col items-end gap-3">
            <FormActions 
              isSubmitting={isSubmitting} 
              isPublished={true} 
              submitLabel={isEdit ? "Mettre à jour" : "Créer la catégorie"} 
            />
          </div>
        </div>
      </Form>
    </div>
  );
});
