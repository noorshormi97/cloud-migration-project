-- Track stock lifecycle per order (stock is deducted at placement time by place_order)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stock_deducted boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS stock_restored boolean NOT NULL DEFAULT false;

-- Existing cancelled orders: treat as already settled so they can't restore later
UPDATE public.orders SET stock_restored = true WHERE status = 'Cancelled';

ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'Completed';

CREATE OR REPLACE FUNCTION public.cancel_order(_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  o public.orders%ROWTYPE;
  it public.order_items%ROWTYPE;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT * INTO o FROM public.orders WHERE id = _order_id FOR UPDATE;
  IF o.id IS NULL THEN RAISE EXCEPTION 'Order not found'; END IF;

  IF o.status = 'Cancelled'::order_status THEN
    RETURN false;
  END IF;

  IF o.stock_deducted AND NOT o.stock_restored THEN
    FOR it IN SELECT * FROM public.order_items WHERE order_id = _order_id LOOP
      IF it.item_kind = 'new_arrival' THEN
        UPDATE public.new_arrivals
          SET stock = stock + it.quantity, available = true
          WHERE lower(name) = lower(it.product_name);
      ELSIF it.item_kind = 'start_collecting' THEN
        UPDATE public.start_collecting
          SET stock = stock + it.quantity, available = true
          WHERE lower(name) = lower(it.product_name);
      ELSIF it.item_kind = 'combo' THEN
        NULL; -- combos do not track stock
      ELSE
        IF it.product_id IS NOT NULL THEN
          UPDATE public.products
            SET stock = stock + it.quantity, available = true
            WHERE id = it.product_id;
        END IF;
      END IF;
    END LOOP;

    UPDATE public.orders
      SET status = 'Cancelled'::order_status, stock_restored = true
      WHERE id = _order_id;
  ELSE
    UPDATE public.orders
      SET status = 'Cancelled'::order_status
      WHERE id = _order_id;
  END IF;

  RETURN true;
END; $$;

REVOKE ALL ON FUNCTION public.cancel_order(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.cancel_order(uuid) TO authenticated;
