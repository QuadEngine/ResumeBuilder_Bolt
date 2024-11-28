export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: number;
  field: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}