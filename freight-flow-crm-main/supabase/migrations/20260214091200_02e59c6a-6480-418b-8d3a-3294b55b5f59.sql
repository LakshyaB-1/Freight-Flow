
-- Function to auto-complete milestones when shipment current_status changes
CREATE OR REPLACE FUNCTION public.auto_update_milestones()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  status_lower text;
  milestone_keys text[];
  mk text;
BEGIN
  -- Only act when current_status actually changes
  IF OLD.current_status IS NOT DISTINCT FROM NEW.current_status THEN
    RETURN NEW;
  END IF;

  status_lower := lower(trim(COALESCE(NEW.current_status, '')));

  -- Map current_status values to milestone keys that should be completed
  -- Each status completes itself AND all prior milestones
  CASE
    WHEN status_lower IN ('delivered', 'delivery done', 'completed') THEN
      milestone_keys := ARRAY['booking_confirmed','cargo_picked_up','export_customs_cleared','departed','arrived','import_customs_cleared','delivered'];
    WHEN status_lower IN ('import customs cleared', 'import cleared', 'customs cleared at destination') THEN
      milestone_keys := ARRAY['booking_confirmed','cargo_picked_up','export_customs_cleared','departed','arrived','import_customs_cleared'];
    WHEN status_lower IN ('arrived', 'arrival', 'vessel arrived', 'flight arrived') THEN
      milestone_keys := ARRAY['booking_confirmed','cargo_picked_up','export_customs_cleared','departed','arrived'];
    WHEN status_lower IN ('departed', 'in transit', 'sailing', 'vessel departed', 'shipped') THEN
      milestone_keys := ARRAY['booking_confirmed','cargo_picked_up','export_customs_cleared','departed'];
    WHEN status_lower IN ('export customs cleared', 'export cleared', 'customs cleared') THEN
      milestone_keys := ARRAY['booking_confirmed','cargo_picked_up','export_customs_cleared'];
    WHEN status_lower IN ('cargo picked up', 'picked up', 'collected') THEN
      milestone_keys := ARRAY['booking_confirmed','cargo_picked_up'];
    WHEN status_lower IN ('booking confirmed', 'booked', 'confirmed') THEN
      milestone_keys := ARRAY['booking_confirmed'];
    ELSE
      -- Unknown status, do nothing
      RETURN NEW;
  END CASE;

  -- Upsert each milestone as completed
  FOREACH mk IN ARRAY milestone_keys
  LOOP
    INSERT INTO public.shipment_milestones (shipment_id, user_id, milestone_type, status, milestone_date)
    VALUES (NEW.id, NEW.user_id, mk, 'completed', now())
    ON CONFLICT (shipment_id, milestone_type)
    DO UPDATE SET status = 'completed', milestone_date = COALESCE(shipment_milestones.milestone_date, now()), updated_at = now()
    WHERE shipment_milestones.status != 'completed';
  END LOOP;

  RETURN NEW;
END;
$$;

-- Add unique constraint needed for ON CONFLICT
ALTER TABLE public.shipment_milestones 
ADD CONSTRAINT shipment_milestones_shipment_milestone_unique 
UNIQUE (shipment_id, milestone_type);

-- Create trigger on shipments table
CREATE TRIGGER auto_milestone_on_status_change
AFTER UPDATE ON public.shipments
FOR EACH ROW
EXECUTE FUNCTION public.auto_update_milestones();
