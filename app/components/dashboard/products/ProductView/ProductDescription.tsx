import React from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { fadeInUp } from "./utils/animations";

interface ProductDescriptionProps {
  description?: string | null;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = React.memo(
  function ProductDescription({ description }) {
    return (
      <motion.div
        variants={fadeInUp}
        className="py-6 border-y border-white/5 space-y-4"
      >
        <h3 className="text-xs font-bold uppercase opacity-30 flex items-center gap-2">
          <Package size={14} /> Description
        </h3>
        <div className="prose prose-invert prose-sm max-w-none text-base-content/70 leading-relaxed">
          {description ? (
            <ReactMarkdown>{description}</ReactMarkdown>
          ) : (
            <p>Aucune description fournie.</p>
          )}
        </div>
      </motion.div>
    );
  }
);
