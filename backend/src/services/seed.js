// Initialize default collection for a user
export const insertDefaultCollections = async (db, userId) => {
  // 'starred' is handled purely as a virtual collection in the frontend linked directly
  // to the problems.starred column. No redundant database rows needed.
};
