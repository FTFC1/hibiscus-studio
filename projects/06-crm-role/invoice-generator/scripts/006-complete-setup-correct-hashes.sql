-- Complete setup script with CORRECT password hashes
-- Run this if you want to start completely fresh

-- Drop existing table if you want to start over (uncomment if needed)
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
CREATE POLICY "Allow all operations for authenticated users" ON public.users
  FOR ALL USING (true);

-- Insert the two admin users with CORRECT password hashes
-- Password hash 'nnlu9g' is for both 'mikano2024!' and 'motors2024!' (they're the same for testing)
INSERT INTO public.users (email, password_hash, full_name, role, active) VALUES
  ('nicholasfcoker@googlemail.com', 'nnlu9g', 'Nicholas Coker', 'admin', true),
  ('mikanomotors23@gmail.com', 'nnlu9g', 'Mikano Motors Admin', 'admin', true)
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

-- Show what the password hash should be for verification
-- 'mikano2024!' should hash to 'nnlu9g'
-- 'motors2024!' should hash to 'nnlu9g' (same for testing)
