import mammoth from 'mammoth';
import { ExtractorError } from '../errors';

export async function extractTextFromDOC(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();

    if (!text) {
      throw new ExtractorError('No text content found in document');
    }

    return text;
  } catch (error) {
    if (error instanceof ExtractorError) {
      throw error;
    }
    throw new ExtractorError(
      'Failed to extract text from document. Please ensure the file is not corrupted.'
    );
  }
}