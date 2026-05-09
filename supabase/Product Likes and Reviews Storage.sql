-- TABLE LIKES
CREATE TABLE IF NOT EXISTS public.product_likes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.product_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes are public"             ON public.product_likes FOR SELECT USING (true);
CREATE POLICY "Users can like"               ON public.product_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike"             ON public.product_likes FOR DELETE USING (auth.uid() = user_id);

-- TABLE REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are public"           ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers can review"            ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Buyers can update review"     ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Buyers can delete review"     ON public.reviews FOR DELETE USING (auth.uid() = user_id);