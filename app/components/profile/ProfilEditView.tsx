// components/Profil/ProfilEditView.tsx
import React, { useMemo } from "react";
import { Form, useNavigation } from "react-router";
import { User, MapPin, CreditCard, Save, Loader2, Fingerprint } from "lucide-react";
import { EditProfileHeader } from "./EditProfileHeader";
import { AvatarUpload } from "./AvatarUpload";
import { FormSection } from "./FormSection";
import type { Profile } from "~/types/profile";

interface ProfilEditViewProps {
  profile: Profile;
}

type DaisyColor = "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error";

interface TextareaGroupProps {
  name: string;
  label: string;
  defaultValue?: string;
  icon?: React.ReactNode;
  color?: DaisyColor;
}

interface InputGroupProps {
  name: string;
  label: string;
  defaultValue?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  color?: DaisyColor;
  disabled?: boolean;
}

export const ProfilEditView: React.FC<ProfilEditViewProps> = React.memo(function ProfilEditView({ profile }) {
  const navigation = useNavigation();
  const isUpdating = navigation.state === "submitting";

  const initialValues = useMemo(() => ({
    full_name: profile.full_name || "",
    username: profile.username || "",
    shipping_address: profile.shipping_address || "",
    billing_address: profile.billing_address || "",
    avatar_url: profile.avatar_url || "",
  }), [profile]);

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <EditProfileHeader isUpdating={isUpdating} />

      <Form id="edit-form" method="post" className="grid grid-cols-1 lg:grid-cols-12 gap-8" encType="multipart/form-data">
        <input type="hidden" name="current_avatar_url" defaultValue={initialValues.avatar_url} />

        <div className="lg:col-span-4">
          <AvatarUpload avatarUrl={initialValues.avatar_url} username={initialValues.username} />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="card bg-base-200 border border-white/5 shadow-xl overflow-hidden">
            <div className="card-body p-6 sm:p-10 space-y-10">
              <FormSection title="Général" colorClass="primary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup name="full_name" label="Nom Complet" defaultValue={initialValues.full_name} icon={<User size={16} />} placeholder="Ex: Jean Dupont" color="primary" />
                  <InputGroup name="username" label="Nom d'utilisateur" defaultValue={initialValues.username} icon={<Fingerprint size={16} />} placeholder="identifiant" color="primary" disabled />
                </div>
              </FormSection>

              <FormSection title="Logistique" colorClass="secondary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextareaGroup name="shipping_address" label="Adresse de Livraison" defaultValue={initialValues.shipping_address} icon={<MapPin size={14} />} color="secondary" />
                  <TextareaGroup name="billing_address" label="Adresse de Facturation" defaultValue={initialValues.billing_address} icon={<CreditCard size={14} />} color="accent" />
                </div>
              </FormSection>
            </div>
          </div>

          <div className="lg:hidden pt-4">
            <button type="submit" disabled={isUpdating} className="btn btn-primary btn-block rounded-xl shadow-xl shadow-primary/20 h-14">
              {isUpdating ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              Confirmer les changements
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
});


const InputGroup: React.FC<InputGroupProps> = React.memo(function InputGroup({
  name, label, defaultValue, icon, placeholder, color = "primary", disabled
}) {
  return (
    <div className="form-control w-full group">
      <label className="label">
        <span className={`label-text text-[10px] font-black uppercase opacity-40 group-focus-within:text-${color} transition-colors`}>
          {label}
        </span>
        {disabled && (
          <span className="label-text-alt text-xs opacity-40 italic">Non modifiable</span>  // ← badge indicatif
        )}
      </label>
      <div className="relative">
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 opacity-20 transition-all`}>{icon}</span>
        <input type="text" name={name} defaultValue={defaultValue ?? ""} disabled={disabled} 
          className={`input input-bordered w-full pl-12 bg-base-300/50 border-white/5 rounded-xl font-medium
            ${disabled ? "opacity-50 cursor-not-allowed" : `focus:bg-base-300 focus:border-${color} transition-all`}
          `}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
});

const TextareaGroup: React.FC<TextareaGroupProps> = React.memo(function TextareaGroup({ 
  name, label, defaultValue, 
  icon, color = "primary" 
}) {
  
  const colorVariants: Record<DaisyColor, string> = {
    primary: "group-focus-within:text-primary focus:border-primary",
    secondary: "group-focus-within:text-secondary focus:border-secondary",
    accent: "group-focus-within:text-accent focus:border-accent",
    info: "group-focus-within:text-info focus:border-info",
    success: "group-focus-within:text-success focus:border-success",
    warning: "group-focus-within:text-warning focus:border-warning",
    error: "group-focus-within:text-error focus:border-error",
  };

  return (
    <div className="form-control w-full max-w-full group">
      <label className="label px-1 py-2">
        <span className={`label-text text-[10px] sm:text-xs font-black uppercase opacity-40 flex items-center gap-2 transition-colors ${colorVariants[color] || ""}`}>
          {icon} 
          <span className="truncate">{label}</span>
        </span>
      </label>
      
      <textarea 
        name={name} 
        defaultValue={defaultValue ?? ""} 
        className={`
          textarea textarea-bordered 
          bg-base-300/50 focus:bg-base-300 
          border-white/5 
          rounded-xl 
          h-32 md:h-44 
          text-sm sm:text-base 
          leading-relaxed 
          transition-all 
          resize-none 
          w-full
          ${colorVariants[color] || ""}
        `} 
        placeholder="..."
      ></textarea>
    </div>
  );
});
