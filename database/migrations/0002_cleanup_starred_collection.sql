-- ==============================================================================
-- Migration: 0002_cleanup_starred_collection.sql
-- Description: Clean up redundant 'starred' collection rows from database
-- 'starred' is now handled virtually on the frontend directly via problems.starred
-- ==============================================================================

-- 1. Remove junction table entries pointing to 'starred'
DELETE FROM problem_collections WHERE collection_id = 'starred';

-- 2. Reset problems' legacy coll_id if it was set to 'starred'
UPDATE problems SET coll_id = '' WHERE coll_id = 'starred';

-- 3. Remove 'starred' rows from collections table
DELETE FROM collections WHERE id = 'starred';
