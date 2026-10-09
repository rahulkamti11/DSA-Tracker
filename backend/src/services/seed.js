import { today, addDays } from '../utils/db.js';
import { hashPassword } from '../utils/crypto.js';

export const getSeedProblems = (userId) => [
  {
    userId,
    name: 'Number of Islands',
    diff: 'Medium',
    status: 'Solved',
    tags: ['Graphs', 'BFS', 'DFS'],
    collId: 'top150',
    starred: true,
    notes: '## Approach\nUse DFS or BFS to traverse the grid. Mark visited land cells to avoid double counting.\n\n**Time:** O(M*N) | **Space:** O(M*N)',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/' },
      { platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1' }
    ],
    date: addDays(today(), -1),
    interval: 3,
    nextRev: addDays(today(), 2),
    revCount: 1,
  },
  {
    userId,
    name: 'Coin Change',
    diff: 'Medium',
    status: 'Solved',
    tags: ['Dynamic Programming'],
    collId: 'blind75',
    starred: true,
    notes: '## Approach\nBottom-up DP. Array of size `amount + 1` initialized to `amount + 1`.\n\n**Time:** O(S*n) | **Space:** O(S)',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change/' }
    ],
    date: addDays(today(), -2),
    interval: 3,
    nextRev: addDays(today(), 1),
    revCount: 2,
  },
  {
    userId,
    name: 'Merge K Sorted Lists',
    diff: 'Hard',
    status: 'Solved',
    tags: ['Heap', 'Linked List'],
    collId: 'top150',
    starred: false,
    notes: '## Approach\nUse a min-heap to keep track of the smallest node among the k linked lists. Extract min and add the next node from that list to the heap.\n\n**Time:** O(N log k) | **Space:** O(k)',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' }
    ],
    date: addDays(today(), -3),
    interval: 5,
    nextRev: addDays(today(), 2),
    revCount: 1,
  },
  {
    userId,
    name: 'Two Sum',
    diff: 'Easy',
    status: 'Solved',
    tags: ['Array', 'Hash Table'],
    collId: 'blind75',
    starred: true,
    notes: '## Approach\nUse a hash map to store the difference between the target and the current element as you iterate.\n\n**Time:** O(n) | **Space:** O(n)',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/' }
    ],
    date: addDays(today(), -5),
    interval: 14,
    nextRev: addDays(today(), 9),
    revCount: 4,
  },
  {
    userId,
    name: 'LRU Cache',
    diff: 'Medium',
    status: 'Attempted',
    tags: ['Design', 'Linked List', 'Hash Table'],
    collId: '',
    starred: false,
    notes: '',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache/' },
      { platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/lru-cache/1' }
    ],
    date: today(),
    interval: 1,
    nextRev: addDays(today(), 1),
    revCount: 0,
  },
  {
    userId,
    name: 'Valid Parentheses',
    diff: 'Easy',
    status: 'Solved',
    tags: ['String', 'Stack'],
    collId: 'blind75',
    starred: false,
    notes: '',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-parentheses/' }
    ],
    date: addDays(today(), -10),
    interval: 30,
    nextRev: addDays(today(), 20),
    revCount: 5,
  },
  {
    userId,
    name: 'Median of Two Sorted Arrays',
    diff: 'Hard',
    status: 'Attempted',
    tags: ['Array', 'Binary Search'],
    collId: 'top150',
    starred: true,
    notes: '',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' }
    ],
    date: addDays(today(), -15),
    interval: 1,
    nextRev: today(),
    revCount: 1,
  },
  {
    userId,
    name: 'Longest Palindromic Substring',
    diff: 'Medium',
    status: 'Solved',
    tags: ['String', 'Dynamic Programming'],
    collId: '',
    starred: false,
    notes: '',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-palindromic-substring/' }
    ],
    date: addDays(today(), -20),
    interval: 14,
    nextRev: addDays(today(), -1),
    revCount: 3,
  },
  {
    userId,
    name: 'Climbing Stairs',
    diff: 'Easy',
    status: 'Solved',
    tags: ['Math', 'Dynamic Programming'],
    collId: 'blind75',
    starred: false,
    notes: '',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/' }
    ],
    date: addDays(today(), -4),
    interval: 7,
    nextRev: addDays(today(), 3),
    revCount: 1,
  },
  {
    userId,
    name: 'Search in Rotated Sorted Array',
    diff: 'Medium',
    status: 'Solved',
    tags: ['Array', 'Binary Search'],
    collId: 'blind75',
    starred: false,
    notes: '',
    platforms: [
      { platform: 'LeetCode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' }
    ],
    date: addDays(today(), -2),
    interval: 3,
    nextRev: addDays(today(), 1),
    revCount: 2,
  }
];

export const insertSeedProblemsAndCollections = async (db, userId) => {
  const statements = [];

  // 1. Collections
  const defaultColls = [
    { id: 'starred', name: 'Starred', description: 'Favorited problems' },
    { id: 'blind75', name: 'Blind 75', description: 'Curated 75 essential LeetCode questions' },
    { id: 'top150', name: 'Top Interview 150', description: 'Must-do interview prep questions' },
  ];

  for (const c of defaultColls) {
    statements.push(
      db.prepare(
        `INSERT OR IGNORE INTO collections (id, user_id, name, description, color) VALUES (?, ?, ?, ?, 'blue')`
      ).bind(c.id, userId, c.name, c.description)
    );
  }

  // 2. Problems, Tags, Platforms
  const seedProbs = getSeedProblems(userId);
  for (const p of seedProbs) {
    const probId = crypto.randomUUID();
    statements.push(
      db.prepare(
        `INSERT INTO problems (
          id, user_id, name, diff, status, coll_id, starred, notes, code, language,
          date, interval, next_rev, rev_count, no_rep, is_deleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', 'cpp', ?, ?, ?, ?, 0, 0)`
      ).bind(
        probId,
        userId,
        p.name,
        p.diff,
        p.status,
        p.collId,
        p.starred ? 1 : 0,
        p.notes,
        p.date,
        p.interval,
        p.nextRev,
        p.revCount
      )
    );

    for (const tag of p.tags) {
      statements.push(
        db.prepare(
          `INSERT INTO problem_tags (problem_id, tag) VALUES (?, ?)`
        ).bind(probId, tag)
      );
    }

    for (const pl of p.platforms) {
      statements.push(
        db.prepare(
          `INSERT INTO problem_platforms (id, problem_id, platform, url) VALUES (?, ?, ?, ?)`
        ).bind(crypto.randomUUID(), probId, pl.platform, pl.url)
      );
    }
  }

  await db.batch(statements);
};

export const ensureGuestSeeded = async (db) => {
  const existingGuest = await db.prepare(
    `SELECT * FROM users WHERE username = 'guest'`
  ).first();

  if (existingGuest) return existingGuest;

  const guestId = crypto.randomUUID();
  const hashedPassword = await hashPassword('guest');

  // Insert guest user
  await db.prepare(
    `INSERT INTO users (id, username, password, name) VALUES (?, 'guest', ?, 'Guest')`
  ).bind(guestId, hashedPassword).run();

  // Insert seed activity heatmap
  const initialActivity = {
    [today()]: 2,
    [addDays(today(), -1)]: 1,
    [addDays(today(), -2)]: 3,
    [addDays(today(), -4)]: 1,
    [addDays(today(), -5)]: 4,
    [addDays(today(), -7)]: 2,
    [addDays(today(), -10)]: 1,
    [addDays(today(), -15)]: 5,
    [addDays(today(), -20)]: 2,
    [addDays(today(), -25)]: 3,
  };

  const activityStatements = Object.entries(initialActivity).map(([d, cnt]) =>
    db.prepare(
      `INSERT INTO user_activity (user_id, date, count) VALUES (?, ?, ?)`
    ).bind(guestId, d, cnt)
  );

  await db.batch(activityStatements);

  // Seed default collections & problems
  await insertSeedProblemsAndCollections(db, guestId);

  return {
    id: guestId,
    username: 'guest',
    name: 'Guest',
  };
};

export const resetGuestProfile = async (db, guestId) => {
  const statements = [
    db.prepare(`DELETE FROM problems WHERE user_id = ?`).bind(guestId),
    db.prepare(`DELETE FROM collections WHERE user_id = ?`).bind(guestId),
    db.prepare(`DELETE FROM user_activity WHERE user_id = ?`).bind(guestId),
  ];
  await db.batch(statements);

  // Re-seed default collections & problems
  await insertSeedProblemsAndCollections(db, guestId);
};
