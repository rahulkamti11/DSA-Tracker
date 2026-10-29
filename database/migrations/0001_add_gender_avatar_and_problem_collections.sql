-- ==============================================================================
-- Cloudflare D1 Migration: 0001_add_gender_avatar_and_problem_collections.sql
-- Description: Non-destructive migration adding gender & avatar to users table,
--              and creating the dedicated problem_collections junction table.
-- ==============================================================================

-- 1. Add gender & avatar columns to users table
ALTER TABLE users ADD COLUMN gender TEXT DEFAULT 'prefer_not_to_say';
ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT 'ninja';

-- Clean up avatars table if previously created
DROP TABLE IF EXISTS avatars;

-- 2. Create dedicated problem_collections junction table
CREATE TABLE IF NOT EXISTS problem_collections (
    problem_id TEXT NOT NULL,
    collection_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (problem_id, collection_id),
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optimization indexes for high-speed lookups
CREATE INDEX IF NOT EXISTS idx_problem_collections_collection ON problem_collections(collection_id);
CREATE INDEX IF NOT EXISTS idx_problem_collections_user ON problem_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_collections_problem ON problem_collections(problem_id);

-- 3. Migrate existing single coll_id from problems into problem_collections
INSERT OR IGNORE INTO problem_collections (problem_id, collection_id, user_id)
SELECT id, coll_id, user_id 
FROM problems 
WHERE coll_id IS NOT NULL AND coll_id != '';
