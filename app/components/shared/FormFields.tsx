// components/shared/FormFields.tsx
import { type LucideIcon, Send, Save, RotateCcw } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

interface PublishToggleProps {
  isPublished: boolean;
  onChange: (v: boolean) => void;
}

interface FormActionsProps {
  isSubmitting: boolean;
  isPublished: boolean;
  submitLabel: string;
}

export function InputField({ label, icon: Icon, error, className = "", ...props }: InputFieldProps) {
  return (
    <div className="form-control w-full">
      <label className="label uppercase text-[10px] font-black opacity-40 tracking-[0.15em] mb-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 group-focus-within:text-primary transition-colors">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <input 
          {...props} 
          className={`input input-bordered w-full bg-base-300/30 border-white/5 focus:border-primary/50 transition-all ${
            Icon ? 'pl-12' : 'pl-4'
          } ${error ? 'input-error' : ''} ${className}`} 
        />
      </div>
      {error && <p className="text-error text-[10px] mt-1 font-bold">{error}</p>}
    </div>
  );
}

export function TextAreaField({ label, icon: Icon, error, className = "", ...props }: TextAreaProps) {
  return (
    <div className="form-control w-full">
      <label className="label uppercase text-[10px] font-black opacity-40 tracking-[0.15em] mb-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-4 text-base-content/30 group-focus-within:text-primary transition-colors">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <textarea 
          {...props} 
          className={`textarea textarea-bordered w-full bg-base-300/30 border-white/5 focus:border-primary/50 min-h-[200px] transition-all ${
            Icon ? 'pl-12' : 'pl-4'
          } ${error ? 'textarea-error' : ''} ${className}`} 
        />
      </div>
      {error && <p className="text-error text-[10px] mt-1 font-bold italic">{error}</p>}
    </div>
  );
}

export function PublishToggle({ isPublished, onChange }: PublishToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-base-300/50 rounded-xl border border-white/5">
      <div className="flex flex-col">
        <span className="text-sm font-bold">{isPublished ? "Public" : "Brouillon"}</span>
        <span className="text-[9px] opacity-40 leading-tight uppercase tracking-wider">
          {isPublished ? "Visible sur la boutique" : "Visible uniquement par vous"}
        </span>
      </div>
      <input 
        type="checkbox" 
        className="toggle toggle-primary toggle-sm" 
        checked={isPublished} 
        onChange={(e) => onChange(e.target.checked)} 
      />
    </div>
  );
}

export function FormActions({ isSubmitting, isPublished, submitLabel }: FormActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="btn btn-primary btn-block gap-2 shadow-lg shadow-primary/20"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          isPublished ? <Send size={18} /> : <Save size={18} />
        )}
        {submitLabel}
      </button>
      <button 
        type="reset" 
        className="btn btn-ghost btn-xs opacity-40 hover:opacity-100 gap-2 transition-opacity"
      >
        <RotateCcw size={12} /> Réinitialiser les champs
      </button>
    </div>
  );
}
