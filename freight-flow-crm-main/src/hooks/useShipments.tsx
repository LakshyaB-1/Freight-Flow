import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Shipment, ShipmentFormData } from '@/types/shipment';
import { toast } from 'sonner';

// Map DB row (snake_case) to frontend Shipment (camelCase)
const mapRowToShipment = (row: any): Shipment => ({
  id: row.id,
  date: row.date,
  blDate: row.bl_date,
  consignee: row.consignee,
  shipper: row.shipper,
  commodity: row.commodity,
  containerNo: row.container_no,
  containerSize: row.container_size,
  shippingLine: row.shipping_line,
  type: row.type,
  forwarder: row.forwarder,
  cha: row.cha,
  noOfPackets: row.no_of_packets,
  weight: row.weight,
  cbm: row.cbm,
  status: (row.status || 'pending').toUpperCase(),
  beNo: row.be_no,
  beDate: row.be_date,
  currentStatus: row.current_status,
  iecNo: row.iec_no,
  isAirway: row.is_airway ?? false,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Map frontend form data (camelCase) to DB insert (snake_case)
const mapFormToRow = (data: ShipmentFormData | Partial<ShipmentFormData>, userId?: string) => {
  const row: any = {};
  if (userId) row.user_id = userId;
  if (data.date !== undefined) row.date = data.date;
  if (data.blDate !== undefined) row.bl_date = data.blDate || null;
  if (data.consignee !== undefined) row.consignee = data.consignee;
  if (data.shipper !== undefined) row.shipper = data.shipper;
  if (data.commodity !== undefined) row.commodity = data.commodity;
  if (data.containerNo !== undefined) row.container_no = data.containerNo || null;
  if (data.containerSize !== undefined) row.container_size = data.containerSize || null;
  if (data.shippingLine !== undefined) row.shipping_line = data.shippingLine || null;
  if (data.type !== undefined) row.type = data.type || null;
  if (data.forwarder !== undefined) row.forwarder = data.forwarder || null;
  if (data.cha !== undefined) row.cha = data.cha || null;
  if (data.noOfPackets !== undefined) row.no_of_packets = data.noOfPackets;
  if (data.weight !== undefined) row.weight = data.weight;
  if (data.cbm !== undefined) row.cbm = data.cbm;
  if (data.status !== undefined) row.status = data.status?.toLowerCase();
  if (data.beNo !== undefined) row.be_no = data.beNo || null;
  if (data.beDate !== undefined) row.be_date = data.beDate || null;
  if (data.currentStatus !== undefined) row.current_status = data.currentStatus || null;
  if (data.iecNo !== undefined) row.iec_no = data.iecNo || null;
  if (data.isAirway !== undefined) row.is_airway = data.isAirway;
  return row;
};

export const useShipments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapRowToShipment);
    },
    enabled: !!user,
    staleTime: 30_000, // 30s — avoid redundant refetches
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: async (formData: ShipmentFormData) => {
      if (!user) throw new Error('Not authenticated');
      const row = mapFormToRow(formData, user.id);
      const { error } = await supabase.from('shipments').insert(row);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      toast.success('Shipment created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create shipment');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data: formData, oldCurrentStatus }: { id: string; data: Partial<ShipmentFormData>; oldCurrentStatus?: string | null }) => {
      const row = mapFormToRow(formData);
      const { error } = await supabase.from('shipments').update(row).eq('id', id);
      if (error) throw error;
      return { id, formData, oldCurrentStatus };
    },
    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast.success('Shipment updated successfully');

      // Send email notification if current_status changed
      if (result && result.formData.currentStatus && result.formData.currentStatus !== result.oldCurrentStatus && user) {
        const shipment = data?.find((s) => s.id === result.id);
        try {
          await supabase.functions.invoke('send-notification', {
            body: {
              user_id: user.id,
              shipment_id: result.id,
              old_status: result.oldCurrentStatus || 'N/A',
              new_status: result.formData.currentStatus,
              container_no: shipment?.containerNo || 'N/A',
              consignee: shipment?.consignee || 'N/A',
            },
          });
        } catch (e) {
          console.error('Notification failed:', e);
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update shipment');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('shipments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      setSelectedShipment(null);
      toast.success('Shipment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete shipment');
    },
  });

  const addShipment = useCallback(
    (data: ShipmentFormData) => createMutation.mutateAsync(data),
    [createMutation]
  );

  const updateShipment = useCallback(
    (id: string, formData: Partial<ShipmentFormData>) => {
      const existing = data?.find((s) => s.id === id);
      return updateMutation.mutateAsync({ id, data: formData, oldCurrentStatus: existing?.currentStatus });
    },
    [data, updateMutation]
  );

  const deleteShipment = useCallback(
    (id: string) => deleteMutation.mutateAsync(id),
    [deleteMutation]
  );

  const toggleStatus = useCallback(
    (id: string) => {
      const shipment = data?.find((s: Shipment) => s.id === id);
      if (shipment) {
        const newStatus = shipment.status === 'PENDING' ? 'DONE' : 'PENDING';
        updateMutation.mutate({ id, data: { status: newStatus } });
      }
    },
    [data, updateMutation]
  );

  return {
    shipments: data || [],
    loading: isLoading,
    error: error?.message || null,
    selectedShipment,
    setSelectedShipment,
    addShipment,
    updateShipment,
    deleteShipment,
    toggleStatus,
    refetch,
  };
};
