-- Analytics ledger: permanent, privacy-safe business outcome history.
CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL UNIQUE,
  outcome text NOT NULL CHECK (outcome IN ('Confirmed','Cancelled')),
  event_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.analytics_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.analytics_events(id) ON DELETE CASCADE,
  item_kind text NOT NULL DEFAULT 'product',
  item_name text NOT NULL,
  item_id uuid,
  item_type text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_events_outcome_idx ON public.analytics_events (outcome);
CREATE INDEX analytics_events_event_at_idx ON public.analytics_events (event_at DESC);
CREATE INDEX analytics_items_event_id_idx ON public.analytics_items (event_id);

GRANT SELECT ON public.analytics_events TO authenticated;
GRANT SELECT ON public.analytics_items TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
GRANT ALL ON public.analytics_items TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage analytics events" ON public.analytics_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage analytics items" ON public.analytics_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Atomic confirm + analytics capture. Records the confirmed outcome (with
-- historical snapshots of every order line) before continuing the existing
-- confirmation workflow. One analytics event per order, ever.
CREATE OR REPLACE FUNCTION public.confirm_order_with_analytics(_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  ev_id uuid;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorised to confirm orders';
  END IF;

  INSERT INTO public.analytics_events (order_id, outcome)
  SELECT _order_id, 'Confirmed'
  FROM public.orders
  WHERE id = _order_id
  ON CONFLICT (order_id) DO NOTHING
  RETURNING id INTO ev_id;

  IF ev_id IS NOT NULL THEN
    INSERT INTO public.analytics_items
      (event_id, item_kind, item_name, item_id, item_type, quantity, unit_price)
    SELECT
      ev_id,
      oi.item_kind,
      oi.product_name,
      COALESCE(oi.source_id, oi.product_id),
      COALESCE(
        CASE oi.item_kind
          WHEN 'product' THEN (SELECT p.type FROM public.products p WHERE p.id = oi.product_id)
          WHEN 'new_arrival' THEN (SELECT na.type FROM public.new_arrivals na WHERE na.id = oi.source_id)
          WHEN 'start_collecting' THEN (SELECT sc.type FROM public.start_collecting sc WHERE sc.id = oi.source_id)
          ELSE 'Combo'
        END,
        'Product'
      ),
      oi.quantity,
      oi.unit_price
    FROM public.order_items oi
    WHERE oi.order_id = _order_id;
  END IF;

  -- Continue the existing confirmation workflow exactly as before.
  UPDATE public.orders SET status = 'Confirmed' WHERE id = _order_id;
END;
$function$;

-- Cancellation keeps its existing stock-restoration behaviour and now also
-- records the cancelled outcome in analytics, idempotently.
CREATE OR REPLACE FUNCTION public.cancel_order(_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_status public.order_status;
  line           RECORD;
  src            uuid;
  ev_id          uuid;
BEGIN
  -- Only a signed-in admin may cancel. This function runs as SECURITY DEFINER
  -- (it bypasses RLS), so this check is the security boundary.
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorised to cancel orders';
  END IF;

  -- Lock the order so two admins clicking at the same moment cannot both
  -- restore the stock.
  SELECT status INTO current_status
  FROM public.orders
  WHERE id = _order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  -- Already cancelled: stop here rather than refunding stock a second time.
  IF current_status = 'Cancelled' THEN
    RETURN;
  END IF;

  -- Record the cancellation in analytics first (one event per order, ever).
  INSERT INTO public.analytics_events (order_id, outcome)
  VALUES (_order_id, 'Cancelled')
  ON CONFLICT (order_id) DO NOTHING
  RETURNING id INTO ev_id;

  IF ev_id IS NOT NULL THEN
    INSERT INTO public.analytics_items
      (event_id, item_kind, item_name, item_id, item_type, quantity, unit_price)
    SELECT
      ev_id,
      oi.item_kind,
      oi.product_name,
      COALESCE(oi.source_id, oi.product_id),
      COALESCE(
        CASE oi.item_kind
          WHEN 'product' THEN (SELECT p.type FROM public.products p WHERE p.id = oi.product_id)
          WHEN 'new_arrival' THEN (SELECT na.type FROM public.new_arrivals na WHERE na.id = oi.source_id)
          WHEN 'start_collecting' THEN (SELECT sc.type FROM public.start_collecting sc WHERE sc.id = oi.source_id)
          ELSE 'Combo'
        END,
        'Product'
      ),
      oi.quantity,
      oi.unit_price
    FROM public.order_items oi
    WHERE oi.order_id = _order_id;
  END IF;

  -- Put back exactly what place_order() took out, per line kind.
  FOR line IN
    SELECT product_id, source_id, quantity, item_kind
    FROM public.order_items
    WHERE order_id = _order_id
  LOOP
    src := coalesce(line.source_id, line.product_id);
    CONTINUE WHEN src IS NULL;

    IF line.item_kind = 'product' THEN
      UPDATE public.products
      SET stock = stock + line.quantity
      WHERE id = src;

    ELSIF line.item_kind = 'new_arrival' THEN
      UPDATE public.new_arrivals
      SET stock = stock + line.quantity
      WHERE id = src;

    ELSIF line.item_kind = 'start_collecting' THEN
      UPDATE public.start_collecting
      SET stock = stock + line.quantity
      WHERE id = src;

    -- 'combo' holds no stock of its own, so there is nothing to restore.
    END IF;
  END LOOP;

  UPDATE public.orders
  SET status = 'Cancelled'
  WHERE id = _order_id;
END;
$function$;

-- Read model for the Analytics page: aggregates computed database-side so the
-- browser never downloads the whole history just to calculate totals.
CREATE OR REPLACE FUNCTION public.get_analytics()
 RETURNS json
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT json_build_object(
    'total_confirmed', (SELECT count(*) FROM public.analytics_events WHERE outcome = 'Confirmed'),
    'total_cancelled', (SELECT count(*) FROM public.analytics_events WHERE outcome = 'Cancelled'),
    'total_banknotes_sold', (
      SELECT COALESCE(sum(i.quantity), 0)
      FROM public.analytics_items i
      JOIN public.analytics_events e ON e.id = i.event_id
      WHERE e.outcome = 'Confirmed' AND i.item_type = 'Banknote'
    ),
    'total_revenue', (
      SELECT COALESCE(sum(i.quantity * i.unit_price), 0)
      FROM public.analytics_items i
      JOIN public.analytics_events e ON e.id = i.event_id
      WHERE e.outcome = 'Confirmed'
    ),
    'best_sellers', (
      SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json)
      FROM (
        SELECT i.item_name AS name,
               i.item_type AS type,
               sum(i.quantity) AS total_quantity,
               sum(i.quantity * i.unit_price) AS total_value
        FROM public.analytics_items i
        JOIN public.analytics_events e ON e.id = i.event_id
        WHERE e.outcome = 'Confirmed'
        GROUP BY i.item_name, i.item_type
        ORDER BY total_quantity DESC, i.item_name ASC
        LIMIT 10
      ) t
    ),
    'history', (
      SELECT COALESCE(json_agg(ev ORDER BY ev.event_at DESC), '[]'::json)
      FROM (
        SELECT e.id, e.order_id, e.outcome, e.event_at,
          COALESCE(
            json_agg(
              json_build_object('name', i.item_name, 'type', i.item_type, 'quantity', i.quantity, 'unit_price', i.unit_price)
              ORDER BY i.id
            ),
            '[]'::json
          ) AS items
        FROM public.analytics_events e
        LEFT JOIN public.analytics_items i ON i.event_id = e.id
        GROUP BY e.id
        ORDER BY e.event_at DESC
        LIMIT 100
      ) ev
    )
  );
$function$;

-- Permanent erase of analytics data only. Admin-only, checked inside the
-- routine itself; it never touches orders, products, stock or customer data.
CREATE OR REPLACE FUNCTION public.delete_analytics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorised to delete analytics';
  END IF;
  DELETE FROM public.analytics_items;
  DELETE FROM public.analytics_events;
END;
$function$;

-- Only signed-in users may execute these routines (each also re-checks the
-- admin role inside, so this is defence in depth, not the security boundary).
REVOKE EXECUTE ON FUNCTION public.confirm_order_with_analytics(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_analytics() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.delete_analytics() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cancel_order(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_order_with_analytics(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_order(uuid) TO authenticated;
