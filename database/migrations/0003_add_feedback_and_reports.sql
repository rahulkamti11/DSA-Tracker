-- Migration 0003: Add feedback and bug_reports tables

-- 1. Feedback Table (Registered users only)
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

CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

-- 2. Bug Reports Table (Anyone can report, compulsory email)
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

CREATE INDEX IF NOT EXISTS idx_reports_created ON bug_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_email ON bug_reports(email);
