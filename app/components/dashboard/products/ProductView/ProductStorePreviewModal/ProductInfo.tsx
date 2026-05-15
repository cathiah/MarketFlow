import { ShoppingCart, Shield, Truck, Heart } from "lucide-react";
import type { Product } from "~/types/products";
import type { Review } from "~/types/reviews";
import { AverageStars } from "./AverageStars";

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
}

export function ProductInfo({ product, reviews, isLiked, likeCount, onLike }: ProductInfoProps) {
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  const attributes = product.attributes
    ? Object.entries(product.attributes).filter(([k, v]) => k.trim() && String(v).trim())
    : [];

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-70">
        {product.categories?.name || "Sans catégorie"}
      </div>

      <h2 className="text-2xl font-black tracking-tight leading-tight">{product.title}</h2>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-secondary">{formattedPrice}</span>
        <span className={`badge badge-outline font-bold text-xs ${product.stock_quantity > 0 ? "badge-success" : "badge-error"}`}>
          {product.stock_quantity > 0
            ? `${product.stock_quantity} disponible${product.stock_quantity > 1 ? "s" : ""}`
            : "Rupture de stock"}
        </span>
      </div>

      <AverageStars reviews={reviews} />

      {product.description && (
        <p className="text-sm text-base-content/60 leading-relaxed line-clamp-3">
          {product.description}
        </p>
      )}

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

      <div className="space-y-3 pt-2">
        <div className="flex gap-2">
          <button
            disabled={product.stock_quantity === 0}
            className="btn btn-primary flex-1 gap-2 shadow-lg shadow-primary/20"
          >
            <ShoppingCart size={16} /> Acheter maintenant
          </button>
          <button
            onClick={onLike}
            className={`btn btn-square border transition-colors ${
              isLiked
                ? "btn-error text-white border-error"
                : "btn-ghost border-base-content/10 hover:border-error hover:text-error"
            }`}
            title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={16} className={isLiked ? "fill-current" : ""} />
          </button>
        </div>

        {likeCount > 0 && (
          <p className="text-[11px] opacity-40 text-center">
            ❤️ {likeCount} personne{likeCount > 1 ? "s aiment" : " aime"} ce produit
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { icon: Shield, label: "Paiement sécurisé" },
            { icon: Truck, label: "Livraison rapide" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-[11px] opacity-40">
              <Icon size={12} /><span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
