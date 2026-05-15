import { Link, href } from "react-router";
import type { Product } from "~/types/products";

interface CardProductProps {
  product: Product;
  onBuy: () => void;
}

const CardProduct: React.FC<CardProductProps> = ({ product, onBuy }) => {
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(product.price));

  const outOfStock = product.stock_quantity <= 0;

  return (
    <div className="relative card w-full bg-base-200 shadow-xl border border-base-300 hover:border-primary transition-colors group">
      {!outOfStock && (
        <div className="absolute top-2 right-2 z-10">
          <div className="badge badge-secondary badge-sm">En stock</div>
        </div>
      )}

      <figure className="aspect-square overflow-hidden bg-base-300">
        {product.main_image_url ? (
          <img
            src={product.main_image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-20">
            <span className="loading loading-ghost loading-lg"></span>
            <p className="text-xs italic">Aucune image</p>
          </div>
        )}
      </figure>

      <div className="card-body p-4 sm:p-5">
        <h2 className="card-title text-base line-clamp-1 text-secondary">
          {product.title}
        </h2>

        <p className="text-sm text-base-content/70 line-clamp-2 min-h-10">
          {product.description}
        </p>

        <div className="card-actions flex-col gap-3 mt-4">
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold text-accent">
              {formattedPrice}
            </span>
            <Link
              to={href("/article/:slug", { slug: product.slug })}
              className="btn btn-ghost btn-xs"
            >
              Détails
            </Link>
          </div>

          <button
            type="button"
            onClick={onBuy}
            disabled={outOfStock}
            className="btn btn-primary btn-sm w-full"
          >
            {outOfStock ? "Rupture de stock" : "Acheter maintenant"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;