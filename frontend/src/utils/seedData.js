// Default collections provided for new users
export const getInitialSeedCollections = () => [
  { id: 'starred', name: 'Starred', description: 'Priority & starred problems', color: 'blue' },
];

// Clean initial state: 0 dummy problems
export const getInitialSeedProblems = () => [];

// Clean initial activity heatmap
export const getInitialSeedActivity = () => ({});
