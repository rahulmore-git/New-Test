export const users = [
  { name: 'Alice Example', email: 'alice@example.com', password: 'password123' },
  { name: 'Bob Example', email: 'bob@example.com', password: 'password123' },
];

export function tasksFor(userId) {
  return [
    {
      user: userId,
      title: 'Plan sprint tasks',
      description: 'Outline goals and epics for the next sprint',
      completed: false,
      priority: 'high',
      tags: ['planning', 'sprint'],
    },
    {
      user: userId,
      title: 'Code review PR #42',
      description: 'Review and leave actionable feedback',
      completed: true,
      priority: 'medium',
      tags: ['review'],
    },
    {
      user: userId,
      title: 'Refactor auth middleware',
      description: 'Improve readability and test coverage',
      completed: false,
      priority: 'low',
      tags: ['tech-debt', 'auth'],
    },
  ];
}


