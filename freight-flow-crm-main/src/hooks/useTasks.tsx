import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  dueDate: string | null;
  completedAt: string | null;
  shipmentId: string | null;
  customerId: string | null;
  createdAt: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  shipmentId?: string;
  customerId?: string;
}

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: loading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority || 'medium',
        status: t.status || 'pending',
        dueDate: t.due_date,
        completedAt: t.completed_at,
        shipmentId: t.shipment_id,
        customerId: t.customer_id,
        createdAt: t.created_at,
      }));
    },
    enabled: !!user,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const addTask = useMutation({
    mutationFn: async (data: TaskFormData) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('tasks').insert({
        user_id: user.id,
        title: data.title,
        description: data.description || null,
        priority: data.priority || 'medium',
        status: data.status || 'pending',
        due_date: data.dueDate || null,
        shipment_id: data.shipmentId || null,
        customer_id: data.customerId || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TaskFormData> }) => {
      const updateObj: any = {};
      if (data.title !== undefined) updateObj.title = data.title;
      if (data.description !== undefined) updateObj.description = data.description;
      if (data.priority !== undefined) updateObj.priority = data.priority;
      if (data.status !== undefined) {
        updateObj.status = data.status;
        if (data.status === 'completed') updateObj.completed_at = new Date().toISOString();
        else updateObj.completed_at = null;
      }
      if (data.dueDate !== undefined) updateObj.due_date = data.dueDate;
      const { error } = await supabase.from('tasks').update(updateObj).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: (e: any) => toast.error(e.message),
  });

  return {
    tasks,
    loading,
    addTask: addTask.mutateAsync,
    updateTask: (id: string, data: Partial<TaskFormData>) => updateTask.mutateAsync({ id, data }),
    deleteTask: deleteTask.mutateAsync,
  };
};
