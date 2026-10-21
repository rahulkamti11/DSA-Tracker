-- Migration 0002: Add email column to users table
ALTER TABLE users ADD COLUMN email TEXT;

-- Create unique index to prevent duplicate emails (allows NULLs for existing/guest users)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
