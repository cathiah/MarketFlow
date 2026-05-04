import { data, href, redirect } from "react-router";
import { createClient } from "~/lib/supabase.server";
import { handleAuthAction } from "./auth.actions.server";
import { RegisterForm } from "~/components/auth/RegisterForm";
import { AuthHeader } from "~/components/auth/AuthUI";
import type { Route } from "./+types/register";

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
    { title: "Rejoignez l'aventure | Inscription" },
    { 
      name: "description", 
      content: "Créez votre compte en quelques secondes. Devenez vendeur pour proposer vos articles ou acheteur pour découvrir des produits uniques." 
    },
    { property: "og:title", content: "Créer un compte sur MarketFlow" },
    { property: "og:description", content: "Accès instantané à notre marketplace. Inscription rapide et sécurisée." },
    { name: "robots", content: "index, follow" },
  ];
};

export default function RegisterPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="space-y-6">
      <AuthHeader 
        title="Créer un compte" 
        subtitle="Rejoignez notre communauté en quelques clics." 
      />
      <RegisterForm actionData={actionData} />
    </div>
  );
}
