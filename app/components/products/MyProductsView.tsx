import React, { useState, useMemo, useCallback } from "react";
import { useFetcher, href } from "react-router";
import { Search, Filter, Package, Globe, FileText } from "lucide-react";
import { DeleteProductModal } from "./DeleteProductModal";
import { ProductRow } from "./ProductRow";
import { InventoryHeader } from "./Inventory/InventoryHeader";
import { InventoryStatCard } from "./Inventory/InventoryStatCard";
import { InventoryEmptyState } from "./Inventory/InventoryEmptyState";
import type { Product } from "~/types/products";

interface MyProductsViewProps {
  products: Product[];
}

export const MyProductsView: React.FC<MyProductsViewProps> = React.memo(function MyProductsView({ products }) {
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  
  const deleteFetcher = useFetcher();

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = q === "" || p.title.toLowerCase().includes(q) || (p.categories?.name || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" ? true : statusFilter === "published" ? p.is_published : !p.is_published;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: products.length,
    published: products.filter(p => p.is_published).length,
    drafts: products.filter(p => !p.is_published).length
  }), [products]);

  const handleDelete = useCallback((productId: string) => {
    deleteFetcher.submit(
      { productId }, 
      { 
        method: "DELETE", 
        action: href("/dashboard/products")
      }
    );
    setTargetProduct(null);
  }, [deleteFetcher]);

  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value), []);
  const setFilterAll = useCallback(() => setStatusFilter("all"), []);
  const setFilterPublished = useCallback(() => setStatusFilter("published"), []);
  const setFilterDraft = useCallback(() => setStatusFilter("draft"), []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      <InventoryHeader count={stats.total} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InventoryStatCard title="Total" value={stats.total} icon={Package} color="primary" />
        <InventoryStatCard title="En ligne" value={stats.published} icon={Globe} color="success" />
        <InventoryStatCard title="Brouillons" value={stats.drafts} icon={FileText} color="warning" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par titre ou catégorie..." 
            className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-200"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost bg-base-200/50 gap-2">
            <Filter size={18} />
            <span className="hidden sm:inline">
              {statusFilter === "all" ? "Tous les statuts" : statusFilter === "published" ? "En ligne" : "Brouillons"}
            </span>
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-300 rounded-xl w-52 border border-white/10 mt-2">
            <li><button onClick={setFilterAll}>Tous les produits</button></li>
            <li><button onClick={setFilterPublished}>En ligne</button></li>
            <li><button onClick={setFilterDraft}>Brouillons</button></li>
          </ul>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-base-200/30 backdrop-blur-md">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="table table-zebra w-full table-auto md:table-fixed">
            <thead className="bg-base-300/50">
              <tr className="text-[10px] uppercase tracking-widest opacity-60 border-none">
                <th className="w-16 md:w-24">Aperçu</th>
                <th className="min-w-[140px]">Détails</th>
                <th className="hidden lg:table-cell w-40">Catégorie</th>
                <th className="w-24">Prix</th>
                <th className="hidden sm:table-cell w-20">Stock</th>
                <th className="hidden md:table-cell w-32 text-center">Statut</th>
                <th className="text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <ProductRow 
                  key={product.id} 
                  product={product} 
                  onDeleteRequest={setTargetProduct} 
                />
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="p-20 text-center opacity-40 italic">
              {searchQuery ? "Aucun produit trouvé." : <InventoryEmptyState />}
            </div>
          )}
        </div>
      </div>

      <DeleteProductModal 
        product={targetProduct} 
        onClose={() => setTargetProduct(null)} 
        onConfirm={handleDelete}
        isSubmitting={deleteFetcher.state !== "idle"}
      />
    </div>
  );
});
