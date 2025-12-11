-- Add first_name and last_name columns to users table
ALTER TABLE users
ADD COLUMN first_name VARCHAR(100),
ADD COLUMN last_name VARCHAR(100);

-- Update existing users to have default names (optional)
UPDATE users
SET first_name = 'User',
    last_name = split_part(email, '@', 1)
WHERE first_name IS NULL;
