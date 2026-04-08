import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Shipment, ShipmentFormData } from '@/types/shipment';
import { toast } from 'sonner';

const BULK_BATCH_SIZE = 200; // Supabase recommends ≤500 rows per insert

// Map DB row (snake_case) to frontend Shipment (camelCase)
const mapRowToShipment = (row: any): Shipment => ({
  id: row.id,
  date: row.date,
  blDate: row.bl_date,
  consignee: row.consignee,
  shipper: row.shipper,
  commodity: row.commodity,
  containerNo: row.container_no,
 containerSize: row.container_size ? row.container_size.replace("'", '') : null,
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
  if (data.containerSize !== undefined) row.container_size = data.containerSize ? `${data.containerSize}'` : null;
  if (data.shippingLine !== undefined) row.shipping_line = data.shippingLine || null;
  if (data.type !== undefined) row.type = data.type || null;
  if (data.forwarder !== undefined) row.forwarder = data.forwarder || null;
  if (data.cha !== undefined) row.cha = data.cha || null;
  if (data.noOfPackets !== undefined) row.no_of_packets = data.noOfPackets;
  if (data.weight !== undefined) row.weight = data.weight;
  if (data.cbm !== undefined) row.cbm = data.cbm;
  if (data.status !== undefined) row.status = data.status?.toLowerCase();
  else row.status = 'pending';
  if (data.beNo !== undefined) row.be_no = data.beNo || null;
  if (data.beDate !== undefined) row.be_date = data.beDate || null;
  if (data.currentStatus !== undefined) row.current_status = data.currentStatus || null;
  if (data.iecNo !== undefined) row.iec_no = data.iecNo || null;
  if (data.isAirway !== undefined) row.is_airway = data.isAirway;
  return row;
};

const getAuthenticatedUserId = async () => {
  const [sessionResult, userResult] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ]);

  console.log('Supabase auth session result:', sessionResult);
  console.log('Supabase auth user result:', userResult);

  const sessionError = sessionResult.error;
  if (sessionError) {
    console.error('Supabase session lookup failed:', sessionError);
    throw sessionError;
  }

  const authUserId = sessionResult.data.session?.user?.id;
  const accessToken = sessionResult.data.session?.access_token;
  const refreshToken = sessionResult.data.session?.refresh_token;

  if (!authUserId) {
    throw new Error('Authentication session is missing. Please sign in again.');
  }

  if (accessToken) {
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken ?? undefined,
    });
    if (setSessionError) {
      console.error('Supabase auth.setSession failed:', setSessionError);
      throw setSessionError;
    }
  }

  return authUserId;
};

const SHIPMENTS_TABLE = 'shipments';

export const useShipments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(SHIPMENTS_TABLE)
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
      const authUserId = await getAuthenticatedUserId();
      const row = mapFormToRow(formData, authUserId);
      const { error } = await supabase.from(SHIPMENTS_TABLE).insert(row);
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
      const { error } = await supabase.from(SHIPMENTS_TABLE).update(row).eq('id', id);
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
      const { error } = await supabase.from(SHIPMENTS_TABLE).delete().eq('id', id);
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

  // Bulk insert for Excel import — batched with progress callback
  const bulkAddShipments = useCallback(
    async (
      shipments: ShipmentFormData[],
      onProgress?: (done: number, total: number) => void,
    ) => {
      const authUserId = await getAuthenticatedUserId();

      const rows = shipments.map((s) => {
        const row = mapFormToRow(s, authUserId);
        if (!row.user_id) {
          throw new Error('Missing user_id for shipment import. Please sign in again.');
        }
        return row;
      });

      console.log('Bulk import auth info', {
        authUserId,
        currentContextUserId: user?.id,
        firstRowUserId: rows[0]?.user_id,
        rowCount: rows.length,
      });

      const batchInsertOptions = { returning: 'minimal' as const };


      const total = rows.length;
      let inserted = 0;
      const errors: { batch: number; row?: number; message: string }[] = [];

      for (let i = 0; i < total; i += BULK_BATCH_SIZE) {
        const batch = rows.slice(i, i + BULK_BATCH_SIZE);
        const batchNumber = Math.floor(i / BULK_BATCH_SIZE) + 1;
        const { error } = await supabase.from(SHIPMENTS_TABLE).insert(batch, batchInsertOptions);

        if (error) {
          console.warn(`Batch ${batchNumber} failed, falling back to single-row inserts`, error);
          for (let rowIndex = 0; rowIndex < batch.length; rowIndex++) {
            const row = batch[rowIndex];
            const { error: rowError } = await supabase.from(SHIPMENTS_TABLE).insert([row], batchInsertOptions);
            if (rowError) {
              const message = rowError.message || 'Unknown row insert error';
              errors.push({
                batch: batchNumber,
                row: rowIndex + 1,
                message,
              });
              console.error(`Row ${rowIndex + 1} in batch ${batchNumber} failed:`, rowError);
            } else {
              inserted += 1;
            }
            onProgress?.(Math.min(i + rowIndex + 1, total), total);
          }
        } else {
          inserted += batch.length;
          onProgress?.(Math.min(i + batch.length, total), total);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['shipments'] });

      if (errors.length > 0 || inserted === 0) {
        const firstError = errors[0];
        const errorMessage = inserted === 0
          ? 'No shipments were imported. Please check your login session and try again.'
          : `${errors.length} row(s) failed to import. ${inserted}/${total} shipments imported. ${firstError.message}`;
        toast.error(errorMessage);
      } else {
        toast.success(`All ${inserted} shipments imported successfully`);
      }

      return { inserted, errors };
    },
    [queryClient],
  );
  // Bulk delete — single query with IN filter
  const bulkDeleteShipments = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;
      // Optimistic update: remove from cache immediately
      queryClient.setQueryData(['shipments'], (old: Shipment[] | undefined) =>
        old ? old.filter((s) => !ids.includes(s.id || '')) : [],
      );
      const { error } = await supabase.from(SHIPMENTS_TABLE).delete().in('id', ids);
      if (error) {
        toast.error('Failed to delete shipments: ' + error.message);
        queryClient.invalidateQueries({ queryKey: ['shipments'] }); // rollback
      } else {
        toast.success(`${ids.length} shipment(s) deleted`);
        queryClient.invalidateQueries({ queryKey: ['shipments'] });
      }
    },
    [queryClient],
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
    bulkAddShipments,
    bulkDeleteShipments,
    refetch,
  };
};
