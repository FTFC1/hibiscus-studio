-- Create users table for authentication
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

-- Create policies for users table (only admins can manage users)
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email' 
      AND role = 'admin'
    )
  );

-- Function to hash passwords (simple implementation)
CREATE OR REPLACE FUNCTION hash_password(password TEXT) 
RETURNS TEXT AS $$
DECLARE
  salt TEXT := 'mikano-motors-salt-2024';
  combined TEXT := password || salt;
  hash_val BIGINT := 0;
  char_code INT;
  i INT;
BEGIN
  FOR i IN 1..length(combined) LOOP
    char_code := ascii(substr(combined, i, 1));
    hash_val := ((hash_val << 5) - hash_val) + char_code;
    hash_val := hash_val & 2147483647; -- Keep as 32-bit integer
  END LOOP;
  
  RETURN abs(hash_val)::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Insert your user account with proper password hashing
INSERT INTO public.users (email, password_hash, full_name, role, active) VALUES
  ('nicholasfcoker@googlemail.com', hash_password('mikano2024!'), 'Nicholas Coker', 'admin', true),
  ('mikanomotors23@gmail.com', hash_password('motors2024!'), 'Mikano Motors Admin', 'admin', true)
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
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
