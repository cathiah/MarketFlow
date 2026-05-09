import { useCallback } from "react";
import { Type, Link2, Euro, Hash } from "lucide-react";
import { InputField } from "~/components/shared/FormFields";
import type { Product } from "~/types/products";
import type { Category } from "~/types/category";

interface BasicInfoSectionProps {
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  categories: Category[];
  initialData?: Product;
  errors?: Record<string, string>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title, setTitle, slug, categories, initialData, errors,
}) => (
  <div className="card bg-base-200 border border-white/5 shadow-xl">
    <div className="card-body gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Nom du produit"
          icon={Type}
          name="title"
          value={title}
          required
          onChange={useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
            [setTitle]
          )}
          error={errors?.title}
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
        <InputField
          label="Prix (€)"
          icon={Euro}
          name="price"
          type="number"
          required
          step="0.01"
          defaultValue={initialData?.price}
          error={errors?.price}
        />
        <InputField
          label="Stock"
          icon={Hash}
          name="stock_quantity"
          type="number"
          required
          defaultValue={initialData?.stock_quantity}
          error={errors?.stock_quantity}
        />

        <div className="form-control w-full">
          <label className="label uppercase text-[10px] font-bold opacity-50 tracking-widest">
            Catégorie
          </label>
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
          {errors?.category_id && (
            <p className="text-error text-[10px] mt-1 font-bold">{errors.category_id}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);