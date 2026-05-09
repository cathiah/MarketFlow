import React from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { fadeInUp } from "./utils/animations";

interface ProductAttributesProps {
  attributes?: Record<string, unknown> | null;
}

export const ProductAttributes: React.FC<ProductAttributesProps> = React.memo(
  function ProductAttributes({ attributes }) {
    if (!attributes) return null;

    const entries = Object.entries(attributes).filter(
      ([key, value]) => key.trim() !== "" && String(value).trim() !== ""
    );

    if (entries.length === 0) return null;

    return (
      <motion.div variants={fadeInUp} className="py-6 space-y-4">
        <h3 className="text-xs font-bold uppercase opacity-30 flex items-center gap-2">
          <SlidersHorizontal size={14} /> Attributs
        </h3>
        <dl className="flex flex-wrap gap-2">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-0 rounded-xl overflow-hidden border border-white/10 text-xs font-semibold"
            >
              <dt className="px-3 py-1.5 bg-base-300 text-base-content/50 uppercase tracking-wider">
                {key}
              </dt>
              <dd className="px-3 py-1.5 bg-base-200 text-base-content">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    );
  }
);