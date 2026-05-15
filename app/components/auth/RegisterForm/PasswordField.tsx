import { Lock, Eye, EyeOff } from "lucide-react";
import { AuthInput } from "../AuthUI";

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  showPassword: boolean;
  isSubmitting: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisibility?: () => void;
}

export function PasswordField({
  name,
  label,
  placeholder,
  value,
  showPassword,
  isSubmitting,
  error,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <AuthInput
          name={name}
          label={label}
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          disabled={isSubmitting}
        />
        {onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute right-3 top-9.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="text-error text-xs ml-1">{error}</span>}
    </div>
  );
}
