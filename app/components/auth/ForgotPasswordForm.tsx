import React, { useState, useCallback } from "react";
import { Form, useNavigation, useActionData, Link, href } from "react-router";
import { Mail, Send, ArrowLeft } from "lucide-react";
import { AuthInput, AuthButton } from "./AuthUI";
import { StatusMessage } from "~/components/shared/StatusMessage";

type ActionData = {
  success?: boolean;
  error?: string;
  message?: string;
} | null;

export function ForgotPasswordForm({ actionData: _actionData }: { actionData?: ActionData } = {}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData() as ActionData;

  const [email, setEmail] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
  const isSuccess = actionData?.success === true;

  return (
    <div className="space-y-4">
      {isSuccess ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
              <Mail className="w-6 h-6 text-success" />
            </div>
            <p className="text-sm text-base-content/70 leading-relaxed max-w-xs">
              {actionData?.message ?? "Si cet email existe, un lien de réinitialisation vous a été envoyé."}
            </p>
            <p className="text-xs text-base-content/40">
              Pensez à vérifier vos spams.
            </p>
          </div>

          <Link
            to={href("/auth/login")}
            className="btn btn-ghost btn-block gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <Form method="post" className="space-y-4">
          {actionData?.error && <StatusMessage type="error" message={actionData.error} />}

          <AuthInput
            name="email"
            label="Adresse email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="votre@email.com"
            value={email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />

          <AuthButton
            label="Envoyer le lien"
            isLoading={isSubmitting}
            icon={Send}
            variant="primary"
            disabled={!isEmailValid}
          />

          <div className="flex justify-center pt-1">
            <Link
              to={href("/auth/login")}
              className="flex items-center gap-1.5 text-xs text-base-content/40 hover:text-base-content transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Retour à la connexion
            </Link>
          </div>
        </Form>
      )}
    </div>
  );
}