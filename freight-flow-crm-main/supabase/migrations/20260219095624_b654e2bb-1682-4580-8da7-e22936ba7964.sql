-- Fix RLS policies on shipments: change from RESTRICTIVE to PERMISSIVE
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Admins can view all shipments" ON public.shipments;
DROP POLICY IF EXISTS "Users can create their own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Users can update their own shipments" ON public.shipments;
DROP POLICY IF EXISTS "Users can delete their own shipments" ON public.shipments;

-- Recreate as PERMISSIVE (default)
CREATE POLICY "Users can view their own shipments"
ON public.shipments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all shipments"
ON public.shipments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own shipments"
ON public.shipments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipments"
ON public.shipments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shipments"
ON public.shipments FOR DELETE
USING (auth.uid() = user_id);

-- Fix same issue on all other tables
-- customers
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON public.customers;
DROP POLICY IF EXISTS "Users can create their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;

CREATE POLICY "Users can view their own customers" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all customers" ON public.customers FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own customers" ON public.customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own customers" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own customers" ON public.customers FOR DELETE USING (auth.uid() = user_id);

-- shipment_milestones
DROP POLICY IF EXISTS "Users can view their own milestones" ON public.shipment_milestones;
DROP POLICY IF EXISTS "Users can create milestones" ON public.shipment_milestones;
DROP POLICY IF EXISTS "Users can update their own milestones" ON public.shipment_milestones;
DROP POLICY IF EXISTS "Users can delete their own milestones" ON public.shipment_milestones;

CREATE POLICY "Users can view their own milestones" ON public.shipment_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create milestones" ON public.shipment_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own milestones" ON public.shipment_milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own milestones" ON public.shipment_milestones FOR DELETE USING (auth.uid() = user_id);

-- shipment_documents
DROP POLICY IF EXISTS "Users can view their own documents" ON public.shipment_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.shipment_documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.shipment_documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.shipment_documents;

CREATE POLICY "Users can view their own documents" ON public.shipment_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all documents" ON public.shipment_documents FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own documents" ON public.shipment_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.shipment_documents FOR DELETE USING (auth.uid() = user_id);

-- shipment_timeline
DROP POLICY IF EXISTS "Users can view their own shipment timeline" ON public.shipment_timeline;
DROP POLICY IF EXISTS "Admins can view all timeline events" ON public.shipment_timeline;
DROP POLICY IF EXISTS "Users can insert their own timeline events" ON public.shipment_timeline;

CREATE POLICY "Users can view their own shipment timeline" ON public.shipment_timeline FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all timeline events" ON public.shipment_timeline FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own timeline events" ON public.shipment_timeline FOR INSERT WITH CHECK (auth.uid() = user_id);

-- tasks
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Admins can view all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;

CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all tasks" ON public.tasks FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- notification_preferences
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.notification_preferences;

CREATE POLICY "Users can view their own preferences" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);

-- user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));