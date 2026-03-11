import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const MILESTONE_TYPES = [
  { key: 'booking_confirmed', label: 'Booking Confirmed', order: 1 },
  { key: 'cargo_picked_up', label: 'Cargo Picked Up', order: 2 },
  { key: 'export_customs_cleared', label: 'Export Customs Cleared', order: 3 },
  { key: 'departed', label: 'Departed', order: 4 },
  { key: 'arrived', label: 'Arrived', order: 5 },
  { key: 'import_customs_cleared', label: 'Import Customs Cleared', order: 6 },
  { key: 'delivered', label: 'Delivered', order: 7 },
] as const;

export type MilestoneType = (typeof MILESTONE_TYPES)[number]['key'];
export type MilestoneStatus = 'pending' | 'completed' | 'delayed';

export interface Milestone {
  id: string;
  shipmentId: string;
  milestoneType: MilestoneType;
  status: MilestoneStatus;
  milestoneDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const mapRowToMilestone = (row: any): Milestone => ({
  id: row.id,
  shipmentId: row.shipment_id,
  milestoneType: row.milestone_type,
  status: row.status,
  milestoneDate: row.milestone_date,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const useMilestones = (shipmentId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['milestones', shipmentId],
    queryFn: async () => {
      if (!shipmentId) return [];
      const { data, error } = await supabase
        .from('shipment_milestones')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []).map(mapRowToMilestone);
    },
    enabled: !!shipmentId && !!user,
  });

  // Merge milestones with the predefined list so all 7 always show
  const milestones = MILESTONE_TYPES.map((mt) => {
    const existing = data?.find((m) => m.milestoneType === mt.key);
    return existing || {
      id: '',
      shipmentId: shipmentId || '',
      milestoneType: mt.key as MilestoneType,
      status: 'pending' as MilestoneStatus,
      milestoneDate: null,
      notes: null,
      createdAt: '',
      updatedAt: '',
    };
  });

  const upsertMutation = useMutation({
    mutationFn: async (milestone: {
      milestoneType: string;
      status: MilestoneStatus;
      milestoneDate?: string | null;
      notes?: string | null;
    }) => {
      if (!shipmentId || !user) throw new Error('Missing context');

      // Check if milestone already exists
      const existing = data?.find((m) => m.milestoneType === milestone.milestoneType);

      if (existing) {
        const { error } = await supabase
          .from('shipment_milestones')
          .update({
            status: milestone.status,
            milestone_date: milestone.milestoneDate || null,
            notes: milestone.notes || null,
          })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('shipment_milestones')
          .insert({
            shipment_id: shipmentId,
            user_id: user.id,
            milestone_type: milestone.milestoneType,
            status: milestone.status,
            milestone_date: milestone.milestoneDate || null,
            notes: milestone.notes || null,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', shipmentId] });
      toast.success('Milestone updated');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update milestone');
    },
  });

  const updateMilestone = useCallback(
    (milestoneType: string, status: MilestoneStatus, milestoneDate?: string | null, notes?: string | null) => {
      upsertMutation.mutate({ milestoneType, status, milestoneDate, notes });
    },
    [upsertMutation]
  );

  return {
    milestones,
    loading: isLoading,
    updateMilestone,
  };
};
