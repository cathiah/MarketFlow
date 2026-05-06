import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { Product } from "~/types/products";
import { StatusMessage } from "~/components/shared/StatusMessage";

interface OrderModalProps {
  product: Product;
  onClose: () => void;
}

export function OrderModal({ product, onClose }: OrderModalProps) {
  const fetcher = useFetcher<{ success: boolean; message: string }>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [quantity, setQuantity] = useState(1);

  const isSubmitting = fetcher.state !== "idle";
  const result = fetcher.data;

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (result?.success) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [result, onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current && !isSubmitting) onClose();
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Math.min(
      Math.max(1, parseInt(e.target.value, 10) || 1),
      product.stock_quantity
    );
    setQuantity(val);
  }

  const unitPrice = Number(product.price);
  const total = unitPrice * quantity;

  const fmt = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

  return (
    <dialog ref={dialogRef} className="modal" onClick={handleBackdropClick}>
      <div className="modal-box flex flex-col gap-4">
        {/* En-tête */}
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg">Confirmer la commande</h3>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4 items-center">
          {product.main_image_url ? (
            <img
              src={product.main_image_url}
              alt={product.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-base-300 shrink-0" />
          )}
          <div className="flex flex-col gap-1">
            <p className="font-semibold line-clamp-2">{product.title}</p>
            <p className="text-sm text-base-content/60">
              Prix unitaire :{" "}
              <span className="text-accent font-medium">{fmt(unitPrice)}</span>
            </p>
            <p className="text-xs text-base-content/40">
              Stock disponible : {product.stock_quantity}
            </p>
          </div>
        </div>

        <div className="divider my-0" />

        {!result?.success && (
          <>
            <div className="form-control gap-1">
              <label className="label" htmlFor="order-qty">
                <span className="label-text font-medium">Quantité</span>
                <span className="label-text-alt text-base-content/50">
                  max {product.stock_quantity}
                </span>
              </label>
              <input
                id="order-qty"
                type="number"
                min={1}
                max={product.stock_quantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="input input-bordered w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-between items-center rounded-xl bg-base-300 px-4 py-3">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold text-accent">{fmt(total)}</span>
            </div>
          </>
        )}

        {result && (
          <StatusMessage
            message={result.message}
            type={result.success ? "success" : "error"}
          />
        )}

        {!result?.success && (
          <fetcher.Form method="post">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="price" value={product.price.toString()} />
            <input type="hidden" name="quantity" value={quantity} />

            <div className="modal-action mt-0 gap-2">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isSubmitting || quantity < 1}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    En cours…
                  </>
                ) : (
                  "Confirmer la commande"
                )}
              </button>
            </div>
          </fetcher.Form>
        )}

        {result?.success && (
          <button
            type="button"
            className="btn btn-ghost btn-sm self-end"
            onClick={onClose}
          >
            Fermer
          </button>
        )}
      </div>
    </dialog>
  );
}
