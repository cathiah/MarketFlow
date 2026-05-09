import { Trash2, AlertTriangle } from "lucide-react";
import type { Product } from "~/types/products";

interface DeleteProductModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isSubmitting: boolean;
}

export function DeleteProductModal({ 
  product, 
  onClose, 
  onConfirm, 
  isSubmitting 
}: DeleteProductModalProps) {
  
  if (!product) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-base-200 border border-base-content/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-error/10 text-error p-2 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <h3 className="font-black text-lg text-white">Supprimer la produit</h3>
        </div>

        {/* Corps */}
        <p className="text-base-content/60 text-sm mt-3">
          Êtes-vous sûr de vouloir supprimer la produit{" "}
          <span className="text-white font-semibold">"{product.title}"</span> ? 
          Cette action est irréversible.
        </p>

        {/* Actions */}
        <div className="modal-action mt-6 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm rounded-xl"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          
          <button
            type="button"
            onClick={() => onConfirm(product.id)}
            disabled={isSubmitting}
            className="btn btn-error btn-sm rounded-xl min-w-27.5"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <Trash2 size={15} />
                Confirmer
              </>
            )}
          </button>
        </div>
      </div>

      <div 
        className="modal-backdrop bg-black/60 backdrop-blur-sm" 
        onClick={!isSubmitting ? onClose : undefined}
      >
        <button className="cursor-default">Fermer</button>
      </div>
    </dialog>
  );
}
