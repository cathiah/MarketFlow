import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import { ProductForm } from "~/components/dashboard/products/ProductForm";
import type { Route } from "./+types/add";
import type { Category } from "~/types/category";
import { performAddProduct } from "./add.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");
    
  return data({ categories: (categories || []) as Category[] }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await performAddProduct(request as any);
}

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Ajouter un nouvel produit | Dashboard" },
    { name: "description", content: "Créez une nouvelle fiche produit et mettez-la en vente." },
    { name: "robots", content: "noindex, nofollow" }
  ];
}

export default function AddProduct({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <ProductForm 
      actionData={actionData} 
      categories={loaderData.categories} 
    />
  );
}
