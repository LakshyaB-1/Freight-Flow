
-- Create shipment_milestones table
CREATE TABLE public.shipment_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  milestone_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  milestone_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipment_milestones ENABLE ROW LEVEL SECURITY;

-- RLS policies for milestones
CREATE POLICY "Users can view their own milestones"
  ON public.shipment_milestones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create milestones"
  ON public.shipment_milestones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
  ON public.shipment_milestones FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
  ON public.shipment_milestones FOR DELETE
  USING (auth.uid() = user_id);

-- Add document_type column to shipment_documents
ALTER TABLE public.shipment_documents
  ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'other';

-- Trigger to auto-update updated_at on milestones
CREATE TRIGGER update_shipment_milestones_updated_at
  BEFORE UPDATE ON public.shipment_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
