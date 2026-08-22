CREATE TABLE public.start_collecting (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  price numeric not null default 0,
  image text not null default '',
  product_id uuid references public.products(id) on delete set null,
  display_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.start_collecting TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.start_collecting TO authenticated;
GRANT ALL ON public.start_collecting TO service_role;

ALTER TABLE public.start_collecting ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Start collecting is public" ON public.start_collecting FOR SELECT USING (true);
CREATE POLICY "Admins manage start collecting" ON public.start_collecting FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER start_collecting_set_updated_at BEFORE UPDATE ON public.start_collecting
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.start_collecting (name, price, image, product_id, display_order)
SELECT p.name, p.price, COALESCE(p.images[1], ''), p.id, (row_number() over (order by p.price asc, p.created_at asc)) - 1
FROM public.products p
WHERE p.available = true AND p.price > 0
ORDER BY p.price ASC, p.created_at ASC
LIMIT 10;