import React, { useCallback, useState } from "react";
import { Form, useNavigation, useActionData } from "react-router";
import { User, Lock, LogIn } from "lucide-react";
import { AuthInput, AuthButton } from "~/components/auth/AuthUI";
import { StatusMessage } from "~/components/shared/StatusMessage";

type ActionData = { error?: string | null; success?: boolean | string | null } | null | undefined;

export function LoginForm({ actionData: _actionData }: { actionData?: ActionData } = {}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData() as ActionData;

  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const canSubmit = formData.identifier.length >= 3 && formData.password.length > 0;

  return (
    <Form method="post" className="space-y-4">
      <input type="hidden" name="intent" value="login" />

      {actionData?.error && <StatusMessage type="error" message={actionData.error} />}

      <AuthInput 
        name="identifier"
        label="Email ou Nom d'utilisateur" 
        icon={User} 
        type="text" 
        autoComplete="username"
        placeholder="votre@email.com ou pseudo" 
        value={formData.identifier} 
        onChange={handleChange} 
        required 
        disabled={isSubmitting}
      />
      
      <div className="space-y-1">
        <AuthInput 
          name="password" 
          label="Mot de passe" 
          icon={Lock} 
          type="password" 
          showPasswordToggle 
          autoComplete="current-password" 
          placeholder="••••••••" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          disabled={isSubmitting}
        />
        <div className="flex justify-end px-1">
          <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary-focus transition-colors">
            Mot de passe oublié ?
          </button>
        </div>
      </div>

      <AuthButton 
        label="Se connecter" 
        isLoading={isSubmitting}
        icon={LogIn} 
        variant="primary" 
        disabled={!canSubmit}
      />
    </Form>
  );
}
