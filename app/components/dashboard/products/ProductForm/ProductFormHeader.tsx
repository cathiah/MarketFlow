import { Link, href } from "react-router";
import { Save, PlusCircle, ArrowLeft } from "lucide-react";

interface ProductFormHeaderProps {
  isEdit: boolean;
}

export const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({ isEdit }) => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col items-start">
      <Link
        to={href("/dashboard/products")}
        className="btn btn-link btn-xs pl-0 no-underline opacity-50 hover:opacity-100 flex items-center gap-1"
      >
        <ArrowLeft size={14} /> Retour
      </Link>
      <h1 className="text-2xl font-black mt-1 flex items-center gap-2">
        {isEdit ? (
          <>
            <Save className="text-secondary" size={24} /> Editer l'offre
          </>
        ) : (
          <>
            <PlusCircle className="text-primary" size={24} /> Nouvelle annonce
          </>
        )}
      </h1>
    </div>
  </div>
);