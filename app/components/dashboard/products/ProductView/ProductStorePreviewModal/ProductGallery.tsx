import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "~/types/products";

interface ProductGalleryProps {
  product: Product;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (i: number) => void;
}

export function ProductGallery({ product, images, currentIndex, onNext, onPrev, onSelect }: ProductGalleryProps) {
  return (
    <div className="p-6 space-y-4 bg-base-200/40">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-base-200 border border-base-content/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-cover"
            alt={product.title}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={onPrev} className="btn btn-circle btn-xs bg-black/50 border-none text-white backdrop-blur-sm">
              <ChevronLeft size={14} />
            </button>
            <button onClick={onNext} className="btn btn-circle btn-xs bg-black/50 border-none text-white backdrop-blur-sm">
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {product.stock_quantity > 0 && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-success badge-sm font-bold">En stock</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex ? "border-primary scale-105" : "border-transparent opacity-40 hover:opacity-80"
              }`}
            >
              <img src={url} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
