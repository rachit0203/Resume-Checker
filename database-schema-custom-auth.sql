-- =====================================================
-- CUSTOM AUTHENTICATION DATABASE SCHEMA
-- Resume Checker Application
-- =====================================================

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create the resume_analyses table
CREATE TABLE IF NOT EXISTS resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  strengths TEXT[] NOT NULL DEFAULT '{}',
  missing_keywords TEXT[] NOT NULL DEFAULT '{}',
  improvement_suggestions TEXT[] NOT NULL DEFAULT '{}',
  optimized_bullets JSONB NOT NULL DEFAULT '[]',
  final_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_created_at ON resume_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_ats_score ON resume_analyses(ats_score);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on resume_analyses table
DROP TRIGGER IF EXISTS update_resume_analyses_updated_at ON resume_analyses;
CREATE TRIGGER update_resume_analyses_updated_at
BEFORE UPDATE ON resume_analyses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'resume_analyses');

-- Check indexes
SELECT tablename, indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('users', 'resume_analyses')
ORDER BY tablename, indexname;

-- =====================================================
-- HELPFUL QUERIES FOR DEBUGGING
-- =====================================================

-- Get all users (without password hashes)
/*
SELECT 
  id,
  email,
  created_at
FROM users
ORDER BY created_at DESC;
*/

-- Count analyses per user
/*
SELECT 
  u.email,
  COUNT(ra.id) as analysis_count,
  AVG(ra.ats_score) as avg_score
FROM users u
LEFT JOIN resume_analyses ra ON u.id = ra.user_id
GROUP BY u.email;
*/

-- Get recent analyses with user email
/*
SELECT 
  u.email,
  ra.ats_score,
  ra.created_at
FROM resume_analyses ra
JOIN users u ON ra.user_id = u.id
ORDER BY ra.created_at DESC
LIMIT 10;
*/
