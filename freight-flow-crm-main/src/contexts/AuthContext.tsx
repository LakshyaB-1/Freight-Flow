import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, companyName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log Supabase initialization
    console.log('🔐 AuthProvider initializing...');
    console.log('Supabase client:', { 
      hasClient: !!supabase,
      authModule: !!supabase.auth 
    });

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Session check completed:', { hasSession: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('🔐 Error checking session:', err);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, companyName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      console.log('🔐 SignUp: Starting with email:', email);
      console.log('🔐 SignUp: Supabase ready?', !!supabase, 'Auth ready?', !!supabase.auth);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            company_name: companyName || null,
          }
        }
      });
      
      if (error) {
        console.error('🔐 SignUp API error:', {
          message: error.message,
          status: (error as any).status,
          code: (error as any).code
        });
      } else {
        console.log('🔐 SignUp: Success');
        sessionStorage.setItem('crm_just_signed_up', 'true');
      }
      return { error };
    } catch (err) {
      console.error('🔐 SignUp network error:', err);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      const errorMsg = err instanceof Error ? err.message : 'Network error: Failed to connect to Supabase. Check your internet and browser security settings.';
      return { error: new Error(errorMsg) as any };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 SignIn: Starting with email:', email);
      console.log('🔐 SignIn: Supabase ready?', !!supabase, 'Auth ready?', !!supabase.auth);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('🔐 SignIn API error:', {
          message: error.message,
          status: (error as any).status,
          code: (error as any).code
        });
      } else {
        console.log('🔐 SignIn: Success');
      }
      return { error };
    } catch (err) {
      console.error('🔐 SignIn network error:', err);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      const errorMsg = err instanceof Error ? err.message : 'Network error: Failed to connect to Supabase. Check your internet and browser security settings.';
      return { error: new Error(errorMsg) as any };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    try {
      console.log('🔐 ResetPassword: Starting with email:', email);
      console.log('🔐 ResetPassword: Supabase ready?', !!supabase, 'Auth ready?', !!supabase.auth);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        console.error('🔐 ResetPassword API error:', {
          message: error.message,
          status: (error as any).status,
          code: (error as any).code
        });
      } else {
        console.log('🔐 ResetPassword: Success');
      }
      return { error };
    } catch (err) {
      console.error('🔐 ResetPassword network error:', err);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      const errorMsg = err instanceof Error ? err.message : 'Network error: Failed to send reset email. Check your internet and browser security settings.';
      return { error: new Error(errorMsg) as any };
    }
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      updatePassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
