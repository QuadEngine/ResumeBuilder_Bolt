import { toast } from 'react-hot-toast';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/layoutlm-base-uncased';
const HUGGINGFACE_API_KEY = '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'; // I'll provide a working key

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  about?: string;
  careerObjective?: string;
  seniority?: string;
  experience_years?: number;
  education: Array<{
    degree: string;
    institution: string;
    graduationYear: number;
    field: string;
    grade?: string;
  }>;
  top_skills: string[];
  achievements: string[];
  certifications: string[];
  relevant_roles: Array<{
    companyName: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements?: string[];
  }>;
  target_roles?: string[];
  industries?: string[];
  summary?: string;
}

async function makeHuggingFaceRequest(text: string): Promise<any> {
  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('HuggingFace API error:', error);
    throw error;
  }
}

export async function extractResumeData(text: string): Promise<ResumeData> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('No text content provided');
    }

    console.log('Starting resume data extraction...');
    
    // Process text in chunks to handle length limitations
    const maxChunkSize = 5000;
    const chunks = [];
    for (let i = 0; i < text.length; i += maxChunkSize) {
      chunks.push(text.slice(i, i + maxChunkSize));
    }
    
    console.log(`Processing ${chunks.length} text chunks...`);

    // Process each chunk
    const results = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1} of ${chunks.length}`);
      const chunk = chunks[i];
      const result = await makeHuggingFaceRequest(chunk);
      results.push(result);
      
      // Add delay between chunks
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Parse and structure the extracted information
    const parsedData = parseExtractedData(results, text);
    
    console.log('Resume data extraction completed successfully');
    return parsedData;
  } catch (error) {
    console.error('Error in extractResumeData:', error);
    throw error;
  }
}

function parseExtractedData(results: any[], originalText: string): ResumeData {
  // Implement parsing logic here based on the model's output format
  // This is a simplified example
  const data: ResumeData = {
    name: '',
    email: '',
    phone: '',
    education: [],
    top_skills: [],
    achievements: [],
    certifications: [],
    relevant_roles: []
  };

  // Extract email using regex
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const emailMatch = originalText.match(emailRegex);
  if (emailMatch) {
    data.email = emailMatch[0];
  }

  // Extract phone using regex
  const phoneRegex = /(\+\d{1,3}[-.]?)?\s?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
  const phoneMatch = originalText.match(phoneRegex);
  if (phoneMatch) {
    data.phone = phoneMatch[0];
  }

  // Extract LinkedIn URL
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/;
  const linkedinMatch = originalText.match(linkedinRegex);
  if (linkedinMatch) {
    data.linkedin = `https://www.${linkedinMatch[0]}`;
  }

  // Extract skills (common keywords)
  const skillsSection = originalText.match(/SKILLS?:?(.*?)(?:\n\n|\n[A-Z]|$)/is);
  if (skillsSection) {
    data.top_skills = skillsSection[1]
      .split(/[,\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  // Extract education
  const educationSection = originalText.match(/EDUCATION:?(.*?)(?:\n\n|\n[A-Z]|$)/is);
  if (educationSection) {
    const eduText = educationSection[1];
    const degrees = eduText.match(/(?:Bachelor|Master|PhD|B\.|M\.|Ph\.D).*?(?=\n|$)/g);
    if (degrees) {
      data.education = degrees.map(degree => ({
        degree: degree.trim(),
        institution: '',
        graduationYear: new Date().getFullYear(),
        field: '',
        grade: ''
      }));
    }
  }

  // Extract work experience
  const experienceSection = originalText.match(/EXPERIENCE:?(.*?)(?:\n\n|\n[A-Z]|$)/is);
  if (experienceSection) {
    const expText = experienceSection[1];
    const roles = expText.split(/\n(?=[A-Z])/);
    data.relevant_roles = roles.map(role => ({
      companyName: '',
      jobTitle: role.split('\n')[0].trim(),
      startDate: '',
      endDate: '',
      description: role.trim()
    }));
  }

  return data;
}