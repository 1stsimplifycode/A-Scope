
import { Problem, Difficulty, Phase, Role, User, UserEvent } from './types';

export const PHASES: Phase[] = [
  { week: 1, topic: 'Sequential Structures', description: 'Arrays, Strings, and Sliding Window optimizations.', isLocked: false },
  { week: 2, topic: 'Non-linear Nodes', description: 'Linked Lists and Pointer-based manipulations.', isLocked: false },
  { week: 3, topic: 'Linear Constraints', description: 'Stacks, Queues, and Monotonic variants.', isLocked: false },
  { week: 4, topic: 'Hierarchy & Paths', description: 'Trees, Graphs, and Topological Sorts.', isLocked: false },
  { week: 5, topic: 'State Optimization', description: 'Dynamic Programming and Bitmask techniques.', isLocked: true },
];

export const MOCK_PROBLEMS: Problem[] = [
  {
    id: 'p1',
    title: 'Two Sum',
    topic: 'Arrays',
    difficulty: Difficulty.EASY,
    week: 1,
    description: 'Find indices of two numbers adding up to a target.',
    constraints: ['2 <= nums.length <= 10^4'],
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }],
    visualizationType: 'array'
  },
  {
    id: 'p2',
    title: 'Validate BST',
    topic: 'Trees',
    difficulty: Difficulty.MEDIUM,
    week: 4,
    description: 'Determine if a binary tree is a valid Binary Search Tree (BST).',
    constraints: ['The number of nodes is in range [1, 10^4]'],
    examples: [{ input: 'root = [2,1,3]', output: 'true' }],
    visualizationType: 'tree'
  },
  {
    id: 'p3',
    title: 'Edit Distance',
    topic: 'Dynamic Programming',
    difficulty: Difficulty.HARD,
    week: 5,
    description: 'Calculate minimum operations to convert word1 to word2.',
    constraints: ['0 <= word1.length <= 500'],
    examples: [{ input: 'word1 = "horse", word2 = "ros"', output: '3' }],
    visualizationType: 'dp_table'
  },
  {
    id: 'p4',
    title: 'Trapping Rain Water',
    topic: 'Arrays',
    difficulty: Difficulty.HARD,
    week: 2,
    description: 'Compute how much water can be trapped after raining.',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4'],
    examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }],
    visualizationType: 'array'
  },
  {
    id: 'p5',
    title: 'Linked List Cycle',
    topic: 'Linked Lists',
    difficulty: Difficulty.EASY,
    week: 2,
    description: 'Determine if a linked list has a cycle in it.',
    constraints: ['Number of nodes is [0, 10^4]'],
    examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true' }],
    visualizationType: 'array'
  }
];

export const MOCK_EVENTS: UserEvent[] = [
  { id: 'e1', type: 'Hackathon', title: 'CodeSymphony 2025', date: 'March 15-17', organizer: 'TechCorp', prize: '$5,000' },
  { id: 'e2', type: 'Hiring', title: 'Data Structures Sprint', date: 'April 2', organizer: 'GlobalSoft', prize: 'Interview Call' },
  { id: 'e3', type: 'Codathon', title: 'Binary Battle', date: 'March 22', organizer: 'College CS Dept', prize: 'Premium Dev Kit' },
];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'user',
  email: 'user@college.edu',
  role: Role.STUDENT,
  semester: 4,
  solvedProblemIds: ['p1', 'p5'],
  attemptedProblemIds: ['p2'],
  streak: 14,
  points: 1250,
  skills: ['Array Optimization', 'Logic Mapping', 'Swift Diagnostics']
};

export const ADMIN_USER: User = {
  id: 'u2',
  name: 'Dr. Sarah Smith',
  email: 's.smith@college.edu',
  role: Role.ADMIN,
  semester: 0,
  solvedProblemIds: [],
  attemptedProblemIds: [],
  streak: 0,
  points: 0,
  skills: []
};
