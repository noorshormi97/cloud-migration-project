-- Enums
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.order_status AS ENUM ('Pending','Confirmed','Cancelled','Shipped','Delivered');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  denomination text NOT NULL DEFAULT '',
  currency text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  condition text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Coin',
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  item_count integer NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.combos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.combos TO authenticated;
GRANT ALL ON public.combos TO service_role;
ALTER TABLE public.combos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Combos are public" ON public.combos FOR SELECT USING (true);
CREATE POLICY "Admins manage combos" ON public.combos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER combos_updated_at BEFORE UPDATE ON public.combos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.combo_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id uuid NOT NULL REFERENCES public.combos(id) ON DELETE CASCADE,
  slot_number integer NOT NULL DEFAULT 0,
  country text NOT NULL DEFAULT '',
  denomination text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.combo_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.combo_items TO authenticated;
GRANT ALL ON public.combo_items TO service_role;
ALTER TABLE public.combo_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Combo items are public" ON public.combo_items FOR SELECT USING (true);
CREATE POLICY "Admins manage combo items" ON public.combo_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER combo_items_updated_at BEFORE UPDATE ON public.combo_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Faqs are public" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.contact_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL DEFAULT '',
  whatsapp_channel text NOT NULL DEFAULT '',
  facebook text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  admin_instagram text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_details TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_details TO authenticated;
GRANT ALL ON public.contact_details TO service_role;
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact details are public" ON public.contact_details FOR SELECT USING (true);
CREATE POLICY "Admins manage contact details" ON public.contact_details FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER contact_details_updated_at BEFORE UPDATE ON public.contact_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  courier text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  status public.order_status NOT NULL DEFAULT 'Pending',
  subtotal numeric NOT NULL DEFAULT 0,
  delivery_charge numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.place_order(
  _customer_name text,
  _customer_phone text,
  _customer_address text,
  _courier text,
  _note text,
  _delivery_charge numeric,
  _items jsonb
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_order_id uuid;
  item jsonb;
  line_price numeric;
  line_name text;
  line_qty integer;
  line_product uuid;
  running_subtotal numeric := 0;
BEGIN
  IF _customer_name IS NULL OR length(trim(_customer_name)) = 0 THEN RAISE EXCEPTION 'Name is required'; END IF;
  IF _customer_phone IS NULL OR length(trim(_customer_phone)) = 0 THEN RAISE EXCEPTION 'Phone is required'; END IF;
  IF _customer_address IS NULL OR length(trim(_customer_address)) = 0 THEN RAISE EXCEPTION 'Address is required'; END IF;
  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN RAISE EXCEPTION 'Cart is empty'; END IF;
  IF _delivery_charge IS NULL OR _delivery_charge < 0 THEN RAISE EXCEPTION 'Invalid delivery charge'; END IF;

  INSERT INTO public.orders (customer_name, customer_phone, customer_address, courier, note, subtotal, delivery_charge, total_price)
  VALUES (trim(_customer_name), trim(_customer_phone), trim(_customer_address), coalesce(_courier,''), coalesce(_note,''), 0, _delivery_charge, 0)
  RETURNING id INTO new_order_id;

  FOR item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    line_qty := coalesce((item->>'quantity')::integer, 1);
    IF line_qty < 1 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;

    IF (item->>'kind') = 'combo' THEN
      SELECT c.price, c.name INTO line_price, line_name
      FROM public.combos c WHERE c.id = (item->>'id')::uuid AND c.available = true;
      IF line_price IS NULL THEN RAISE EXCEPTION 'Combo unavailable'; END IF;
      line_product := NULL;
    ELSE
      SELECT p.price, p.name, p.id INTO line_price, line_name, line_product
      FROM public.products p
      WHERE p.id = (item->>'id')::uuid AND p.available = true AND p.stock >= line_qty
      FOR UPDATE;
      IF line_price IS NULL THEN RAISE EXCEPTION 'Product unavailable or out of stock'; END IF;
      UPDATE public.products SET stock = stock - line_qty WHERE id = line_product;
    END IF;

    INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (new_order_id, line_product, line_name, line_qty, line_price);

    running_subtotal := running_subtotal + (line_price * line_qty);
  END LOOP;

  UPDATE public.orders
  SET subtotal = running_subtotal, total_price = running_subtotal + _delivery_charge
  WHERE id = new_order_id;

  RETURN new_order_id;
END; $$;

GRANT EXECUTE ON FUNCTION public.place_order(text,text,text,text,text,numeric,jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;

CREATE POLICY "Admins upload product images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update product images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete product images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone reads product images" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');
