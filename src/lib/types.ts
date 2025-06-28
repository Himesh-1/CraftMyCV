export interface PersonalDetails {
  fullName: string;
  title: string;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  details: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  activities: string;
}

export type ResumeTemplate = 'mit' | 'harvard' | 'classic' | 'modern' | 'ats-classic';
