import { useState } from "react";
import type { Product } from "~/types/products";
import CardProduct from "./CardProduct";
import { OrderModal } from "./OrderModal";

interface HomeViewProps {
  products: Product[];
  userId: string | null;
}

export function HomeView({ products, userId }: HomeViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-6 items-center justify-center p-6">
        {products.length > 0 ? (
          products.map((product) => (
            <CardProduct
              key={product.id}
              product={product}
              onBuy={() => setSelectedProduct(product)}
            />
          ))
        ) : (
          <div className="py-20 text-center opacity-40 italic">
            Aucun produit disponible pour le moment.
          </div>
        )}
      </div>

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}