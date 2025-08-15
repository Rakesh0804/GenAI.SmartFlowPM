/**
 * Task type constants matching the backend TaskTypeConstants
 */

export interface TaskType {
  value: string;
  label: string;
  description: string;
}

export const TASK_TYPE_ACRONYMS = {
  BUG: 'BUG',
  TASK: 'TASK',
  SPIKE: 'SPIKE',
  STORY: 'STORY'
} as const;

export const TASK_TYPE_LABELS = {
  BUG: 'Bug',
  TASK: 'Task',
  SPIKE: 'Spike',
  STORY: 'User Story'
} as const;

export const TASK_TYPE_DESCRIPTIONS = {
  BUG: 'Bug fix or defect resolution',
  TASK: 'General development task',
  SPIKE: 'Research or investigation task',
  STORY: 'Feature development story'
} as const;

export const TASK_TYPES: TaskType[] = [
  {
    value: TASK_TYPE_ACRONYMS.BUG,
    label: TASK_TYPE_LABELS.BUG,
    description: TASK_TYPE_DESCRIPTIONS.BUG
  },
  {
    value: TASK_TYPE_ACRONYMS.TASK,
    label: TASK_TYPE_LABELS.TASK,
    description: TASK_TYPE_DESCRIPTIONS.TASK
  },
  {
    value: TASK_TYPE_ACRONYMS.SPIKE,
    label: TASK_TYPE_LABELS.SPIKE,
    description: TASK_TYPE_DESCRIPTIONS.SPIKE
  },
  {
    value: TASK_TYPE_ACRONYMS.STORY,
    label: TASK_TYPE_LABELS.STORY,
    description: TASK_TYPE_DESCRIPTIONS.STORY
  }
];

export const VALID_TASK_ACRONYMS = Object.values(TASK_TYPE_ACRONYMS);

export const DEFAULT_TASK_ACRONYM = TASK_TYPE_ACRONYMS.TASK;

/**
 * Check if the given acronym is valid
 */
export function isValidTaskAcronym(acronym: string): boolean {
  return VALID_TASK_ACRONYMS.includes(acronym?.toUpperCase() as any);
}

/**
 * Get the display label for a given acronym
 */
export function getTaskTypeLabel(acronym: string): string {
  switch (acronym?.toUpperCase()) {
    case TASK_TYPE_ACRONYMS.BUG:
      return TASK_TYPE_LABELS.BUG;
    case TASK_TYPE_ACRONYMS.TASK:
      return TASK_TYPE_LABELS.TASK;
    case TASK_TYPE_ACRONYMS.SPIKE:
      return TASK_TYPE_LABELS.SPIKE;
    case TASK_TYPE_ACRONYMS.STORY:
      return TASK_TYPE_LABELS.STORY;
    default:
      return acronym || '';
  }
}

/**
 * Get the description for a given acronym
 */
export function getTaskTypeDescription(acronym: string): string {
  switch (acronym?.toUpperCase()) {
    case TASK_TYPE_ACRONYMS.BUG:
      return TASK_TYPE_DESCRIPTIONS.BUG;
    case TASK_TYPE_ACRONYMS.TASK:
      return TASK_TYPE_DESCRIPTIONS.TASK;
    case TASK_TYPE_ACRONYMS.SPIKE:
      return TASK_TYPE_DESCRIPTIONS.SPIKE;
    case TASK_TYPE_ACRONYMS.STORY:
      return TASK_TYPE_DESCRIPTIONS.STORY;
    default:
      return '';
  }
}
