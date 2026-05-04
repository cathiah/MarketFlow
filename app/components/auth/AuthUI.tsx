import React, { useState, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import { ShoppingBag, Store, Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  showPasswordToggle?: boolean;
}

interface RoleSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AuthHeader: React.FC<{ title: string; subtitle: string }> = React.memo(({ title, subtitle }) => (
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <p className="text-sm text-base-content/60">{subtitle}</p>
  </div>
));

export const AuthInput: React.FC<AuthInputProps> = ({ label, icon: Icon, showPasswordToggle, type, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPasswordToggle && show ? "text" : type;

  const toggle = useCallback(() => setShow(s => !s), []);

  return (
    <div className="form-control w-full space-y-1.5">
      <label className="label-text text-[11px] font-semibold uppercase tracking-wider text-white/40 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
          <Icon className="w-4 h-4" />
        </div>

        <input 
          {...props}
          type={inputType}
          className="w-full h-11 pl-11 pr-12 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 transition-all focus:bg-white/[0.05] focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none disabled:opacity-50"
        />

        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/20 hover:text-white transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export const RoleSelector: React.FC<RoleSelectorProps> = React.memo(function RoleSelector({ value, onChange }) {
  const roles = [
    { id: "buyer", label: "Acheteur", icon: ShoppingBag, color: "primary" },
    { id: "seller", label: "Vendeur", icon: Store, color: "secondary" },
  ];

  return (
    <div className="form-control w-full space-y-1.5">
      <label className="label-text text-[11px] font-semibold uppercase tracking-wider text-white/40 ml-1">
        Type de compte
      </label>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const isActive = value === role.id;
          const Icon = role.icon;

          const base = 'relative flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl cursor-pointer transition-all duration-200 border';
          const activeClasses = `bg-${role.color}/10 border-${role.color}/50 text-${role.color} ring-4 ring-${role.color}/5`;
          const inactiveClasses = 'bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/[0.05] hover:border-white/20';
          const className = `${base} ${isActive ? activeClasses : inactiveClasses}`;
          const iconClass = `w-4 h-4 transition-colors ${isActive ? `text-${role.color}` : 'text-white/20'}`;
          const textClass = `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-white/40'}`;

          return (
            <label key={role.id} className={className}>
              <input
                type="radio"
                name="role"
                value={role.id}
                className="hidden"
                checked={isActive}
                onChange={onChange}
              />
              <Icon className={iconClass} />
              <span className={textClass}>{role.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
});

export const AuthButton: React.FC<any> = ({ label, icon: Icon, variant, disabled, isLoading }) => (
  <button 
    type="submit" 
    disabled={disabled || isLoading} 
    className={`btn btn-${variant} btn-block group mt-6`}
  >
    {isLoading ? (
      <span className="loading loading-spinner loading-sm"></span>
    ) : (
      <>
        {label}
        {Icon && <Icon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
      </>
    )}
  </button>
);

