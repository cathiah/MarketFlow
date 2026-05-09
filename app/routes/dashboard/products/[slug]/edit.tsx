import { createClient } from "~/lib/supabase.server";
import { data } from "react-router";
import { ProductForm } from "~/components/dashboard/products/ProductForm";
import type { Route } from "./+types/edit";
import type { Product } from "~/types/products";
import type { Category } from "~/types/category";
import { performEditProduct } from "./edit.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { supabase, headers } = createClient(request);
  
  const [p, c] = await Promise.all([
    supabase
      .from("products")
      .select("*, product_images (*)")
      .eq("slug", params.slug)
      .single(),
    supabase.from("categories").select("id, name").order("name")
  ]);

  if (p.error || !p.data) {
    throw data("Produit non trouvé", { status: 404, headers });
  }
  
  return data({ 
    product: p.data as Product, 
    categories: (c.data || []) as Category[] 
  }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await performEditProduct(request as any);
}

export const meta: Route.MetaFunction = ({ data }) => {
  const title = data?.product?.title || "Produit";
  
  return [
    { title: `Modifier "${title}" | Dashboard` },
    { name: "robots", content: "noindex, nofollow" }
  ];
};


export default function EditProductPage({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <ProductForm 
      actionData={actionData} 
      initialData={loaderData.product} 
      categories={loaderData.categories} 
    />
  );
}