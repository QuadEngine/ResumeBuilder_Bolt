import * as pdfjsLib from 'pdfjs-dist';
import { ExtractorError } from '../errors';
import 'web-streams-polyfill';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    
    // Enhanced PDF loading configuration
    const loadingTask = pdfjsLib.getDocument({
      data: buffer,
      useWorkerFetch: false,
      isEvalSupported: true,
      useSystemFonts: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      disableFontFace: true
    });

    const pdf = await loadingTask.promise;
    let fullText = '';
    let hasContent = false;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      // Get both standard text content and marked content
      const [textContent, structTree] = await Promise.all([
        page.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false
        }),
        page.getStructTree()
      ]);
      
      // Process text content
      const pageText = textContent.items
        .filter((item: any) => typeof item.str === 'string' && item.str.trim())
        .map((item: any) => item.str)
        .join(' ');

      if (pageText.trim()) {
        hasContent = true;
        fullText += pageText + '\n';
      }

      // Add small delay between pages to prevent overload
      await delay(100);
    }

    if (!hasContent) {
      throw new ExtractorError('No readable text content found in PDF. The file might be scanned or image-based.');
    }

    // Clean up the extracted text
    const cleanedText = fullText
      .trim()
      .replace(/[\r\n]+/g, '\n')
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .trim();

    return cleanedText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    
    if (error instanceof ExtractorError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new ExtractorError('Invalid or corrupted PDF file');
      }
      if (error.message.includes('Password')) {
        throw new ExtractorError('Cannot process password-protected PDF files');
      }
      if (error.message.includes('Worker')) {
        throw new ExtractorError('PDF processing service is temporarily unavailable');
      }
    }

    throw new ExtractorError('Failed to extract text from PDF. Please ensure the file is not corrupted or password-protected.');
  }
}