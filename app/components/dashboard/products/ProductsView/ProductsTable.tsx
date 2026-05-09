import React from "react";
import { ProductRow } from "./ProductRow";
import { InventoryEmptyState } from "./Inventory/InventoryEmptyState";
import type { Product } from "~/types/products";

interface ProductsTableProps {
  products: Product[];
  searchQuery: string;
  onDeleteRequest: (product: Product) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = React.memo(function ProductsTable({
  products,
  searchQuery,
  onDeleteRequest,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-base-200/30 backdrop-blur-md">
      <div className="overflow-x-auto min-h-100">
        <table className="table table-zebra w-full table-auto md:table-fixed">
          <thead className="bg-base-300/50">
            <tr className="text-[10px] uppercase tracking-widest opacity-60 border-none">
              <th className="w-16 md:w-24">Aperçu</th>
              <th className="min-w-35">Détails</th>
              <th className="hidden lg:table-cell w-40">Catégorie</th>
              <th className="w-24">Prix</th>
              <th className="hidden sm:table-cell w-20">Stock</th>
              <th className="hidden md:table-cell w-32 text-center">Statut</th>
              <th className="text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <ProductRow key={product.id} product={product} onDeleteRequest={onDeleteRequest} />
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-20 text-center opacity-40 italic">
            {searchQuery ? "Aucun produit trouvé." : <InventoryEmptyState />}
          </div>
        )}
      </div>
    </div>
  );
});
