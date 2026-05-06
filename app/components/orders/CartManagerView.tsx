import type { Order } from "~/types/order";
import { CheckCircle2, XCircle, Clock, Package, BellOff, Trash2, Loader2, CreditCard } from "lucide-react";
import { Form, href, useNavigation } from "react-router";
import { useEffect, useState } from "react";

interface ActionData {
  error?: string;
}

export const CartManagerView = ({
  orders,
  actionData,
}: {
  orders: Order[];
  actionData?: ActionData;
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"order" | "payment">("order");
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isDeletePayment = deleteMode === "payment";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return {
          label: "Payée - En cours de livraison",
          class: "badge-success",
          icon: <CheckCircle2 className="w-5 h-5 text-success" />,
        };
      case "cancelled":
        return { label: "Refusée", class: "badge-error", icon: <XCircle className="w-5 h-5 text-error" /> };
      case "pending":
        return { label: "Paiement en attente", class: "badge-warning", icon: <Clock className="w-5 h-5 text-warning" /> };
      default:
        return { label: status, class: "badge-ghost", icon: <Package className="w-5 h-5 opacity-70" /> };
    }
  };

  const openDeleteModal = (order: Order) => {
    setDeleteMode("order");
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const openDeletePaymentModal = (order: Order) => {
    setDeleteMode("payment");
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const openPayModal = (order: Order) => {
    setSelectedOrder(order);
    setIsPayModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isSubmitting) return;
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
    setDeleteMode("order");
  };

  const closePayModal = () => {
    if (isSubmitting) return;
    setIsPayModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (!actionData?.error && (isDeleteModalOpen || isPayModalOpen)) {
      if (navigation.state === "idle") {
        setIsDeleteModalOpen(false);
        setIsPayModalOpen(false);
        setSelectedOrder(null);
      }
    }
  }, [orders, actionData, navigation.state]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Mon panier et mes commandes
      </h1>

      {orders.length > 0 ? (
        orders.map((order) => {
          const config = getStatusConfig(order.status);
          const isPaid = order.status === "paid";
          const isPending = order.status === "pending";
          const totalQuantity = order.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0);

          return (
            <div key={order.id} className="collapse collapse-arrow bg-base-100 shadow-sm border border-base-200">
              <input type="checkbox" />
              <div className="collapse-title flex items-center justify-between pr-10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-base-200 rounded-full">{config.icon}</div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      Commande <span className="font-mono text-xs text-secondary">#{order.id.slice(0, 8)}</span>
                    </p>
                    <p className="text-xs opacity-50">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className={`badge ${config.class} badge-sm font-medium`}>{config.label}</div>
              </div>
              <div className="collapse-content">
                <div className="pt-4 border-t border-base-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">Détails des articles</p>
                  <ul className="space-y-2">
                    {order.order_items.map((item: any, i) => (
                      <li key={i} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="opacity-80">{item.product?.title}</span>
                          <span className="text-xs opacity-60 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">{item.unit_price} € × {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-3 border-t border-dashed border-base-300 flex justify-between items-center">
                    <span className="text-sm font-semibold">Montant total</span>
                    <span className="text-lg font-bold text-primary">{order.total_amount} €</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-base-200">
                    {isPaid ? (
                      <div className="alert alert-success mb-4">
                        <Package className="w-5 h-5" />
                        <div>
                          <p className="text-sm font-semibold">Commande déjà payée</p>
                          <p className="text-xs">Statut : en cours de livraison</p>
                          <p className="text-xs">Adresse de livraison : {order.shipping_address}</p>
                        </div>
                      </div>
                    ) : isPending ? (
                      <div className="alert alert-warning mb-4">
                        <Clock className="w-5 h-5" />
                        <div>
                          <p className="text-sm font-semibold">Paiement requis</p>
                          <p className="text-xs">Procédez au paiement pour valider votre commande.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-warning mb-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold">Impact de la suppression :</p>
                          <p className="text-xs">
                            {isPaid
                              ? `✓ Les ${totalQuantity} article(s) seront réajouté(s) au stock`
                              : `• Aucun impact sur le stock (commande en attente ou refusée)`}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      {isPending && (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary gap-2"
                          onClick={() => openPayModal(order)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Payer maintenant
                        </button>
                      )}
                      {isPaid && (
                        <button
                          type="button"
                          className="btn btn-sm btn-warning gap-2"
                          onClick={() => openDeletePaymentModal(order)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer le paiement
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline btn-error gap-2"
                        onClick={() => openDeleteModal(order)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300">
          <div className="bg-base-100 p-4 rounded-full shadow-inner mb-4">
            <BellOff className="w-10 h-10 opacity-20" />
          </div>
          <p className="text-lg font-semibold opacity-60">Aucune commande pour le moment</p>
          <p className="text-sm opacity-40">Votre panier est vide ou toutes vos commandes ont déjà été traitées.</p>
        </div>
      )}

      {isDeleteModalOpen && selectedOrder && (
        <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
          <div className="modal-box bg-base-200 border border-base-content/10 rounded-2xl">
            <h3 className={`font-bold text-xl flex items-center gap-2 ${isDeletePayment ? "text-warning" : "text-error"}`}>
              <Trash2 size={24} /> {isDeletePayment ? "Supprimer le paiement" : "Supprimer la commande"}
            </h3>

            <p className="py-4 text-lg">
              {isDeletePayment
                ? 'Êtes-vous sûr de vouloir supprimer le paiement de cette commande et repasser son statut à en attente ?'
                : 'Êtes-vous sûr de vouloir supprimer cette commande ?'}
              <br />
              <span className="text-xs text-error/70 italic mt-2 block">
                Commande #{selectedOrder.id.slice(0, 8)} - {selectedOrder.total_amount} €
              </span>
            </p>

            {actionData?.error && (
              <div className="alert alert-error mb-4 shadow-lg animate-in fade-in zoom-in duration-200">
                <XCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{actionData.error}</span>
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={closeDeleteModal}
                type="button"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <Form method="post" action={href("/orders")}> 
                <input type="hidden" name="action" value={isDeletePayment ? "delete-payment" : "delete"} />
                <input type="hidden" name="orderId" value={selectedOrder.id} />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn ${isDeletePayment ? "btn-warning" : "btn-error"} min-w-35 ${isSubmitting ? "btn-disabled" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    isDeletePayment ? "Supprimer le paiement" : "Confirmer"
                  )}
                </button>
              </Form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeDeleteModal} disabled={isSubmitting}>Fermer</button>
          </form>
        </dialog>
      )}

      {isPayModalOpen && selectedOrder && (
        <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
          <div className="modal-box bg-base-200 border border-base-content/10 rounded-2xl max-w-md">
            <h3 className="font-bold text-xl text-primary flex items-center gap-2">
              <CreditCard size={24} /> Payer la commande
            </h3>

            <p className="py-4 text-sm">
              Montant à payer: <span className="font-bold text-primary">{selectedOrder.total_amount} €</span>
            </p>

            {actionData?.error && (
              <div className="alert alert-error mb-4 shadow-lg animate-in fade-in zoom-in duration-200">
                <XCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{actionData.error}</span>
              </div>
            )}

            <Form method="post" action={href("/orders")} className="space-y-4">
              <input type="hidden" name="action" value="pay" />
              <input type="hidden" name="orderId" value={selectedOrder.id} />

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Méthode de paiement</span>
                </label>
                <select name="payment_method" className="select select-bordered" required>
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
                  <span className="label-text-alt text-xs opacity-60">Laissez vide pour utiliser l'adresse de votre profil</span>
                </label>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closePayModal}
                  disabled={isSubmitting}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary min-w-35 ${isSubmitting ? "btn-disabled" : ""}`}
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
            <button onClick={closePayModal} disabled={isSubmitting}>Fermer</button>
          </form>
        </dialog>
      )}
    </div>
  );
};
