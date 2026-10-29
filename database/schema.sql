-- ==============================================================================
-- Cloudflare D1 (SQLite) Master Database Schema for DSA-Tracker
-- ==============================================================================
-- Execute this single file in the Cloudflare D1 Console to create all tables
-- and query optimization indexes in one click.
-- ==============================================================================

-- 1. Users Table (Includes authentication, unique username, email, gender, and avatar)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    gender TEXT DEFAULT 'prefer_not_to_say' CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say', '')),
    avatar TEXT DEFAULT 'ninja',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Daily Activity (Heatmap tracker)
CREATE TABLE IF NOT EXISTS user_activity (
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Collections Table (Starred, Blind75, NeetCode 150, Custom)
CREATE TABLE IF NOT EXISTS collections (
    id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    color TEXT DEFAULT 'blue',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Problems Table (Core SRS State Machine)
CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    diff TEXT NOT NULL DEFAULT 'Medium' CHECK (diff IN ('Easy', 'Medium', 'Hard')),
    status TEXT NOT NULL DEFAULT 'Solved' CHECK (status IN ('Solved', 'Attempted', 'Mastered')),
    coll_id TEXT DEFAULT '',
    starred INTEGER NOT NULL DEFAULT 0,
    notes TEXT DEFAULT '',
    code TEXT DEFAULT '',
    language TEXT DEFAULT 'cpp',
    date TEXT NOT NULL,
    interval INTEGER DEFAULT 1,
    next_rev TEXT,
    rev_count INTEGER DEFAULT 0,
    no_rep INTEGER DEFAULT 0,
    last_reviewed TEXT,
    solved_date TEXT,
    mastered_date TEXT,
    is_deleted INTEGER DEFAULT 0,
    del_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Dedicated Problem Collections Junction Table (Normalized Many-to-Many)
CREATE TABLE IF NOT EXISTS problem_collections (
    problem_id TEXT NOT NULL,
    collection_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (problem_id, collection_id),
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Problem Tags (Normalized Many-to-Many Tags)
CREATE TABLE IF NOT EXISTS problem_tags (
    problem_id TEXT NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY (problem_id, tag),
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- 7. Problem Platforms (LeetCode, Codeforces, HackerRank, GFG, NeetCode Links)
CREATE TABLE IF NOT EXISTS problem_platforms (
    problem_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    PRIMARY KEY (problem_id, platform),
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- 8. Problem Reviews (Review & Interval History Audit Log)
CREATE TABLE IF NOT EXISTS problem_reviews (
    id TEXT PRIMARY KEY,
    problem_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    review_date TEXT NOT NULL,
    interval INTEGER NOT NULL,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Feedback Table (Registered users with rate-limiting support)
CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Bug Reports Table (Anyone can report, compulsory email)
CREATE TABLE IF NOT EXISTS bug_reports (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    area TEXT NOT NULL,
    message TEXT NOT NULL,
    email TEXT NOT NULL,
    device_info TEXT,
    ip_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==============================================================================
-- Query Optimization Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_problems_user_active ON problems(user_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_problems_next_rev ON problems(user_id, next_rev);
CREATE INDEX IF NOT EXISTS idx_problem_collections_collection ON problem_collections(collection_id);
CREATE INDEX IF NOT EXISTS idx_problem_collections_user ON problem_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_problem_collections_problem ON problem_collections(problem_id);
CREATE INDEX IF NOT EXISTS idx_problem_tags_tag ON problem_tags(tag);
CREATE INDEX IF NOT EXISTS idx_problem_platforms_problem ON problem_platforms(problem_id);
CREATE INDEX IF NOT EXISTS idx_reviews_problem ON problem_reviews(problem_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_created ON bug_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_email ON bug_reports(email);
