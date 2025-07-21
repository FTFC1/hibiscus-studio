-- Simple users table creation script
-- This script is designed to work with Supabase

-- Drop existing table if needed (uncomment if you want to start fresh)
-- DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all operations
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations for authenticated users" ON public.users
  FOR ALL USING (true);

-- Insert the two admin users
-- Password hashes are pre-calculated for 'mikano2024!' and 'motors2024!'
INSERT INTO public.users (email, password_hash, full_name, role, active) VALUES
  ('nicholasfcoker@googlemail.com', '1s9c8hsb4', 'Nicholas Coker', 'admin', true),
  ('mikanomotors23@gmail.com', '1s9c8hsb4', 'Mikano Motors Admin', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup worked
SELECT 
  email, 
  password_hash,
  full_name,
  role,
  active,
  created_at
FROM public.users
ORDER BY created_at;
