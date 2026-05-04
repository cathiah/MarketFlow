import { data } from "react-router";
import type { Route } from "./+types/_index";
import { getCategories, performDeleteCategory } from "./categories.server";
import { CategoryList } from "~/components/categories/CategoryList";

export async function loader({ request }: Route.LoaderArgs) {
  const { categories, headers } = await getCategories(request);
  return data({ categories }, { headers });
}

export async function action({ request }: Route.ActionArgs) {
  return await performDeleteCategory(request);
}

export const meta: Route.MetaFunction = ({ data }) => {
  const count = data?.categories?.length || 0;
  return [
    { title: `Gestion des catégories (${count}) | Dashboard` },
    { name: "description", content: "Liste et gestion des catégories de votre boutique." },
    { name: "robots", content: "noindex, nofollow" }
  ];
};

export default function CategoryIndex({ loaderData: { categories } }: Route.ComponentProps) {
  return <CategoryList categories={categories} />;
}
