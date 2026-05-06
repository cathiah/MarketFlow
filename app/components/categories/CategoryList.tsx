import { useState } from "react";
import { Link, href, useFetcher } from "react-router";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import type { CategoryWithParent } from "~/routes/dashboard/categories/categories.server";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

interface CategoryListProps {
  categories: CategoryWithParent[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const fetcher = useFetcher();
  const [targetCategory, setTargetCategory] = useState<CategoryWithParent | null>(null);

  const openModal = (cat: CategoryWithParent) => {
    setTargetCategory(cat);
  };

  const closeModal = () => {
    setTargetCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Tag /> Catégories
        </h1>
        <Link to={href("/dashboard/categories/add")} className="btn btn-secondary btn-sm">
          <Plus size={16} /> Ajouter
        </Link>
      </div>

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="text-center p-10 opacity-50 font-medium">
            Aucune catégorie trouvée.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="card bg-base-200 border border-white/5 shadow-sm">
              <div className="card-body p-4 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{cat.name}</h3>
                    {cat.parent && (
                      <div className="badge badge-outline badge-xs opacity-70 flex gap-1 items-center py-2">
                         <span className="text-[10px] uppercase font-bold tracking-tighter">Parent:</span>
                         {cat.parent.name}
                      </div>
                    )}
                  </div>
                  <p className="text-xs opacity-50 font-mono mt-1">{cat.slug}</p>
                </div>

                <div className="flex gap-2">
                  <Link 
                    to={href("/dashboard/categories/:slug/edit", { slug: cat.slug })} 
                    className="btn btn-square btn-ghost btn-sm hover:btn-primary"
                  >
                    <Edit size={16} />
                  </Link>
                  <button 
                    onClick={() => openModal(cat)}
                    className="btn btn-square btn-ghost btn-sm text-base-content/50 hover:text-white hover:btn-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteCategoryModal 
        category={targetCategory} 
        onClose={closeModal} 
        fetcher={fetcher} 
      />
    </div>
  );
}
