-- Create users table for authentication (final version)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (allow all for now)
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true);

-- Insert your user accounts with pre-calculated hashes
-- These hashes are calculated using the same algorithm as the JavaScript code
INSERT INTO public.users (email, password_hash, full_name, role, active) VALUES
  ('nicholasfcoker@googlemail.com', '1s9c8hsb4', 'Nicholas Coker', 'admin', true),
  ('mikanomotors23@gmail.com', '1s9c8hsb4', 'Mikano Motors Admin', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Verify the data was inserted
SELECT 
  email, 
  password_hash,
  full_name,
  role,
  active,
  created_at
FROM public.users
ORDER BY created_at;
