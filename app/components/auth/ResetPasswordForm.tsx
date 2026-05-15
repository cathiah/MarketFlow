import React, { useState, useCallback, useMemo } from "react";
import { Form, useNavigation, useActionData } from "react-router";
import { Lock, ShieldCheck } from "lucide-react";
import { AuthInput, AuthButton } from "./AuthUI";
import { StatusMessage } from "~/components/shared/StatusMessage";

type ActionData = {
  success?: boolean;
  error?: string;
} | null;

export function ResetPasswordForm({ actionData: _actionData }: { actionData?: ActionData } = {}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData() as ActionData;

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const isPasswordValid = useMemo(
    () => formData.password.length >= 8 && /\d/.test(formData.password),
    [formData.password]
  );
  const passwordsMatch = formData.password === formData.confirmPassword;
  const canSubmit = isPasswordValid && passwordsMatch && formData.confirmPassword.length > 0;

  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    if (formData.password && !isPasswordValid)
      errors.password = "8+ caractères et au moins 1 chiffre.";
    if (formData.confirmPassword && !passwordsMatch)
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";
    return errors;
  }, [formData, isPasswordValid, passwordsMatch]);

  return (
    <Form method="post" className="space-y-4">
      {actionData?.error && <StatusMessage type="error" message={actionData.error} />}

      <div className="flex flex-col gap-1">
        <AuthInput
          name="password"
          label="Nouveau mot de passe"
          icon={Lock}
          type="password"
          showPasswordToggle
          autoComplete="new-password"
          placeholder="8+ caractères, 1 chiffre"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        {fieldErrors.password && (
          <span className="text-error text-xs ml-1">{fieldErrors.password}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <AuthInput
          name="confirmPassword"
          label="Confirmer le mot de passe"
          icon={Lock}
          type="password"
          showPasswordToggle
          autoComplete="new-password"
          placeholder="Répétez le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        {fieldErrors.confirmPassword && (
          <span className="text-error text-xs ml-1">{fieldErrors.confirmPassword}</span>
        )}
      </div>

      <AuthButton
        label="Mettre à jour le mot de passe"
        isLoading={isSubmitting}
        icon={ShieldCheck}
        variant="primary"
        disabled={!canSubmit}
      />
    </Form>
  );
}