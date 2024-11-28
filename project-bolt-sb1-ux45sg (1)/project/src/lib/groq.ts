import { APIError } from './errors';
import { toast } from 'react-hot-toast';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = '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';

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    graduationYear: number;
    field: string;
  }[];
}

export async function extractResumeData(text: string): Promise<ResumeData> {
  try {
    validateInput(text);

    const response = await makeAPIRequest(text);
    const data = await handleAPIResponse(response);
    
    return validateAndTransformData(data);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

function validateInput(text: string) {
  if (!text?.trim()) {
    throw new APIError('No text content provided for analysis');
  }
}

async function makeAPIRequest(text: string) {
  try {
    return await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'Extract structured information from resume text. Return valid JSON only.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });
  } catch (error) {
    throw new APIError('Failed to connect to AI service');
  }
}

async function handleAPIResponse(response: Response) {
  if (!response.ok) {
    throw new APIError(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices?.[0]?.message?.content) {
    throw new APIError('Invalid API response format');
  }

  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    throw new APIError('Failed to parse API response');
  }
}

function validateAndTransformData(data: any): ResumeData {
  const requiredFields = ['fullName', 'email', 'phone', 'summary', 'skills'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new APIError(`Missing required field: ${field}`);
    }
  }

  return {
    ...data,
    skills: Array.isArray(data.skills) ? data.skills : data.skills.split(',').map((s: string) => s.trim()),
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : []
  };
}

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Failed to process resume content';
  console.error('AI processing error:', error);
  toast.error(message);
}