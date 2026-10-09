export const today = () => new Date().toISOString().split('T')[0];

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().split('T')[0];
};

export const formatProblem = (p, tags = [], platforms = []) => ({
  id: p.id,
  _id: p.id,
  userId: p.user_id,
  name: p.name,
  diff: p.diff,
  status: p.status,
  collId: p.coll_id || '',
  starred: Boolean(p.starred),
  notes: p.notes || '',
  code: p.code || '',
  language: p.language || 'cpp',
  date: p.date,
  interval: p.interval ?? 1,
  nextRev: p.next_rev || null,
  revCount: p.rev_count ?? 0,
  noRep: Boolean(p.no_rep),
  lastReviewed: p.last_reviewed || null,
  solvedDate: p.solved_date || null,
  masteredDate: p.mastered_date || null,
  isDeleted: Boolean(p.is_deleted),
  delDate: p.del_date || null,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
  tags: tags || [],
  platforms: platforms || [],
});

export const fetchHydratedProblems = async (db, userId, isDeleted = 0) => {
  const sortCol = isDeleted === 1 ? 'del_date' : 'created_at';
  const problemsQuery = await db.prepare(
    `SELECT * FROM problems WHERE user_id = ? AND is_deleted = ? ORDER BY ${sortCol} DESC`
  ).bind(userId, isDeleted).all();

  const problems = problemsQuery.results || [];
  if (problems.length === 0) return [];

  // Fetch all associated tags
  const tagsQuery = await db.prepare(
    `SELECT pt.problem_id, pt.tag 
     FROM problem_tags pt 
     JOIN problems p ON pt.problem_id = p.id 
     WHERE p.user_id = ? AND p.is_deleted = ?`
  ).bind(userId, isDeleted).all();

  // Fetch all associated platforms
  const platformsQuery = await db.prepare(
    `SELECT pp.problem_id, pp.platform, pp.url 
     FROM problem_platforms pp 
     JOIN problems p ON pp.problem_id = p.id 
     WHERE p.user_id = ? AND p.is_deleted = ?`
  ).bind(userId, isDeleted).all();

  const tagMap = new Map();
  for (const row of (tagsQuery.results || [])) {
    if (!tagMap.has(row.problem_id)) tagMap.set(row.problem_id, []);
    tagMap.get(row.problem_id).push(row.tag);
  }

  const platformMap = new Map();
  for (const row of (platformsQuery.results || [])) {
    if (!platformMap.has(row.problem_id)) platformMap.set(row.problem_id, []);
    platformMap.get(row.problem_id).push({
      platform: row.platform,
      url: row.url,
    });
  }

  return problems.map((p) =>
    formatProblem(p, tagMap.get(p.id) || [], platformMap.get(p.id) || [])
  );
};

export const fetchSingleHydratedProblem = async (db, problemId, userId) => {
  const p = await db.prepare(
    `SELECT * FROM problems WHERE id = ? AND user_id = ?`
  ).bind(problemId, userId).first();

  if (!p) return null;

  const tagsQuery = await db.prepare(
    `SELECT tag FROM problem_tags WHERE problem_id = ?`
  ).bind(problemId).all();

  const platformsQuery = await db.prepare(
    `SELECT platform, url FROM problem_platforms WHERE problem_id = ?`
  ).bind(problemId).all();

  const tags = (tagsQuery.results || []).map((r) => r.tag);
  const platforms = (platformsQuery.results || []).map((r) => ({
    platform: r.platform,
    url: r.url,
  }));

  return formatProblem(p, tags, platforms);
};

export const fetchUserActivityMap = async (db, userId) => {
  const activityQuery = await db.prepare(
    `SELECT date, count FROM user_activity WHERE user_id = ?`
  ).bind(userId).all();

  const activityMap = {};
  for (const row of (activityQuery.results || [])) {
    activityMap[row.date] = row.count;
  }
  return activityMap;
};
