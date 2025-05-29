// Concept: Completion — servers provide auto-complete suggestions for resource
// template arguments. The `complete.category` callback below returns available
// category names so clients can offer a dropdown or typeahead as the user types.
// https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/completion

import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

import { type ResourceTemplateDefinition, resourceResponse } from '../registry.js';

const categoryTips: Record<string, { description: string; tips: string[] }> = {
  planning: {
    description: 'Tips for breaking down and planning your work.',
    tips: [
      'Break large tasks into steps you can finish in one sitting.',
      'Write the very next physical action, not a vague goal.',
      'Put a time estimate on each item so you can plan your day.',
    ],
  },
  prioritization: {
    description: 'Strategies for deciding what to work on first.',
    tips: [
      'Use the Eisenhower matrix: urgent vs. important.',
      'Do the hardest task first (eat the frog).',
      'Limit work-in-progress — finish before you start.',
    ],
  },
  habits: {
    description: 'Building consistency with daily and weekly routines.',
    tips: [
      'Review your todo list at the same time every day.',
      'Do a weekly review to clean out stale items.',
      'Celebrate completed items — it reinforces the habit.',
    ],
  },
  focus: {
    description: 'Techniques for staying on task and avoiding distractions.',
    tips: [
      'Work in focused blocks (e.g. Pomodoro technique).',
      'Turn off notifications while working on a task.',
      'Single-task: close everything unrelated to the current todo.',
    ],
  },
};

const readCallback: ResourceTemplateDefinition['readCallback'] = async (uri, variables) => {
  const category = variables.category as string;
  const entry = categoryTips[category];

  if (!entry) {
    return resourceResponse(
      {
        errors: [
          {
            detail: `Unknown category: ${category}`,
            meta: {
              availableCategories: Object.keys(categoryTips),
            },
          },
        ],
      },
      new URL(uri.href),
    );
  }

  return resourceResponse(
    {
      data: { category, ...entry },
      links: {
        self: uri.href,
      },
    },
    uri,
  );
};

export const tipsTemplate: ResourceTemplateDefinition = {
  title: 'Todo Productivity Tips',
  resourceTemplate: new ResourceTemplate('todos://tips/{category}', {
    list: undefined,
    complete: {
      category: async () => Object.keys(categoryTips),
    },
  }),
  metadata: {
    description: 'Productivity tips organized by category, with auto-completion',
    mimeType: 'application/json',
  },
  readCallback,
};
