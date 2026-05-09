export async function validateProduct(formData: FormData, supabase: any, productId?: string) {
  const errors: Record<string, string> = {};
  
  const rawAttributeKeys = formData.getAll("attribute_key").map((value) => String(value).trim());
  const rawAttributeValues = formData.getAll("attribute_value").map((value) => String(value));

  const attributes: Record<string, string | number | boolean> = {};
  rawAttributeKeys.forEach((key, index) => {
    if (!key) return;
    const rawValue = String(rawAttributeValues[index] || "").trim();
    if (rawValue === "") return;

    if (/^(true|false)$/i.test(rawValue)) {
      attributes[key] = rawValue.toLowerCase() === "true";
    } else if (!Number.isNaN(Number(rawValue)) && rawValue !== "") {
      attributes[key] = Number(rawValue);
    } else {
      attributes[key] = rawValue;
    }
  });

  const data = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    slug: String(formData.get("slug") || "").trim(),
    price: Number(formData.get("price")),
    stock_quantity: Number(formData.get("stock_quantity")),
    category_id: formData.get("category_id") as string,
    is_published: formData.get("is_published") === "on",
    attributes: Object.keys(attributes).length > 0 ? attributes : null,
  };

  if (data.title.length < 10) errors.title = "Le titre doit faire au moins 10 caractères.";
  if (data.description.length < 50) errors.description = "La description est trop courte (min. 50 car.).";
  if (data.price <= 0) errors.price = "Le prix doit être positif.";
  if (!data.category_id) errors.category_id = "Veuillez choisir une catégorie.";

  let query = supabase.from("products").select("id").eq("slug", data.slug);
  if (productId) query = query.neq("id", productId);
  
  const { data: existing } = await query.maybeSingle();
  if (existing) errors.slug = "Cette URL est déjà utilisée par un autre produit.";

  return { errors: Object.keys(errors).length > 0 ? errors : null, data };
}
