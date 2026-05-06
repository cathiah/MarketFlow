import React, { useEffect, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { href } from "react-router";
import type { Category } from "~/types/category";
import type { FetcherWithComponents } from "react-router";

interface ActionResponse {
  success: boolean;
  errors?: Record<string, string>;
}

interface DeleteModalProps {
  category: Category | null;
  onClose: () => void;
  fetcher: FetcherWithComponents<ActionResponse>;
}

export const DeleteCategoryModal: React.FC<DeleteModalProps> = React.memo(function DeleteCategoryModal({ category, onClose, fetcher }) {
  const deleteResult = useMemo(() => fetcher.data, [fetcher.data]);
  const isDeleting = useMemo(() => fetcher.state !== "idle", [fetcher.state]);

  useEffect(() => {
    if (fetcher.state === "idle" && deleteResult?.success) {
      onClose();
    }
  }, [fetcher.state, deleteResult, onClose]);

  if (!category) return null;

  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box border border-neutral shadow-2xl"> 
        <h3 className="font-bold text-xl text-error flex items-center gap-2">
          <Trash2 size={24} /> Supprimer la catégorie
        </h3>
        
        <p className="py-4 text-lg">
          Voulez-vous vraiment supprimer <span className="font-bold text-primary">"{category.name}"</span> ?
          <br />
          <span className="text-xs text-error/70 italic mt-2 block">
            Note : Cela pourrait affecter les produits liés.
          </span>
        </p>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={onClose} 
            type="button"
            disabled={isDeleting}
          >
            Annuler
          </button>
          
          <fetcher.Form method="post" action={href("/dashboard/categories")}>
            <input type="hidden" name="id" value={category.id} />
            <button 
              type="submit"
              disabled={isDeleting}
              className="btn btn-error min-w-30"
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Confirmer"
              )}
            </button>
          </fetcher.Form>
        </div>
      </div>
    </dialog>
  );
});
