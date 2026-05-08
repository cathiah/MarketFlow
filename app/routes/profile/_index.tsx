import { useOutletContext } from "react-router";
import { ProfilView } from "~/components/profile/ProfilView";
import type { Profile } from "~/types/profile";
import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = ({ matches }) => {
  const layoutMatch = matches.find((m) => m && m.id === "routes/dashboard/_layout");
  
  const layoutData = layoutMatch?.data as { user: Profile } | undefined;
  const profile = layoutData?.user;

  const displayName = profile?.full_name || profile?.username || "Utilisateur";

  return [
    { title: `${displayName} | Dashboard` },
    { name: "description", content: "Consultez vos informations personnelles." },
    { name: "robots", content: "noindex, nofollow" },
  ];
};


export default function ProfilPage() {
  const { user } = useOutletContext<{ user: Profile }>();
  return <ProfilView profile={user} />;
}
