import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, Shield, Truck, ArrowLeft, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { Product } from "~/types/products";

interface ProductStorePreviewModalProps {
  product: Product;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (i: number) => void;
  onClose: () => void;
}

export const ProductStorePreviewModal: React.FC<ProductStorePreviewModalProps> = ({
  product, images, currentIndex, onNext, onPrev, onSelect, onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  useEffect(() => {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  const attributes = product.attributes
    ? Object.entries(product.attributes).filter(([k, v]) => k.trim() && String(v).trim())
    : [];

  return (
    <dialog
      ref={dialogRef}
      className="modal backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="modal-box max-w-4xl w-full p-0 overflow-hidden bg-base-100 rounded-2xl border border-base-content/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bandeau aperçu */}
        <div className="bg-warning/10 border-b border-warning/20 px-6 py-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-warning opacity-80">
            👁 Aperçu boutique — non visible par les clients
          </span>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-circle opacity-60 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Galerie */}
          <div className="p-6 space-y-4 bg-base-200/40">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-base-200 border border-base-content/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[currentIndex]}
                  src={images[currentIndex]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                  alt={product.title}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={onPrev}
                    className="btn btn-circle btn-xs bg-black/50 border-none text-white backdrop-blur-sm"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={onNext}
                    className="btn btn-circle btn-xs bg-black/50 border-none text-white backdrop-blur-sm"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {product.stock_quantity > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="badge badge-success badge-sm font-bold">En stock</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(i)}
                    className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentIndex
                        ? "border-primary scale-105"
                        : "border-transparent opacity-40 hover:opacity-80"
                    }`}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="p-6 flex flex-col gap-5">
            {/* Catégorie */}
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-70">
              {product.categories?.name || "Sans catégorie"}
            </div>

            {/* Titre */}
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              {product.title}
            </h2>

            {/* Prix + stock */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-secondary">{formattedPrice}</span>
              <span className={`badge badge-outline font-bold text-xs ${
                product.stock_quantity > 0 ? "badge-success" : "badge-error"
              }`}>
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} disponible${product.stock_quantity > 1 ? "s" : ""}`
                  : "Rupture de stock"}
              </span>
            </div>

            {/* Étoiles fictives (aperçu) */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className={i < 4 ? "text-warning fill-warning" : "text-base-content/20"} />
              ))}
              <span className="text-xs opacity-40 ml-1">4.0 · 12 avis</span>
            </div>

            {/* Description courte */}
            {product.description && (
              <p className="text-sm text-base-content/60 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Attributs */}
            {attributes.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Caractéristiques</p>
                <div className="flex flex-wrap gap-2">
                  {attributes.map(([key, value]) => (
                    <div key={key} className="flex items-center rounded-lg overflow-hidden border border-base-content/10 text-xs font-semibold">
                      <span className="px-2 py-1 bg-base-300 text-base-content/50 uppercase tracking-wider">{key}</span>
                      <span className="px-2 py-1 bg-base-200">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1" />

            {/* CTA */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <button
                  disabled={product.stock_quantity === 0}
                  className="btn btn-primary flex-1 gap-2 shadow-lg shadow-primary/20"
                >
                  <ShoppingCart size={16} /> Acheter maintenant
                </button>
                <button className="btn btn-ghost btn-square border border-base-content/10">
                  <Heart size={16} />
                </button>
              </div>

              {/* Garanties */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { icon: Shield, label: "Paiement sécurisé" },
                  { icon: Truck, label: "Livraison rapide" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-[11px] opacity-40">
                    <Icon size={12} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </dialog>
  );
};