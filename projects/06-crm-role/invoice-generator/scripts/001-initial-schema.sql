-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (Supabase auth handles this, but we can extend it)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PFIs table
CREATE TABLE IF NOT EXISTS public.pfis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  valid_until DATE NOT NULL,
  invoice_type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_contact TEXT,
  sales_executive TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  line_items JSONB NOT NULL DEFAULT '[]',
  registration JSONB,
  insurance JSONB,
  service_oil_change JSONB,
  transport_cost DECIMAL,
  registration_cost DECIMAL,
  subtotal DECIMAL NOT NULL DEFAULT 0,
  vat DECIMAL NOT NULL DEFAULT 0,
  total DECIMAL NOT NULL DEFAULT 0,
  amount_in_words TEXT,
  bank TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  prepared_by TEXT DEFAULT 'Management',
  approved_by TEXT DEFAULT 'JOELLE HAYAK',
  payment_terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pfis ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for PFIs
CREATE POLICY "Users can view own PFIs" ON public.pfis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create PFIs" ON public.pfis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PFIs" ON public.pfis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PFIs" ON public.pfis
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert authorized users (replace with your actual authorized emails)
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'nicholasfcoker@googlemail.com', NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'mikanomotors23@gmail.com', NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
