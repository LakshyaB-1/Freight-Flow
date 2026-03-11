
-- Create storage bucket for shipment documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('shipment-documents', 'shipment-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for shipment documents
CREATE POLICY "Users can upload shipment documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view shipment documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shipment-documents');

CREATE POLICY "Users can delete their shipment documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
