export type UserRole = 'buyer' | 'seller' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  username: string | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  shipping_address: string | null;
  billing_address: string | null;
  created_at: string;
  updated_at: string;
}
