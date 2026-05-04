import { data, href, redirect } from "react-router";
import { createClient } from "~/lib/supabase.server";
import { AuthHeader } from "~/components/auth/AuthUI";
import { handleAuthAction } from "./auth.actions.server";
import { LoginForm } from "~/components/auth/LoginForm";
import type { Route } from "./+types/login";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect(href("/"), { headers });
  }

  return data({}, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await handleAuthAction(request);
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Connexion | MarketFlow" },
    { name: "description", content: "Accédez à votre espace vendeur ou acheteur. Gérez vos produits, vos commandes et votre profil en toute sécurité." },
    { property: "og:title", content: "Connectez-vous à MarketFlow" },
    { property: "og:type", content: "website" },
    { name: "robots", content: "index, follow" },
  ];
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="space-y-6">
      <AuthHeader 
        title="Bon retour !" 
        subtitle="Connectez-vous pour gérer vos articles." 
      />
      <LoginForm actionData={actionData} />
    </div>
  );
}
