import React, { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Package } from "lucide-react";
import { href, Link } from "react-router";
import ReactMarkdown from "react-markdown";

import type { Product } from "~/types/products";
import { OrderModal } from "~/components/home/OrderModal";
import { ProductGallery } from "./ProductGallery";
import { ProductAttributes } from "./ProductAttributes";
import { ProductPurchaseFooter } from "./ProductPurchaseFooter";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

interface ArticleViewProps {
  product: Product & { categories: { name: string } | null };
}

export const ArticleView: React.FC<ArticleViewProps> = React.memo(({ product }) => {
  // État aligné sur HomeView pour gérer la modale
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const allImages = useMemo(() => [
    ...(product.main_image_url ? [product.main_image_url] : []),
    ...(product.product_images?.map((img) => img.url) || []),
  ], [product]);

  const formattedPrice = useMemo(() =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(product.price)
  , [product.price]);

  const outOfStock = product.stock_quantity <= 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      <nav>
        <Link 
          to={href("/")} 
          className="btn btn-ghost btn-sm gap-2 px-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={18} /> Retour
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <ProductGallery images={allImages} title={product.title} />
        </motion.div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col gap-6"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary">
              <Tag size={12} />
              <span>{product.categories?.name || "Sans catégorie"}</span>
              <span className="opacity-20">•</span>
              <div className="flex items-center gap-1 opacity-50">
                <Calendar size={12} />
                {new Date(product.created_at).toLocaleDateString("fr-FR")}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-secondary">{formattedPrice}</span>
              <div className={`badge ${outOfStock ? "badge-error" : "badge-success"} badge-outline font-bold`}>
                {outOfStock ? "Rupture" : `${product.stock_quantity} en stock`}
              </div>
            </div>

            <div className="py-6 border-y border-white/5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase opacity-30 flex items-center gap-2 tracking-widest">
                <Package size={14} /> Description
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-base-content/70">
                {product.description ? (
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                ) : (
                  <p>Aucune description.</p>
                )}
              </div>
            </div>

            <ProductAttributes attributes={product.attributes} />
          </motion.div>

          <ProductPurchaseFooter 
            outOfStock={outOfStock} 
            onPurchase={() => setSelectedProduct(product)} 
          />
        </motion.div>
      </div>

      {/* Rendu de la modale si un produit est sélectionné */}
      {selectedProduct && (
        <OrderModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
});

ArticleView.displayName = "ArticleView";
