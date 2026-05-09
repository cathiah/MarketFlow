import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { Product } from "~/types/products";
import CardProduct from "./CardProduct";
import { OrderModal } from "./OrderModal";

interface HomeViewProps {
  products: Product[];
  userId: string | null;
}

const PAGE_SIZE = 12;

export function HomeView({ products, userId }: HomeViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.categories?.name) set.add(p.categories.name);
    });
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q);
      const matchCat =
        category === "all" || p.categories?.name === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCategory = (v: string) => { setCategory(v); setPage(1); };

  return (
    <>
      <div className="sticky top-16 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-content/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher un produit…"
              className="input input-bordered input-sm w-full pl-9 pr-8"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              className="select select-bordered select-sm w-full sm:w-48"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          <span className="text-xs opacity-40 whitespace-nowrap self-center">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {paginated.map((product) => (
              <CardProduct
                key={product.id}
                product={product}
                onBuy={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center opacity-40 italic flex flex-col items-center gap-2">
            <Search size={32} className="opacity-30" />
            <p>Aucun produit ne correspond à votre recherche.</p>
            <button
              onClick={() => { handleSearch(""); handleCategory("all"); }}
              className="btn btn-ghost btn-xs mt-2 not-italic opacity-70"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-10 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="btn btn-ghost btn-sm"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const show =
                p === 1 ||
                p === totalPages ||
                Math.abs(p - safePage) <= 2;
              const showEllipsisBefore = p === safePage - 3 && p > 2;
              const showEllipsisAfter = p === safePage + 3 && p < totalPages - 1;

              if (showEllipsisBefore || showEllipsisAfter) {
                return <span key={p} className="px-1 opacity-40">…</span>;
              }
              if (!show) return null;

              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`btn btn-sm ${p === safePage ? "btn-primary" : "btn-ghost"}`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="btn btn-ghost btn-sm"
            >
              ›
            </button>
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