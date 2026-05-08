import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft, Calendar, Edit3, Tag, Package, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { href, Link } from "react-router";
import ReactMarkdown from "react-markdown";
import type { Product } from "~/types/products";

interface ProductViewProps {
  product: Product;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
};

export const ProductView: React.FC<ProductViewProps> = React.memo(function ProductView({ product }) {
  const allImages = useMemo(() => [
    ...(product.main_image_url ? [product.main_image_url] : []),
    ...(product.product_images?.map(img => img.url) || [])
  ], [product.main_image_url, product.product_images]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(allImages.length, 1));
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(allImages.length, 1)) % Math.max(allImages.length, 1));
  }, [allImages.length]);

  const formattedPrice = useMemo(() => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price), [product.price]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
          <div className="group relative aspect-square rounded-3xl overflow-hidden bg-base-200 border border-white/5 shadow-2xl">
            {allImages.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={allImages[currentIndex]}
                    src={allImages[currentIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                    alt={product.title}
                  />
                </AnimatePresence>

                {allImages.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={prevImage} className="btn btn-circle btn-sm bg-black/50 border-none backdrop-blur-md text-white hover:bg-black/70">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImage} className="btn btn-circle btn-sm bg-black/50 border-none backdrop-blur-md text-white hover:bg-black/70">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <Package size={48} />
              </div>
            )}
          </div>
          
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    currentIndex === index ? "border-primary scale-105 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={url} className="w-full h-full object-cover" alt={`Miniature ${index}`} />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }} 
          className="flex flex-col"
        >
          <motion.div variants={fadeInUp} className="space-y-4 flex-1">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Tag size={12} />
              <span>{product.categories?.name || "Sans catégorie"}</span>
              <span className="opacity-20">•</span>
              <div className="flex items-center gap-1 opacity-50">
                <Calendar size={12} />
                {new Date(product.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-4 py-4">
              <span className="text-4xl font-black text-secondary">
                {formattedPrice}
              </span>
              <div className={`badge ${product.stock_quantity > 0 ? 'badge-success' : 'badge-error'} badge-outline font-bold`}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} en stock` : 'Rupture'}
              </div>
            </div>

            <div className="py-6 border-y border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase opacity-30 flex items-center gap-2">
                <Package size={14} /> Description
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-base-content/70 leading-relaxed">
                {product.description ? (
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                ) : (
                  <p>Aucune description fournie.</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.footer variants={fadeInUp} className="mt-8 p-6 rounded-2xl bg-base-200 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${product.is_published ? 'bg-success animate-pulse' : 'bg-warning'}`}></div>
              <span className="font-bold text-sm">
                {product.is_published ? "En ligne" : "Brouillon / Masqué"}
              </span>
            </div>
            <button className="btn btn-primary btn-sm gap-2">
              <ShoppingCart size={16} /> Aperçu Boutique
            </button>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
});
