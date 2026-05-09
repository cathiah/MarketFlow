import React from "react";
import { ArrowLeft, Edit3 } from "lucide-react";
import { href, Link } from "react-router";
import type { Product } from "~/types/products";

interface ProductNavBarProps {
  product: Pick<Product, "slug">;
}

export const ProductNavBar: React.FC<ProductNavBarProps> = React.memo(function ProductNavBar({
  product,
}) {
  return (
    <nav className="flex items-center justify-between">
      <Link
        to={href("/dashboard/products")}
        className="btn btn-ghost btn-sm gap-2 px-0 hover:bg-transparent opacity-60 hover:opacity-100 transition-opacity"
      >
        <ArrowLeft size={18} /> Retour au catalogue
      </Link>

      <Link
        to={href("/dashboard/products/:slug/edit", { slug: product.slug })}
        className="btn btn-secondary btn-sm gap-2"
      >
        <Edit3 size={16} /> Modifier la fiche
      </Link>
    </nav>
  );
});
