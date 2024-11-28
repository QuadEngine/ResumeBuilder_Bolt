import { ProcessingError } from './errors';
import { uploadResumeToStorage } from './storage';
import { extractTextFromPDF } from './extractors/pdfExtractor';
import { extractTextFromDOC } from './extractors/docExtractor';
import { extractResumeData } from './groq';
import { validateResumeFile, validateTextContent } from './validators';
import { SUPPORTED_FILE_TYPES } from './constants';
import { toast } from 'react-hot-toast';

export async function processResume(file: File, userId: string) {
  const toastId = toast.loading('Processing resume...');
  
  try {
    // 1. Validate file
    validateResumeFile(file);
    toast.loading('Uploading file...', { id: toastId });

    // 2. Upload to storage
    const downloadURL = await uploadResumeToStorage(file, userId);
    toast.loading('Extracting text...', { id: toastId });

    // 3. Extract text based on file type
    const text = await extractText(file);
    validateTextContent(text);

    toast.loading('Analyzing content...', { id: toastId });

    // 4. Process with AI
    const parsedData = await extractResumeData(text);

    toast.success('Resume processed successfully!', { id: toastId });

    return {
      resumeUrl: downloadURL,
      parsedData
    };
  } catch (error) {
    handleError(error, toastId);
    throw error;
  }
}

async function extractText(file: File): Promise<string> {
  try {
    switch (file.type) {
      case SUPPORTED_FILE_TYPES.PDF:
        return await extractTextFromPDF(file);
      case SUPPORTED_FILE_TYPES.DOC:
      case SUPPORTED_FILE_TYPES.DOCX:
        return await extractTextFromDOC(file);
      default:
        throw new ProcessingError('Unsupported file type');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new ProcessingError(`Text extraction failed: ${error.message}`);
    }
    throw new ProcessingError('Failed to extract text from file');
  }
}

function handleError(error: unknown, toastId: string) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  console.error('Resume processing error:', error);
  toast.error(message, { id: toastId });
}