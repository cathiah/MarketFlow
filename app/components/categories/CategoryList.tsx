import { useRef, useState } from "react";
import { Link, href, useFetcher } from "react-router";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import type { CategoryWithParent } from "~/routes/dashboard/categories/categories.server";

interface CategoryListProps {
  categories: CategoryWithParent[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const fetcher = useFetcher();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [targetCategory, setTargetCategory] = useState<CategoryWithParent | null>(null);

  const openModal = (cat: CategoryWithParent) => {
    setTargetCategory(cat);
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
    setTargetCategory(null);
  };

  const handleDelete = () => {
    if (!targetCategory) return;
    fetcher.submit(
      { categoryId: targetCategory.id }, 
      { method: "DELETE", action: href("/dashboard/categories") }
    );
    closeModal();
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

      <dialog ref={modalRef} className="modal">
        <div className="modal-box bg-base-200 border border-base-content/10 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-error/10 text-error p-2 rounded-xl">
              <Trash2 size={20} />
            </div>
            <h3 className="font-black text-lg text-white">Supprimer la catégorie</h3>
          </div>

          <p className="text-base-content/60 text-sm mt-3">
            Êtes-vous sûr de vouloir supprimer la catégorie{" "}
            <span className="text-white font-semibold">
              {targetCategory?.name}
            </span>{" "}
            ? Cette action est irréversible.
          </p>

          <div className="modal-action mt-6">
            <button onClick={closeModal} className="btn btn-ghost btn-sm rounded-xl">
              Annuler
            </button>
            <button onClick={handleDelete} className="btn btn-error btn-sm rounded-xl">
              <Trash2 size={15} />
              Confirmer
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>Fermer</button>
        </form>
      </dialog>
    </div>
  );
}
