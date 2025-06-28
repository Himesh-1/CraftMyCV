'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileCheck, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ResumeData } from '@/lib/types';
import type { AtsCheckerOutput } from '@/ai/flows/ats-checker-flow';
import { checkAtsFriendliness } from '@/app/actions';

interface CheckResult {
  text: string;
  status: 'pass' | 'fail' | 'warn';
}

interface AtsResult {
  score: number;
  checks: CheckResult[];
}

interface ATSCheckerProps {
  resumeData: ResumeData;
}

export function ATSChecker({ resumeData }: ATSCheckerProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AtsResult | null>(null);
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
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
    content += `\nSkills: ${data.skills.map(s => `${s.name} (${s.level}/5)`).join(', ')}\n`;
    if (data.activities) {
        content += `\nActivities: ${data.activities}\n`;
    }
    if (data.leadership) {
        content += `\nLeadership: ${data.leadership}\n`;
    }
    return content;
  };

  const handleImport = () => {
    const content = stringifyResume(resumeData);
    setResumeContent(content);
    toast({ title: "Success", description: "Resume content imported from editor." });
  };

  const handleCheck = () => {
    if (!resumeContent || !jobDescription) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both resume and job description.',
        variant: 'destructive',
      });
      return;
    }
    setResult(null);

    startTransition(async () => {
      try {
        const res = await checkAtsFriendliness({
          resumeContent,
          jobDescription,
        });
        setResult(res);
      } catch (error) {
        toast({
          title: 'ATS Check Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
        setResult(null);
      }
    });
  };

  const getIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warn':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const score = result?.score;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <FileCheck className="text-accent" /> ATS Friendliness Checker
          </CardTitle>
          <CardDescription>
            Paste your resume and a job description to see how well you match from an ATS perspective.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <div className="flex justify-between items-center">
                <Label htmlFor="resumeContentAts">Resume Content</Label>
                <Button variant="link" size="sm" onClick={handleImport}>Import from editor</Button>
              </div>
              <Textarea
                id="resumeContentAts"
                placeholder="Paste your resume content here or import from the editor."
                rows={8}
                value={resumeContent}
                onChange={e => setResumeContent(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="jobDescriptionAts">Job Description</Label>
              <Textarea
                id="jobDescriptionAts"
                placeholder="Paste the job description here..."
                rows={8}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
               />
            </div>
          </div>
          <Button onClick={handleCheck} disabled={isPending}>
            {isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</>) : 'Check Score'}
          </Button>
        </CardContent>
      </Card>

      {(isPending || result) && (
        <Card>
          <CardHeader>
            <CardTitle>ATS Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPending && (
                <div className='flex flex-col items-center justify-center gap-4 p-8'>
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p>Analyzing documents...</p>
                </div>
            )}
            {score !== null && score !== undefined && (
                 <div className="flex flex-col items-center justify-center gap-4">
                    <div className="relative h-32 w-32">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="3"
                                strokeDasharray={`${score}, 100`}
                                strokeLinecap='round'
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold font-headline text-primary">{score}</span>
                        </div>
                    </div>
                    <p className="text-lg font-semibold">Overall Match Score</p>
                </div>
            )}
            {result && result.checks && (
                <div className='space-y-2 pt-4'>
                    {result.checks.map((check, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 rounded-md bg-muted/50">
                            {getIcon(check.status)}
                            <p className='text-sm'>{check.text}</p>
                        </div>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
