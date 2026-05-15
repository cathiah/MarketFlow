import { data, href } from "react-router";
import { createClient } from "~/lib/supabase.server";
import { AuthHeader } from "~/components/auth/AuthUI";
import { ForgotPasswordForm } from "~/components/auth/ForgotPasswordForm";
import type { Route } from "./+types/forgot-password";

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createClient(request);
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return data(
      { success: false, error: "Veuillez entrer une adresse email valide." },
      { status: 400, headers }
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(request.url).origin}/auth/reset-password`,
  });

  if (error) {
    return data(
      { success: false, error: "Une erreur est survenue. Réessayez plus tard." },
      { status: 500, headers }
    );
  }

  // On renvoie toujours success=true pour ne pas révéler si l'email existe
  return data(
    { success: true, message: "Si cet email existe, un lien de réinitialisation vous a été envoyé." },
    { headers }
  );
}

export const meta: Route.MetaFunction = () => [
  { title: "Mot de passe oublié | MarketFlow" },
  { name: "description", content: "Réinitialisez votre mot de passe en quelques secondes." },
];

export default function ForgotPasswordPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="space-y-6">
      <AuthHeader
        title="Mot de passe oublié ?"
        subtitle="Entrez votre email pour recevoir un lien de réinitialisation."
      />
      <ForgotPasswordForm actionData={actionData} />
    </div>
  );
}