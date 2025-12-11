-- Update role enum to include super_admin
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('patient', 'healthcare_provider', 'super_admin'));

-- Insert super admin user
-- PIN: 123456 (hashed with bcrypt, cost factor 10)
INSERT INTO users (email, pin_hash, role)
VALUES (
  'admin@sugari.org',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'super_admin'
)
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin',
    pin_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
