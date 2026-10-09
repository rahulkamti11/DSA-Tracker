export const getPlatformInfo = (name) => {
  const map = {
    LeetCode: { short: 'LC', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    GFG: { short: 'GFG', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    Codeforces: { short: 'CF', dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
    HackerRank: { short: 'HR', dot: 'bg-green-600', text: 'text-green-600 dark:text-green-400' },
    CodeChef: { short: 'CC', dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
    InterviewBit: { short: 'IB', dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
    Other: { short: 'OT', dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400' },
  };

  return map[name] || { short: name.substring(0, 2).toUpperCase(), dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400' };
};

export const getRealUrl = (problemName, platformName, currentUrl) => {
  if (currentUrl && currentUrl !== '#' && currentUrl.trim() !== '') return currentUrl;

  const seedUrls = {
    'Number of Islands': {
      LeetCode: 'https://leetcode.com/problems/number-of-islands/',
      GFG: 'https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1',
    },
    'Coin Change': {
      LeetCode: 'https://leetcode.com/problems/coin-change/',
    },
    'Merge K Sorted Lists': {
      LeetCode: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    },
    'Two Sum': {
      LeetCode: 'https://leetcode.com/problems/two-sum/',
    },
    'LRU Cache': {
      LeetCode: 'https://leetcode.com/problems/lru-cache/',
      GFG: 'https://www.geeksforgeeks.org/problems/lru-cache/1',
    },
    'Valid Parentheses': {
      LeetCode: 'https://leetcode.com/problems/valid-parentheses/',
    },
    'Median of Two Sorted Arrays': {
      LeetCode: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    },
    'Longest Palindromic Substring': {
      LeetCode: 'https://leetcode.com/problems/longest-palindromic-substring/',
    },
    'Climbing Stairs': {
      LeetCode: 'https://leetcode.com/problems/climbing-stairs/',
    },
    'Search in Rotated Sorted Array': {
      LeetCode: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    },
  };

  if (seedUrls[problemName] && seedUrls[problemName][platformName]) {
    return seedUrls[problemName][platformName];
  }

  const slug = problemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (platformName === 'LeetCode') {
    return `https://leetcode.com/problems/${slug}/`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(`${problemName} ${platformName}`)}`;
};
