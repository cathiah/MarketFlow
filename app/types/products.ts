import type { Category } from "./category";
import type { ProductImage } from "./product-image";

export interface Product {
  id: string;
  seller_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  is_published: boolean;
  main_image_url: string | null;
  attributes: Record<string, string | number | boolean> | null;
  categories: Pick<Category, "name"> | null;
  product_images?: ProductImage[];
  created_at: string;
  updated_at: string;
}