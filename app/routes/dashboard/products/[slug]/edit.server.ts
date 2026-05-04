import { createClient } from "~/lib/supabase.server";
import { data, href, redirect } from "react-router";
import { validateProduct } from "~/schemas/product.server";
import { uploadProductImages } from "~/lib/storage.server";
import { updateProductWithImages } from "~/services/products.server";

export async function performEditProduct(request: Request) {
  const { supabase, headers } = createClient(request as any);
  const formData = await request.formData();
  const productId = formData.get("id") as string;

  const { errors, data: validatedData } = await validateProduct(formData, supabase, productId);
  if (errors) {
    return data({ success: false, errors }, { status: 400, headers });
  }

  try {
    const keepImages = formData.getAll("keep_images") as string[];
    const newFiles = (formData.getAll("images") as File[]);
    const newUrls = await uploadProductImages(supabase, newFiles);
    
    const allImages = [...keepImages, ...newUrls];

    await updateProductWithImages(supabase, productId, validatedData, allImages);

    return redirect(href("/dashboard/products"), { headers });
  } catch (e: any) {
    return data({ success: false, errors: { form: e.message } }, { status: 500, headers });
  }
}
