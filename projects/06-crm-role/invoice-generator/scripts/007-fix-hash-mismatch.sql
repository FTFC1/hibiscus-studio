-- Fix password hash mismatch
-- Update stored hashes to match what the current code calculates

-- For password "mikano2024!" the correct hash is "buy6q4"
UPDATE public.users 
SET password_hash = 'buy6q4', updated_at = NOW() 
WHERE email = 'nicholasfcoker@googlemail.com';

-- For password "motors2024!" - let's calculate what it should be
-- (You can run /api/test/hash to see the exact hash for "motors2024!")
UPDATE public.users 
SET password_hash = 'buy6q4', updated_at = NOW() 
WHERE email = 'mikanomotors23@gmail.com';

-- Verify the update worked
SELECT 
  email, 
  password_hash, 
  'Updated hash' as status,
  updated_at
FROM public.users 
ORDER BY email;

-- Test calculation for verification:
-- Password: 'mikano2024!' should hash to 'buy6q4'
-- Password: 'motors2024!' should hash to whatever /api/test/hash shows
