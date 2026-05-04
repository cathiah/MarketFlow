import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import { CategoryForm } from "~/components/categories/CategoryForm";
import type { Route } from "./+types/edit";
import { performEditCategory } from "./edit.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  
  const [catRes, allCatsRes] = await Promise.all([
    supabase.from("categories").select("*").eq("slug", params.slug).single(),
    supabase.from("categories").select("id, name").order("name")
  ]);

  if (catRes.error || !catRes.data) {
    throw new Response("Catégorie non trouvée", { status: 404 });
  }
  
  return data({ 
    category: catRes.data, 
    categories: allCatsRes.data || [] 
  }, { headers });
}

export async function action({ request, params }: Route.ActionArgs) {
  return await performEditCategory(request, params.slug as string);
}

export const meta: Route.MetaFunction = ({ data }) => {
  const categoryName = data?.category?.name || "Catégorie";
  
  return [
    { title: `Modifier "${categoryName}" | Dashboard` },
    { name: "description", content: `Mise à jour des informations de la catégorie ${categoryName}.` },
    { name: "robots", content: "noindex, nofollow" }
  ];
};


export default function EditCategory({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <CategoryForm 
      actionData={actionData}
      initialData={loaderData.category} 
      categories={loaderData.categories} 
    />
  );
}
