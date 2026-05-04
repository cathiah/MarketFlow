import { createClient } from "~/lib/supabase.server";
import { data, href, redirect } from "react-router";
import { validateProduct } from "~/schemas/product.server";
import { uploadProductImages } from "~/lib/storage.server";

export async function performAddProduct(request: Request) {
  const { supabase, headers } = createClient(request as any);
  const formData = await request.formData();

  const { errors, data: validatedData } = await validateProduct(formData, supabase);
  if (errors) return data({ success: false, errors }, { status: 400, headers });

  try {
    const images = formData.getAll("images") as File[];
    const urls = await uploadProductImages(supabase, images);

    const { data: product, error: pError } = await supabase.from("products").insert({
      ...validatedData,
      main_image_url: urls[0] || null,
    }).select().single();

    if (pError) throw pError;

    if (urls.length > 1) {
      await supabase.from("product_images").insert(
        urls.slice(1).map((url, i) => ({ product_id: product.id, url, display_order: i + 1 }))
      );
    }

    return redirect(href("/dashboard/products"), { headers });
  } catch (e: any) {
    return data({ success: false, errors: { form: e.message } }, { status: 500, headers });
  }
}
