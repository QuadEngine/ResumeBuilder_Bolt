import { z } from 'zod';
import { APIError } from '../errors';
import { API_CONFIG } from '../constants';
import { delay } from '../utils';

// Validation schemas
const experienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string()
});

const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  graduationYear: z.number(),
  field: z.string()
});

const resumeDataSchema = z.object({
  fullName: z.string(),
  title: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  location: z.string().optional(),
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema)
});

export type ResumeData = z.infer<typeof resumeDataSchema>;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function callGroqAPI(text: string, systemPrompt: string, retryCount = 0): Promise<ResumeData> {
  try {
    const response = await fetch(API_CONFIG.GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new APIError(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new APIError('Invalid API response format');
    }

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      const validationResult = resumeDataSchema.safeParse(parsedContent);

      if (!validationResult.success) {
        if (retryCount < MAX_RETRIES) {
          await delay(RETRY_DELAY);
          return callGroqAPI(text, systemPrompt, retryCount + 1);
        }
        throw new APIError('Failed to extract valid resume data');
      }

      return validationResult.data;
    } catch (parseError) {
      if (retryCount < MAX_RETRIES) {
        await delay(RETRY_DELAY);
        return callGroqAPI(text, systemPrompt, retryCount + 1);
      }
      throw new APIError('Failed to parse API response');
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError('Failed to connect to AI service');
  }
}