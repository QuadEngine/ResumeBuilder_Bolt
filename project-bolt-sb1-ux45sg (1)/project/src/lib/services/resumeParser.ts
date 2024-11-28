import { APIError } from '../errors';
import { callGroqAPI } from '../api/groq';
import type { ResumeData } from '../api/groq';

const RESUME_PARSE_PROMPT = `
You are a precise resume parser. Extract structured information from the provided resume text.
Focus on accuracy and completeness. Return a valid JSON object with the following structure:

{
  "fullName": "Full name of the candidate",
  "email": "Email address",
  "phone": "Phone number",
  "summary": "Professional summary or objective",
  "skills": ["Array of technical and soft skills"],
  "experience": [
    {
      "company": "Company name",
      "position": "Job title",
      "startDate": "Start date (MM/YYYY)",
      "endDate": "End date (MM/YYYY or Present)",
      "description": "Role description"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "Institution name",
      "graduationYear": "Year as number",
      "field": "Field of study"
    }
  ]
}

Important guidelines:
- Extract all available information accurately
- Format dates as MM/YYYY
- Convert years to numbers
- Keep descriptions concise but complete
- Include all relevant skills mentioned
- Ensure proper formatting of contact information
- Return valid JSON only, no additional text`;

export async function parseResumeContent(text: string): Promise<ResumeData> {
  try {
    if (!text?.trim()) {
      throw new APIError('No text content to parse');
    }

    // Clean and normalize text
    const cleanedText = text
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim();

    return await callGroqAPI(cleanedText, RESUME_PARSE_PROMPT);
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Failed to parse resume content');
  }
}