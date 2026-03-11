-- Add is_airway column to shipments table
ALTER TABLE public.shipments 
ADD COLUMN is_airway boolean DEFAULT false;