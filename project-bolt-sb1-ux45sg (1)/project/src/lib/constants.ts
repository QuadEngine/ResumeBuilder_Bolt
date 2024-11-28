export const SUPPORTED_FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const API_CONFIG = {
  GROQ_URL: 'https://api.groq.com/openai/v1/chat/completions',
  GROQ_KEY: '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'
} as const;

export const STORAGE_PATHS = {
  RESUMES: 'resumes',
  PROFILE_PHOTOS: 'profile-photos'
} as const;