-- Create shipments table
CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  bl_date DATE,
  consignee TEXT NOT NULL,
  shipper TEXT NOT NULL,
  commodity TEXT NOT NULL,
  container_no TEXT,
  container_size TEXT CHECK (container_size IN ('20''', '40''')),
  shipping_line TEXT,
  type TEXT CHECK (type IN ('FCL', 'LCL')),
  forwarder TEXT,
  cha TEXT,
  no_of_packets INTEGER,
  weight DECIMAL(10,2),
  cbm DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
  be_no TEXT,
  be_date DATE,
  current_status TEXT,
  iec_no TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own shipments" 
ON public.shipments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shipments" 
ON public.shipments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipments" 
ON public.shipments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shipments" 
ON public.shipments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();