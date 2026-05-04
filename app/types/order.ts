import type { Profile } from "./profile";

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: {
    title: string;
    price: number;
  };
}

export interface Order {
  id: string;
  buyer_id: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: string | null;
  created_at: string;
  buyer?: Pick<Profile, 'full_name' | 'email'>;
  order_items: OrderItem[];
}
