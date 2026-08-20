CREATE TABLE public.new_arrivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  condition text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  is_new boolean NOT NULL DEFAULT true,
  enabled boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  image text NOT NULL DEFAULT '',
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.new_arrivals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.new_arrivals TO authenticated;
GRANT ALL ON public.new_arrivals TO service_role;

ALTER TABLE public.new_arrivals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "New arrivals are public" ON public.new_arrivals FOR SELECT USING (true);
CREATE POLICY "Admins manage new arrivals" ON public.new_arrivals FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER new_arrivals_set_updated_at BEFORE UPDATE ON public.new_arrivals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();