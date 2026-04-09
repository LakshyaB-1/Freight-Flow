-- Create user_roles table for role management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own role
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Only admins can update roles (for now, service role bypasses this)
CREATE POLICY "Only service role can update roles" ON public.user_roles
  FOR UPDATE USING (auth.role() = 'service_role');

-- Policy: Only service role can insert roles
CREATE POLICY "Only service role can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Grant access to authenticated users
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
