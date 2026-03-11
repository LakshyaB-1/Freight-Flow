-- Create storage bucket for shipment documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('shipment-documents', 'shipment-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create table to track document metadata
CREATE TABLE IF NOT EXISTS public.shipment_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on shipment_documents
ALTER TABLE public.shipment_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for shipment_documents
CREATE POLICY "Users can view their own documents"
ON public.shipment_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
ON public.shipment_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
ON public.shipment_documents FOR DELETE
USING (auth.uid() = user_id);

-- Storage policies for shipment-documents bucket
CREATE POLICY "Users can view their own shipment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own shipment files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own shipment files"
ON storage.objects FOR DELETE
USING (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);