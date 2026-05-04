import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Form, useNavigation, useActionData } from "react-router";
import { Mail, Lock, UserPlus, Eye, EyeOff, User, AtSign } from "lucide-react";
import { AuthInput, AuthButton, RoleSelector } from "./AuthUI";
import { StatusMessage } from "~/components/shared/StatusMessage";

type ActionData = {
  success?: boolean;
  error?: string;
  errors?: {
    full_name?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
} | null;


export function RegisterForm({ actionData: _actionData }: { actionData?: ActionData } = {}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData() as ActionData;

  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ 
    full_name: "", 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "buyer",
    accepted: false 
  });

  const isEmailValid = useMemo(() => /^\S+@\S+\.\S+$/.test(formData.email), [formData.email]);
  const isUsernameValid = formData.username.length >= 3;
  const isPasswordValid = useMemo(() => formData.password.length >= 8 && /\d/.test(formData.password), [formData.password]);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const canSubmit = isEmailValid && isUsernameValid && formData.full_name.length > 1 && isPasswordValid && passwordsMatch && formData.accepted;

  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (formData.full_name && formData.full_name.length < 2) 
      errors.full_name = "Le nom est trop court.";
    
    if (formData.username && formData.username.length < 3) 
      errors.username = "3 caractères minimum.";
    
    if (formData.email && !isEmailValid) 
      errors.email = "Email invalide.";
    
    if (formData.password && !isPasswordValid) 
      errors.password = "8+ caractères et au moins 1 chiffre.";
    
    if (formData.confirmPassword && !passwordsMatch) 
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";

    if (actionData?.errors) {
      Object.keys(actionData.errors).forEach((key) => {
        if (!errors[key]) {
          errors[key] = (actionData.errors as any)[key][0];
        }
      });
    }

    return errors;
  }, [formData, actionData, isEmailValid, isPasswordValid, passwordsMatch]);


  useEffect(() => {
    if (actionData?.success) {
      setShowSuccess(true);
      setFormData({ full_name: "", username: "", email: "", password: "", confirmPassword: "", role: "buyer", accepted: false });
      const timer = setTimeout(() => setShowSuccess(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  }, []);

  const toggleShowPassword = useCallback(() => setShowPassword(v => !v), []);

  return (
    <Form method="post" className="space-y-4">
      <input type="hidden" name="intent" value="register" />

      {actionData?.error && <StatusMessage type="error" message={actionData.error} />}
      {showSuccess && <StatusMessage type="success" message={String(actionData?.message)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <AuthInput 
            name="full_name" label="Nom complet" icon={User} type="text"
            placeholder="Ex: John Doe"
            value={formData.full_name} onChange={handleChange} required
          />
          {fieldErrors.full_name && <span className="text-error text-xs ml-1">{fieldErrors.full_name}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <AuthInput 
            name="username" label="Nom d'utilisateur" icon={AtSign} type="text"
            placeholder="Ex: Doe"
            value={formData.username} onChange={handleChange} required
          />
          {fieldErrors.username && <span className="text-error text-xs ml-1">{fieldErrors.username}</span>}
        </div>
      </div>

      <RoleSelector value={formData.role} onChange={handleChange} />

      <div className="flex flex-col gap-1">
        <AuthInput 
          name="email" label="Email" icon={Mail} type="email"
          placeholder="Ex: johndoe@example.com"
          value={formData.email} onChange={handleChange} required
        />
        {fieldErrors.email && <span className="text-error text-xs ml-1">{fieldErrors.email}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <div className="relative">
            <AuthInput 
              name="password" label="Mot de passe" icon={Lock} type={showPassword ? "text" : "password"} 
              placeholder="8+ caractères, 1 chiffre" value={formData.password} onChange={handleChange} required disabled={isSubmitting}
            />
            <button type="button" onClick={toggleShowPassword} className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.password && <span className="text-error text-xs ml-1">{fieldErrors.password}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <AuthInput 
            name="confirmPassword" label="Confirmer le mot de passe" icon={Lock} 
            type={showPassword ? "text" : "password"} placeholder="Répétez le mot de passe"
            value={formData.confirmPassword} onChange={handleChange} required disabled={isSubmitting}
          />
          {fieldErrors.confirmPassword && <span className="text-error text-xs ml-1">{fieldErrors.confirmPassword}</span>}
        </div>
      </div>
      

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input name="accepted" type="checkbox" checked={formData.accepted} onChange={handleChange} className="checkbox checkbox-sm checkbox-primary" required />
          <span className="text-xs text-base-content/70">J'accepte les conditions d'utilisation.</span>
        </label>
      </div>

      <AuthButton 
        label="Créer mon compte" isLoading={isSubmitting} icon={UserPlus} variant="primary" disabled={!canSubmit} 
      />
    </Form>
  );
}
