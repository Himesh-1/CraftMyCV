'use client';

import type { ResumeData, WorkExperience, Education, Skill } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FileText,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export function ResumeForm({ resumeData, setResumeData }: ResumeFormProps) {
  const handlePersonalDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [name]: value },
    }));
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData((prev) => ({ ...prev, summary: e.target.value }));
  };

  const handleFieldChange = (
    section: 'experience' | 'education' | 'skills',
    index: number,
    field: string,
    value: string
  ) => {
    setResumeData((prev) => {
      const newSection = [...prev[section]];
      (newSection[index] as any)[field] = value;
      return { ...prev, [section]: newSection };
    });
  };

  const addField = (section: 'experience' | 'education' | 'skills') => {
    setResumeData((prev) => {
      const newId = `${section}-${Date.now()}`;
      let newItem;
      if (section === 'experience') {
        newItem = { id: newId, jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' };
      } else if (section === 'education') {
        newItem = { id: newId, degree: '', institution: '', location: '', graduationDate: '', details: '' };
      } else {
        newItem = { id: newId, name: '' };
      }
      return { ...prev, [section]: [...prev[section], newItem] };
    });
  };

  const removeField = (
    section: 'experience' | 'education' | 'skills',
    idToRemove: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== idToRemove),
    }));
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['personal', 'summary']} className="w-full">
        {/* Personal Details */}
        <AccordionItem value="personal">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-semibold">Personal Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={resumeData.personalDetails.fullName}
                  onChange={handlePersonalDetailsChange}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={resumeData.personalDetails.title}
                  onChange={handlePersonalDetailsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={resumeData.personalDetails.email}
                  onChange={handlePersonalDetailsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={resumeData.personalDetails.phoneNumber}
                  onChange={handlePersonalDetailsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={resumeData.personalDetails.address}
                  onChange={handlePersonalDetailsChange}
                />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="website">Website/Portfolio</Label>
                <Input
                  id="website"
                  name="website"
                  value={resumeData.personalDetails.website}
                  onChange={handlePersonalDetailsChange}
                />
              </div>
          </AccordionContent>
        </AccordionItem>

        {/* Professional Summary */}
        <AccordionItem value="summary">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Professional Summary</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 p-1">
            <Textarea
              value={resumeData.summary}
              onChange={handleSummaryChange}
              rows={5}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <span className="font-semibold">Work Experience</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 p-1">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeField('experience', exp.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input value={exp.jobTitle} onChange={e => handleFieldChange('experience', index, 'jobTitle', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Company</Label>
                        <Input value={exp.company} onChange={e => handleFieldChange('experience', index, 'company', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Location</Label>
                        <Input value={exp.location} onChange={e => handleFieldChange('experience', index, 'location', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" value={exp.startDate} onChange={e => handleFieldChange('experience', index, 'startDate', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" value={exp.endDate} onChange={e => handleFieldChange('experience', index, 'endDate', e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={exp.description} onChange={e => handleFieldChange('experience', index, 'description', e.target.value)} rows={4} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addField('experience')}>
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <span className="font-semibold">Education</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 p-1">
             {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeField('education', edu.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Degree/Certificate</Label>
                        <Input value={edu.degree} onChange={e => handleFieldChange('education', index, 'degree', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input value={edu.institution} onChange={e => handleFieldChange('education', index, 'institution', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Location</Label>
                        <Input value={edu.location} onChange={e => handleFieldChange('education', index, 'location', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <Input type="date" value={edu.graduationDate} onChange={e => handleFieldChange('education', index, 'graduationDate', e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Details (e.g., GPA, Honors)</Label>
                    <Input value={edu.details} onChange={e => handleFieldChange('education', index, 'details', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addField('education')}>
              <Plus className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              <span className="font-semibold">Skills</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 p-1">
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center gap-1 bg-secondary rounded-md p-1 pl-3">
                  <Input 
                    className="bg-transparent border-none h-7 p-0 focus-visible:ring-0" 
                    value={skill.name} 
                    onChange={e => handleFieldChange('skills', index, 'name', e.target.value)}
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeField('skills', skill.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={() => addField('skills')}>
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Activities */}
        <AccordionItem value="activities">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Activities</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 p-1">
             <Label>List your activities or interests, separated by commas or bullets.</Label>
            <Textarea
              value={resumeData.activities}
              onChange={(e) =>
                setResumeData((prev) => ({ ...prev, activities: e.target.value }))
              }
              rows={3}
            />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
