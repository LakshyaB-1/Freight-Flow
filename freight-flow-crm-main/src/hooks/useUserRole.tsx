import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'user';

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole('user');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          // Table might not exist yet, which is ok - default to 'user' role
          if (error.code === 'PGRST205' || error.message?.includes("Could not find the table")) {
            console.warn('user_roles table not found, using default user role');
            setRole('user');
          } else {
            console.error('Error fetching user role:', error);
            setRole('user');
          }
        } else if (data) {
          setRole(data.role as AppRole);
        } else {
          setRole('user');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchRole();
    }
  }, [user, authLoading]);

  return {
    role,
    isAdmin: role === 'admin',
    loading: authLoading || loading,
  };
};
