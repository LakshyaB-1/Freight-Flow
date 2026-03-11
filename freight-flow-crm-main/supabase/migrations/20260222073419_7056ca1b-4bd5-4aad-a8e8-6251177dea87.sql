-- Make the shipment-documents bucket private
UPDATE storage.buckets SET public = false WHERE id = 'shipment-documents';

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Users can view shipment documents" ON storage.objects;

-- Drop and recreate to ensure correct definition
DROP POLICY IF EXISTS "Users can view their own shipment files" ON storage.objects;
CREATE POLICY "Users can view their own shipment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'shipment-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
