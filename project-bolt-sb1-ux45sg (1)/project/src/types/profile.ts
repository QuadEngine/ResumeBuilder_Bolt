export interface Education {
  degree: string;
  institution: string;
  graduationYear: number;
  field: string;
  grade?: string;
}

export interface RelevantRole {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements?: string[];
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  dateAdded: string;
}

export interface ProfileData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
  linkedin: string;
  portfolio: string;
  about: string;
  careerObjective: string;
  target_roles: string[];
  industries: string[];
  seniority: string;
  top_skills: string[];
  achievements: string[];
  certifications: string[];
  education: Education[];
  experience_years: number;
  relevant_roles: RelevantRole[];
  preferred_format: string;
  template: string;
  notes: string;
  resume_text?: string;
  optimized_resume?: string;
  job_descriptions: JobDescription[];
  last_updated: string;
}