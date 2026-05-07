import { XCircle, Trash2, Loader2 } from "lucide-react";
import { Form, href } from "react-router";
import type { Order } from "~/types/order";

interface DeleteOrderModalProps {
  order: Order;
  isSubmitting: boolean;
  error?: string;
  onClose: () => void;
}

export const DeleteOrderModal = ({
  order,
  isSubmitting,
  error,
  onClose,
}: DeleteOrderModalProps) => {
  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box bg-base-200 border border-base-content/10 rounded-2xl">
        <h3 className="font-bold text-xl flex items-center gap-2 text-error">
          <Trash2 size={24} />
          Supprimer la commande
        </h3>

        <div className="py-4 space-y-2">
          <p className="text-base">
            Êtes-vous sûr de vouloir supprimer cette commande ?
          </p>
          <p className="text-xs text-base-content/50 italic">
            Commande #{order.id.slice(0, 8)} — {order.total_amount} €
          </p>
          {order.status === "paid" && (
            <p className="text-xs text-warning">
              ⚠ Le stock des articles sera restauré automatiquement.
            </p>
          )}
        </div>

        {error && (
          <div className="alert alert-error mb-4 shadow-lg animate-in fade-in zoom-in duration-200">
            <XCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            type="button"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <Form method="post" action={href("/orders")}>
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-error min-w-35 ${isSubmitting ? "btn-disabled" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Supprimer"
              )}
            </button>
          </Form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} disabled={isSubmitting}>
          Fermer
        </button>
      </form>
    </dialog>
  );
};
