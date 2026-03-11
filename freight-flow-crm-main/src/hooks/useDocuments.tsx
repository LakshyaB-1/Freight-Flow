import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api';
import { toast } from 'sonner';

export interface ShipmentDocument {
  _id: string;
  id?: string;
  shipmentId: string;
  fileName: string;
  filePath: string;
  fileType: string | null;
  fileSize: number | null;
  createdAt: string;
}

export const useDocuments = (shipmentId: string | null) => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['documents', shipmentId],
    queryFn: async () => {
      if (!shipmentId) return [];
      const response = await documentsApi.getByShipment(shipmentId);
      return response.data.map((d: any) => ({ ...d, id: d._id }));
    },
    enabled: !!shipmentId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!shipmentId) throw new Error('No shipment selected');
      setUploading(true);
      return documentsApi.upload(shipmentId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', shipmentId] });
      toast.success('Document uploaded successfully');
      setUploading(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload document');
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', shipmentId] });
      toast.success('Document deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete document');
    },
  });

  const uploadDocument = useCallback(
    (file: File) => uploadMutation.mutate(file),
    [uploadMutation]
  );

  const deleteDocument = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation]
  );

  const getDownloadUrl = useCallback(
    (id: string) => documentsApi.getDownloadUrl(id),
    []
  );

  return {
    documents: data || [],
    loading: isLoading,
    uploading,
    uploadDocument,
    deleteDocument,
    getDownloadUrl,
  };
};
