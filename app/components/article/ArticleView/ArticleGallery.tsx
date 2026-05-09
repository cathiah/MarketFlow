import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";

interface ArticleGalleryProps {
  images: string[];
  title: string;
}

export const ArticleGallery: React.FC<ArticleGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((p) => (p + 1) % images.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + images.length) % images.length);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl bg-base-200 border border-white/5 flex items-center justify-center opacity-20">
        <Package size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="group relative aspect-square rounded-3xl overflow-hidden bg-base-200 border border-white/5 shadow-2xl">
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
            <button onClick={prev} className="btn btn-circle btn-sm bg-black/50 border-none text-white hover:bg-black/70">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="btn btn-circle btn-sm bg-black/50 border-none text-white hover:bg-black/70">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === i ? "border-primary scale-105 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img src={url} className="w-full h-full object-cover" alt={`Miniature ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
