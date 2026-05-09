import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { fadeInUp } from "./utils/animations";

interface ProductImageGalleryProps {
  images: string[];
  currentIndex: number;
  title: string;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (index: number) => void;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = React.memo(
  function ProductImageGallery({ images, currentIndex, title, onNext, onPrev, onSelect }) {
    return (
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
        {/* Main image */}
        <div className="group relative aspect-square rounded-3xl overflow-hidden bg-base-200 border border-white/5 shadow-2xl">
          {images.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[currentIndex]}
                  src={images[currentIndex]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  alt={title}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={onPrev}
                    className="btn btn-circle btn-sm bg-black/50 border-none backdrop-blur-md text-white hover:bg-black/70"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={onNext}
                    className="btn btn-circle btn-sm bg-black/50 border-none backdrop-blur-md text-white hover:bg-black/70"
                  >
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

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((url, index) => (
              <button
                key={index}
                onClick={() => onSelect(index)}
                className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  currentIndex === index
                    ? "border-primary scale-105 shadow-lg"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img src={url} className="w-full h-full object-cover" alt={`Miniature ${index}`} />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    );
  }
);
