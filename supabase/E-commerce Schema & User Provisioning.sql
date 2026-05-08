-- ==========================================
-- 1. NETTOYAGE COMPLET (Reset)
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS order_status;

-- ==========================================
-- 2. EXTENSIONS ET TYPES ENUM
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

-- ==========================================
-- 3. TABLES PRINCIPALES
-- ==========================================

CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'buyer',
  username TEXT UNIQUE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT DEFAULT NULL,
  shipping_address TEXT,
  billing_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE DEFAULT auth.uid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  is_published BOOLEAN DEFAULT false,
  main_image_url TEXT,
  attributes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status order_status DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12,2) NOT NULL
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  provider TEXT NOT NULL, -- 'stripe', 'paypal', etc.
  payment_details JSONB NOT NULL, -- {card_brand, last_4, email, etc.}
  external_id TEXT, -- transaction ID from provider
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. FONCTIONS ET AUTOMATISATION
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, username, email)
  VALUES (
    new.id, 
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'buyer'::user_role),
    COALESCE(new.raw_user_meta_data->>'full_name', 'Utilisateur'), 
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created 
AFTER INSERT ON auth.users 
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 5. STOCKAGE (BUCKETS)
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;

-- ==========================================
-- 6. SÉCURITÉ RLS (POLITIQUES)
-- ==========================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- CATEGORIES (Lecture publique, Modification Admin)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL 
USING ( (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' );

-- PRODUITS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are public" ON public.products FOR SELECT USING (is_published = true OR auth.uid() = seller_id);
CREATE POLICY "Sellers can manage their products" ON public.products FOR ALL 
USING ( auth.uid() = seller_id )
WITH CHECK ( (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('seller', 'admin') );
CREATE POLICY "Authenticated users can update product stock" ON public.products FOR UPDATE TO authenticated 
USING (true) 
WITH CHECK (true);

-- COMMANDES (ORDERS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers can view orders containing their products"
ON public.orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.order_items oi
    JOIN public.products p ON p.id = oi.product_id
    WHERE oi.order_id = orders.id AND p.seller_id = auth.uid()
  )
);
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (
  auth.uid() = buyer_id
);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Authenticated users can create orders" ON public.orders FOR INSERT TO authenticated 
WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Users can delete their own orders" ON public.orders FOR DELETE USING (auth.uid() = buyer_id);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- DÉTAILS COMMANDES (ORDER_ITEMS)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can delete their own order items" ON public.order_items FOR DELETE USING ( EXISTS ( SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid() ) );

-- PAIEMENTS (PAYMENTS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (
  EXISTS ( SELECT 1 FROM public.orders o WHERE o.id = payments.order_id AND o.buyer_id = auth.uid() )
);
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id) WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Authenticated users can create payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (
  EXISTS ( SELECT 1 FROM public.orders o WHERE o.id = payments.order_id AND o.buyer_id = auth.uid() )
);
CREATE POLICY "Users can delete their own payments" ON public.payments FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = payments.order_id AND o.buyer_id = auth.uid()
  )
);
CREATE POLICY "Sellers can view payments of their orders"
ON public.payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.order_items oi
    JOIN public.products p ON p.id = oi.product_id
    WHERE oi.order_id = payments.order_id
      AND p.seller_id = auth.uid()
  )
);

-- IMAGE PRODUITS (PRODUCT_IMAGES)
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images are public" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their product images" ON public.product_images FOR INSERT TO authenticated 
WITH CHECK ( 
  EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_images.product_id AND p.seller_id = auth.uid()
  )
);
CREATE POLICY "Sellers can update their product images" ON public.product_images FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_images.product_id AND p.seller_id = auth.uid()
  )
);
CREATE POLICY "Sellers can delete their product images" ON public.product_images FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_images.product_id AND p.seller_id = auth.uid()
  )
);

-- STOCKAGE (STORAGE)
CREATE POLICY "Images are public" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'products'));
CREATE POLICY "Sellers can upload images" ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id IN ('avatars', 'products'));

-- ==========================================
-- 7. INDEX POUR LA PERFORMANCE
-- ==========================================
CREATE INDEX idx_products_attributes ON public.products USING GIN (attributes);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
