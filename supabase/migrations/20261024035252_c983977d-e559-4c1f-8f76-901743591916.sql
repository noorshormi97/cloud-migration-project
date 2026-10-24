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

  -- Snapshot the sale into analytics first (one event per order, ever).
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

  -- Confirmed means done: the order and its customer details are removed
  -- from the database entirely. Only the anonymous analytics snapshot remains.
  DELETE FROM public.order_items WHERE order_id = _order_id;
  DELETE FROM public.orders WHERE id = _order_id;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.confirm_order_with_analytics(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.confirm_order_with_analytics(uuid) TO authenticated;