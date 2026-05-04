import React, { useCallback, useMemo } from "react";
import { Link, href } from "react-router";
import { Eye, Edit3, Trash2, Package, Globe, FileText } from "lucide-react";
import type { Product } from "~/types/products";

interface ProductRowProps {
  product: Product;
  onDeleteRequest: (product: Product) => void;
}

export const ProductRow: React.FC<ProductRowProps> = React.memo(function ProductRow({ product, onDeleteRequest }) {
  const formattedPrice = useMemo(() => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price), [product.price]);

  const handleDelete = useCallback(() => onDeleteRequest(product), [onDeleteRequest, product]);

  return (
    <tr className="hover:bg-base-content/5 transition-colors group">
      <td className="w-16 md:w-20">
        <div className="avatar">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-neutral overflow-hidden">
            {product.main_image_url ? (
              <img src={product.main_image_url} alt={product.title} className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-white/20">
                <Package size={16} />
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className="min-w-0">
        <div className="font-bold text-xs md:text-sm truncate max-w-[120px] md:max-w-[300px]" title={product.title}>
          {product.title}
        </div>
        <div className="text-[9px] md:text-[10px] opacity-40 font-mono truncate max-w-[120px]">
          {product.slug}
        </div>
      </td>

      <td className="hidden lg:table-cell">
        <span className="badge badge-ghost badge-sm border-white/5 truncate max-w-[100px]">
          {product.categories?.name || 'Général'}
        </span>
      </td>

      <td className="font-bold text-secondary text-xs md:text-sm whitespace-nowrap">
        {formattedPrice}
      </td>

      <td className="hidden sm:table-cell">
        <div className={`text-sm ${product.stock_quantity === 0 ? 'text-error font-bold' : 'opacity-70'}`}>
          {product.stock_quantity}
        </div>
      </td>

      <td className="hidden md:table-cell">
        {product.is_published ? (
          <span className="badge badge-success badge-sm gap-1 font-bold py-3">
            <Globe size={10} /> En ligne
          </span>
        ) : (
          <span className="badge badge-warning badge-sm gap-1 font-bold py-3">
            <FileText size={10} /> Brouillon
          </span>
        )}
      </td>

      <td className="text-right">
        <div className="flex justify-end gap-1">
          <Link 
            to={href("/dashboard/products/:slug", { slug: product.slug })} 
            className="btn btn-square btn-ghost btn-xs md:btn-sm hover:bg-primary/20"
          >
            <Eye size={14} />
          </Link>
          <Link 
            to={href("/dashboard/products/:slug/edit", { slug: product.slug })} 
            className="btn btn-square btn-ghost btn-xs md:btn-sm text-info hover:bg-info/20"
          >
            <Edit3 size={14} />
          </Link>
          <button 
            onClick={handleDelete}
            className="btn btn-square btn-ghost btn-xs md:btn-sm text-error hover:bg-error/20"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
});
