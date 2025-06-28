'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Loader2, ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCoverLetter } from '@/app/actions';
import type { ResumeData } from '@/lib/types';

interface CoverLetterGeneratorProps {
  resumeData: ResumeData;
}

export function CoverLetterGenerator({ resumeData }: CoverLetterGeneratorProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const stringifyResume = (data: ResumeData): string => {
    let content = `Full Name: ${data.personalDetails.fullName}\n`;
    content += `Title: ${data.personalDetails.title}\n`;
    content += `Email: ${data.personalDetails.email}\n`;
    content += `Phone: ${data.personalDetails.phoneNumber}\n`;
    content += `Address: ${data.personalDetails.address}\n`;
    content += `Website: ${data.personalDetails.website}\n\n`;
    content += `Summary/Objective:\n${data.summary}\n\n`;
    if (data.aboutMe) {
        content += `About Me:\n${data.aboutMe}\n\n`;
    }
    content += `Experience:\n`;
    data.experience.forEach(exp => {
      content += `- ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n${exp.description}\n`;
    });
    content += `\nEducation:\n`;
    data.education.forEach(edu => {
      content += `- ${edu.degree} from ${edu.institution} (${edu.graduationDate})\n${edu.details}\n`;
    });
    content += `\nSkills: ${data.skills.map(s => `${s.name} (level ${s.level}/5)`).join(', ')}\n`;
    if (data.activities) {
        content += `\nActivities: ${data.activities}\n`;
    }
    if (data.leadership) {
      content += `\nLeadership: ${data.leadership}\n`;
    }
    return content.trim();
  };

  const handleGenerate = () => {
    if (!jobDescription) {
      toast({
        title: 'Missing Job Description',
        description: 'Please paste the job description before generating.',
        variant: 'destructive',
      });
      return;
    }
    setGeneratedLetter('');
    startTransition(async () => {
      try {
        const resumeContent = stringifyResume(resumeData);
        const res = await generateCoverLetter({
          resumeContent,
          jobDescription,
          userName: resumeData.personalDetails.fullName,
        });
        setGeneratedLetter(res.coverLetter);
      } catch (error) {
        toast({
          title: 'Generation Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
        setGeneratedLetter('');
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Cover letter copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Mail className="text-accent" /> AI Cover Letter Generator
          </CardTitle>
          <CardDescription>
            Paste a job description and let AI write a tailored cover letter based on your resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={10}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : 'Generate Cover Letter'}
          </Button>
        </CardContent>
      </Card>

      {generatedLetter && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Cover Letter</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedLetter)}>
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-sans text-sm bg-muted/50 p-4 rounded-md">
              {generatedLetter}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
