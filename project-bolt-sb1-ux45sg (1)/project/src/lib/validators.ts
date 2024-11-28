import { ProcessingError } from './errors';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from './constants';

export function validateResumeFile(file: File): void {
  if (!file) {
    throw new ProcessingError('No file provided');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ProcessingError('File size exceeds 5MB limit');
  }

  const supportedTypes = Object.values(SUPPORTED_FILE_TYPES);
  if (!supportedTypes.includes(file.type as any)) {
    throw new ProcessingError(
      'Invalid file type. Please upload a PDF or Word document'
    );
  }
}

export function validateTextContent(text: string): void {
  if (!text?.trim()) {
    throw new ProcessingError('No text content could be extracted from the file');
  }
}