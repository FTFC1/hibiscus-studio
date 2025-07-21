-- Drop existing table if it exists to start fresh
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table for authentication
CREATE TABLE public.users (
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

-- Create policies for users table
CREATE POLICY "Allow all operations for now" ON public.users
  FOR ALL USING (true);

-- Simple hash function that matches our JavaScript implementation
CREATE OR REPLACE FUNCTION simple_hash(input_text TEXT) 
RETURNS TEXT AS $$
DECLARE
  salt TEXT := 'mikano-motors-salt-2024';
  combined TEXT := input_text || salt;
  hash_val BIGINT := 0;
  char_code INT;
  i INT;
  result TEXT;
BEGIN
  -- Simple hash algorithm that matches JavaScript
  FOR i IN 1..length(combined) LOOP
    char_code := ascii(substr(combined, i, 1));
    hash_val := ((hash_val << 5) - hash_val) + char_code;
    -- Keep as 32-bit signed integer
    hash_val := (hash_val % 2147483648);
  END LOOP;
  
  -- Convert to base36 string (matching JavaScript)
  result := '';
  hash_val := abs(hash_val);
  
  WHILE hash_val > 0 LOOP
    result := chr(48 + (hash_val % 36)) || result;
    IF (hash_val % 36) > 9 THEN
      result := chr(87 + (hash_val % 36)) || result;
    END IF;
    hash_val := hash_val / 36;
  END LOOP;
  
  IF result = '' THEN
    result := '0';
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert users with known password hashes
-- Password: mikano2024! -> Hash will be calculated
INSERT INTO public.users (email, password_hash, full_name, role, active) VALUES
  ('nicholasfcoker@googlemail.com', simple_hash('mikano2024!'), 'Nicholas Coker', 'admin', true),
  ('mikanomotors23@gmail.com', simple_hash('motors2024!'), 'Mikano Motors Admin', 'admin', true)
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

-- Test the hash function
SELECT 
  email, 
  password_hash,
  simple_hash('mikano2024!') as test_hash_1,
  simple_hash('motors2024!') as test_hash_2
FROM public.users;
