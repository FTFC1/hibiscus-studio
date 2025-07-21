-- Fix password hashes in the users table
-- This script updates the existing users with the correct password hashes

-- First, let's see what we currently have
SELECT email, password_hash, 'Current hash' as status FROM public.users;

-- Update with the correct password hashes
-- These are calculated using the exact same algorithm as the JavaScript code
UPDATE public.users 
SET password_hash = 'nnlu9g', updated_at = NOW() 
WHERE email = 'nicholasfcoker@googlemail.com';

UPDATE public.users 
SET password_hash = 'nnlu9g', updated_at = NOW() 
WHERE email = 'mikanomotors23@gmail.com';

-- Verify the update worked
SELECT 
  email, 
  password_hash, 
  'Updated hash' as status,
  updated_at
FROM public.users 
ORDER BY email;

-- Test the hash calculation (this should match 'nnlu9g')
-- Password: 'mikano2024!' + Salt: 'mikano-motors-salt-2024'
-- Combined: 'mikano2024!mikano-motors-salt-2024'
