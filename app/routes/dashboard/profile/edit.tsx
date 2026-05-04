import { data, href, redirect } from "react-router";
import { createClient } from "~/lib/supabase.server";
import { ProfilEditView } from "~/components/profile/ProfilEditView";
import type { Profile } from "~/types/profile";
import type { Route } from "./+types/edit";
import { performUpdateProfile } from "./edit.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw redirect(href("/auth/login"), { headers });

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) throw data("Profil non trouvé", { status: 404, headers });

  let finalAvatarUrl = profile.avatar_url;
  if (finalAvatarUrl && !finalAvatarUrl.startsWith('http')) {
    finalAvatarUrl = supabase.storage.from("avatars").getPublicUrl(finalAvatarUrl).data.publicUrl;
  }

  return data({ profile: { ...profile, avatar_url: finalAvatarUrl } as Profile }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await performUpdateProfile(request as any);
}

export const meta: Route.MetaFunction = ({ data }) => {
  const username = data?.profile?.username || "Utilisateur";
  
  return [
    { title: `Édition du Profil | ${username}` },
    { name: "description", content: "Mettez à jour vos informations personnelles, votre adresse de livraison et votre avatar." },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: `Paramètres du compte - ${username}` },
  ];
};

export default function EditProfilPage({ loaderData }: Route.ComponentProps) {
  return <ProfilEditView profile={loaderData.profile} />;
}
