export * from './modern';
export * from './classic';
export * from './creative';
export * from './executive';

export const RESUME_TEMPLATES = {
  modern: 'Modern Professional',
  classic: 'Classic Traditional',
  creative: 'Creative Design',
  executive: 'Executive Leadership'
} as const;

export type TemplateId = keyof typeof RESUME_TEMPLATES;