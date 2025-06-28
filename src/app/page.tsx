
'use client';

import { useState } from 'react';
import type { ResumeData, ResumeTemplate } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeForm } from '@/components/craft-my-cv/resume-form';
import { ResumePreview } from '@/components/craft-my-cv/resume-preview';
import { AIOptimizer } from '@/components/craft-my-cv/ai-optimizer';
import { ATSChecker } from '@/components/craft-my-cv/ats-checker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CoverLetterGenerator } from '@/components/craft-my-cv/cover-letter-generator';

const initialResumeData: ResumeData = {
  personalDetails: {
    fullName: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    address: 'Anytown, USA',
    website: 'johndoe.dev',
  },
  summary:
    'Innovative and deadline-driven Software Engineer with 5+ years of experience designing and developing user-centered applications from initial concept to final, polished deliverable.',
  aboutMe:
    'I am passionate about designing digital experiences that are both visually stunning and intuitive, and always strive to create designs that delight and engage users.',
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'Metropolis, USA',
      startDate: '2021-01-01',
      endDate: 'Present',
      description:
        '- Lead the development of a new microservices-based architecture, improving system scalability by 40%.\n- Mentor junior engineers, conduct code reviews, and promote best practices in software development.',
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      location: 'Townsville, USA',
      graduationDate: '2019-05-01',
      details: 'GPA: 3.8/4.0, Magna Cum Laude\nRelevant Coursework:\n- Data Structures & Algorithms\n- Web Development\n- Database Systems',
    },
  ],
  skills: [
    { id: 'skill1', name: 'TypeScript', level: 5 },
    { id: 'skill2', name: 'React', level: 5 },
    { id: 'skill3', name: 'Node.js', level: 4 },
    { id: 'skill4', name: 'System Design', level: 4 },
  ],
  activities: 'Literature • Environmental conservation • Art • Yoga • Skiing • Travel',
  leadership: 'Served as Vice President of the Project Management Club at university'
};

export default function CraftMyCVPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [template, setTemplate] = useState<ResumeTemplate>('modern');

  return (
    <div className="flex flex-col h-screen bg-background">
      <PageHeader />
      <main className="flex-1 grid md:grid-cols-2 gap-4 lg:gap-8 p-4 lg:p-6 overflow-hidden">
        <div className="flex flex-col h-full min-h-0">
          <Tabs defaultValue="editor" className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="optimizer">AI Optimizer</TabsTrigger>
              <TabsTrigger value="ats">ATS Checker</TabsTrigger>
              <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="flex-1 overflow-hidden p-1 min-h-0">
              <ScrollArea className="h-full pr-4">
                <ResumeForm
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="optimizer" className="flex-1 overflow-hidden p-1 min-h-0">
               <ScrollArea className="h-full pr-4">
                <AIOptimizer resumeData={resumeData} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="ats" className="flex-1 p-1 mt-0 overflow-hidden min-h-0">
              <ScrollArea className="h-full pr-4">
                <ATSChecker resumeData={resumeData} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="cover-letter" className="flex-1 overflow-hidden p-1 min-h-0">
              <ScrollArea className="h-full pr-4">
                <CoverLetterGenerator resumeData={resumeData} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        <div className="hidden md:flex flex-col h-full overflow-hidden">
          <ResumePreview
            data={resumeData}
            template={template}
            onTemplateChange={setTemplate}
          />
        </div>
      </main>
    </div>
  );
}
