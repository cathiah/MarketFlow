import { PublishToggle, FormActions } from "~/components/shared/FormFields";

interface PublishSectionProps {
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

export const PublishSection: React.FC<PublishSectionProps> = ({
  isPublished, setIsPublished, isSubmitting, isEdit,
}) => (
  <div className="card bg-base-200 border border-white/5 shadow-xl">
    <div className="card-body gap-6">
      <PublishToggle isPublished={isPublished} onChange={setIsPublished} />
      <input type="hidden" name="is_published" value={isPublished ? "on" : "off"} />
      <FormActions
        isSubmitting={isSubmitting}
        isPublished={isPublished}
        submitLabel={isEdit ? "Mettre à jour" : "Mettre en vente"}
      />
    </div>
  </div>
);