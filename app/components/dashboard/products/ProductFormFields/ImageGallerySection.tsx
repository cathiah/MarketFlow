import { X, ImageIcon } from "lucide-react";

interface ImageGallerySectionProps {
  previews: string[];
  existingImages: string[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export const ImageGallerySection: React.FC<ImageGallerySectionProps> = ({
  previews, existingImages, fileInputRef, onFileChange, onRemove,
}) => (
  <div className="card bg-base-200 border border-white/5 shadow-xl">
    <div className="card-body">
      <h3 className="font-bold text-[10px] uppercase opacity-50 mb-2">Galerie Photos</h3>

      {existingImages.map((url, i) => (
        <input key={i} type="hidden" name="keep_images" value={url} />
      ))}

      <div className="grid grid-cols-2 gap-2">
        {previews.map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-lg border border-white/10 bg-base-300 overflow-hidden group"
          >
            <img src={src} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={10} />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-primary text-[8px] text-center font-bold text-primary-content uppercase py-0.5">
                Principale
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-outline border-dashed aspect-square h-full flex flex-col gap-1 border-white/20 hover:border-primary transition-colors"
        >
          <ImageIcon size={18} className="opacity-30" />
          <span className="text-[9px]">Ajouter</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name="images"
        multiple
        className="hidden"
        onChange={onFileChange}
        accept="image/*"
      />
    </div>
  </div>
);