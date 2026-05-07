import { XCircle, CreditCard, Loader2 } from "lucide-react";
import { Form, href } from "react-router";
import type { Order } from "~/types/order";

interface PayOrderModalProps {
  order: Order;
  isSubmitting: boolean;
  error?: string;
  onClose: () => void;
}

export const PayOrderModal = ({
  order,
  isSubmitting,
  error,
  onClose,
}: PayOrderModalProps) => {
  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box bg-base-200 border border-base-content/10 rounded-2xl max-w-md">
        <h3 className="font-bold text-xl text-primary flex items-center gap-2">
          <CreditCard size={24} /> Payer la commande
        </h3>

        <p className="py-4 text-sm">
          Montant à payer :{" "}
          <span className="font-bold text-primary">{order.total_amount} €</span>
        </p>

        {error && (
          <div className="alert alert-error mb-4 shadow-lg animate-in fade-in zoom-in duration-200">
            <XCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <Form method="post" action={href("/orders")} className="space-y-4">
          <input type="hidden" name="action" value="pay" />
          <input type="hidden" name="orderId" value={order.id} />

          <div className="form-control">
            <label className="label">
              <span className="label-text">Méthode de paiement</span>
            </label>
            <select
              name="payment_method"
              className="select select-bordered"
              required
            >
              <option value="card">Carte bancaire</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Numéro de carte</span>
            </label>
            <input
              type="text"
              name="card_number"
              placeholder="1234 5678 9012 3456"
              className="input input-bordered"
              required
              pattern="[\d\s]{13,19}"
              title="Numéro de carte de 13 à 19 chiffres, espaces autorisés"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date d'expiration</span>
              </label>
              <input
                type="text"
                name="expiry_date"
                placeholder="MM/YY"
                className="input input-bordered"
                required
                pattern="\d{2}/\d{2}"
                title="Format MM/YY"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom du titulaire</span>
              </label>
              <input
                type="text"
                name="cardholder_name"
                placeholder="John Doe"
                className="input input-bordered"
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Adresse de livraison</span>
            </label>
            <textarea
              name="shipping_address"
              placeholder="Entrez votre adresse de livraison"
              className="textarea textarea-bordered"
              rows={3}
            />
            <label className="label">
              <span className="label-text-alt text-xs opacity-60">
                Laissez vide pour utiliser l'adresse de votre profil
              </span>
            </label>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary min-w-35 ${
                isSubmitting ? "btn-disabled" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Payer maintenant"
              )}
            </button>
          </div>
        </Form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} disabled={isSubmitting}>
          Fermer
        </button>
      </form>
    </dialog>
  );
};
