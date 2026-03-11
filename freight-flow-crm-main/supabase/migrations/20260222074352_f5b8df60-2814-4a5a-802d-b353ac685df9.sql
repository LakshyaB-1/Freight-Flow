-- Add admin view policy on shipment_milestones for consistency with other tables
CREATE POLICY "Admins can view all milestones"
  ON public.shipment_milestones FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));