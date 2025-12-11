-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='role') THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'patient' 
    CHECK (role IN ('patient', 'healthcare_provider', 'super_admin'));
  END IF;
END $$;

-- Drop the duplicate foreign key constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name='fk_user' AND table_name='glucose_readings') THEN
    ALTER TABLE glucose_readings DROP CONSTRAINT fk_user;
  END IF;
END $$;

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
