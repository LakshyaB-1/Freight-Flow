import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const DOCUMENT_TYPES = [
  { key: 'bill_of_lading', label: 'Bill of Lading / AWB' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'packing_list', label: 'Packing List' },
  { key: 'customs', label: 'Customs Documents' },
  { key: 'other', label: 'Other' },
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number]['key'];

export interface ShipmentDoc {
  id: string;
  shipmentId: string;
  fileName: string;
  filePath: string;
  fileType: string | null;
  fileSize: number | null;
  documentType: DocumentType;
  createdAt: string;
}

const mapRow = (row: any): ShipmentDoc => ({
  id: row.id,
  shipmentId: row.shipment_id,
  fileName: row.file_name,
  filePath: row.file_path,
  fileType: row.file_type,
  fileSize: row.file_size,
  documentType: row.document_type || 'other',
  createdAt: row.created_at,
});

export const useDocumentsSupabase = (shipmentId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['documents', shipmentId],
    queryFn: async () => {
      if (!shipmentId) return [];
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
    enabled: !!shipmentId && !!user,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, documentType }: { file: File; documentType: DocumentType }) => {
      if (!shipmentId || !user) throw new Error('Missing context');
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${shipmentId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('shipment-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert metadata
      const { error: dbError } = await supabase
        .from('shipment_documents')
        .insert({
          shipment_id: shipmentId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          document_type: documentType,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', shipmentId] });
      toast.success('Document uploaded');
      setUploading(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Upload failed');
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (doc: ShipmentDoc) => {
      // Delete from storage
      await supabase.storage.from('shipment-documents').remove([doc.filePath]);
      // Delete metadata
      const { error } = await supabase.from('shipment_documents').delete().eq('id', doc.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', shipmentId] });
      toast.success('Document deleted');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Delete failed');
    },
  });

  const uploadDocument = useCallback(
    (file: File, documentType: DocumentType = 'other') =>
      uploadMutation.mutateAsync({ file, documentType }),
    [uploadMutation]
  );

  const deleteDocument = useCallback(
    (doc: ShipmentDoc) => deleteMutation.mutate(doc),
    [deleteMutation]
  );

  const getDownloadUrl = useCallback(async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from('shipment-documents')
      .createSignedUrl(filePath, 3600);
    if (error) throw error;
    return data?.signedUrl || '';
  }, []);

  return {
    documents: data || [],
    loading: isLoading,
    uploading,
    uploadDocument,
    deleteDocument,
    getDownloadUrl,
  };
};
