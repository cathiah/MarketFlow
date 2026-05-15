import { data, href, redirect } from "react-router";
import { createClient } from "~/lib/supabase.server";
import { AuthHeader } from "~/components/auth/AuthUI";
import { ResetPasswordForm } from "~/components/auth/ResetPasswordForm";
import type { Route } from "./+types/reset-password";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  // L'utilisateur doit être authentifié via le lien magique Supabase
  if (!user) {
    return redirect(href("/auth/forgot-password"), { headers });
  }

  return data({}, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createClient(request);
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8 || !/\d/.test(password)) {
    return data(
      { success: false, error: "Le mot de passe doit faire 8+ caractères et contenir au moins un chiffre." },
      { status: 400, headers }
    );
  }

  if (password !== confirmPassword) {
    return data(
      { success: false, error: "Les mots de passe ne correspondent pas." },
      { status: 400, headers }
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return data(
      { success: false, error: "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré." },
      { status: 500, headers }
    );
  }

  return redirect(href("/auth/login"), { headers });
}

export const meta: Route.MetaFunction = () => [
  { title: "Nouveau mot de passe | MarketFlow" },
  { name: "description", content: "Choisissez un nouveau mot de passe sécurisé." },
];

export default function ResetPasswordPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="space-y-6">
      <AuthHeader
        title="Nouveau mot de passe"
        subtitle="Choisissez un mot de passe sécurisé pour votre compte."
      />
      <ResetPasswordForm actionData={actionData} />
    </div>
  );
}