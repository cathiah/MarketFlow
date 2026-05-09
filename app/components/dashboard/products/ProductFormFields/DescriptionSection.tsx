import { FileText } from "lucide-react";
import { TextAreaField } from "~/components/shared/FormFields";
import type { Product } from "~/types/products";

interface DescriptionSectionProps {
  initialData?: Product;
  error?: string;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({ initialData, error }) => (
  <TextAreaField
    label="Description"
    icon={FileText}
    name="description"
    defaultValue={initialData?.description || ""}
    rows={8}
    error={error}
  />
);