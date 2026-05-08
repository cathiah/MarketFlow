import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import { CategoryForm } from "~/components/dashboard/categories/CategoryForm";
import type { Route } from "./+types/add";
import { performAddCategory } from "./add.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return data({ categories: categories || [] }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await performAddCategory(request);
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Ajouter une catégorie | Dashboard" },
    { name: "description", content: "Organisez votre catalogue en créant de nouvelles catégories." },
    { name: "robots", content: "noindex, nofollow" }
  ];
};

export default function AddCategory({ loaderData, actionData }: Route.ComponentProps) {
  return <CategoryForm actionData={actionData} categories={loaderData.categories} />;
}
