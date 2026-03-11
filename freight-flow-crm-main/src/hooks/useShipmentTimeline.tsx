import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TimelineEvent {
  id: string;
  shipmentId: string;
  eventType: string;
  description: string;
  oldStatus: string | null;
  newStatus: string | null;
  createdAt: string;
}

const mapRow = (row: any): TimelineEvent => ({
  id: row.id,
  shipmentId: row.shipment_id,
  eventType: row.event_type,
  description: row.description,
  oldStatus: row.old_status,
  newStatus: row.new_status,
  createdAt: row.created_at,
});

export const useShipmentTimeline = (shipmentId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['timeline', shipmentId],
    queryFn: async () => {
      if (!shipmentId) return [];
      const { data, error } = await supabase
        .from('shipment_timeline')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
    enabled: !!shipmentId && !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (eventData: {
      eventType: string;
      description: string;
      oldStatus?: string;
      newStatus?: string;
    }) => {
      if (!shipmentId || !user) throw new Error('Missing context');
      const { error } = await supabase.from('shipment_timeline').insert({
        shipment_id: shipmentId,
        user_id: user.id,
        event_type: eventData.eventType,
        description: eventData.description,
        old_status: eventData.oldStatus || null,
        new_status: eventData.newStatus || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline', shipmentId] });
    },
  });

  const addTimelineEvent = useCallback(
    (eventType: string, description: string, oldStatus?: string, newStatus?: string) => {
      addMutation.mutate({ eventType, description, oldStatus, newStatus });
    },
    [addMutation]
  );

  return {
    events: data || [],
    loading: isLoading,
    addTimelineEvent,
    refetch,
  };
};
