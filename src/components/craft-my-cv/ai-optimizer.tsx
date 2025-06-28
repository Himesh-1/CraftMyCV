'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, ClipboardCopy, FileWarning, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { optimizeResumeContent } from '@/app/actions';
import type { ResumeData, OptimizeResumeContentOutput } from '@/lib/types';

interface AIOptimizerProps {
  resumeData: ResumeData;
}

export function AIOptimizer({ resumeData }: AIOptimizerProps) {
  const [jobRole, setJobRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [result, setResult] = useState<OptimizeResumeContentOutput | null>(null);
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
    content += `\nSkills: ${data.skills.map(s => s.name).join(', ')}\n`;
    if (data.activities) {
        content += `\nActivities: ${data.activities}\n`;
    }
    return content;
  };

  const handleImport = () => {
    const content = stringifyResume(resumeData);
    setResumeContent(content);
    toast({ title: "Success", description: "Resume content imported from editor." });
  };
  
  const handleOptimize = () => {
    if (!resumeContent || !jobRole || !industry) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before optimizing.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const res = await optimizeResumeContent({
          resumeContent,
          jobRole,
          industry,
        });
        setResult(res);
      } catch (error) {
        toast({
          title: 'Optimization Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
        setResult(null);
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-accent"/> AI Resume Optimizer</CardTitle>
          <CardDescription>
            Get AI-powered feedback to tailor your resume for a specific job role and industry.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobRole">Target Job Role</Label>
            <Input id="jobRole" placeholder="e.g., Senior Product Manager" value={jobRole} onChange={e => setJobRole(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" placeholder="e.g., Tech, FinTech" value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="resumeContent">Resume Content</Label>
              <Button variant="link" size="sm" onClick={handleImport}>Import from editor</Button>
            </div>
            <Textarea
              id="resumeContent"
              placeholder="Paste your resume here or import from the editor."
              value={resumeContent}
              onChange={e => setResumeContent(e.target.value)}
              rows={10}
            />
          </div>
          <Button onClick={handleOptimize} disabled={isPending}>
            {isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...</>) : 'Optimize with AI'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle>Optimized Content</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.optimizedContent)}><ClipboardCopy className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm">{result.optimizedContent}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-destructive" />
                <CardTitle>Missing Information</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.missingInformation)}><ClipboardCopy className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm">{result.missingInformation}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <CardTitle>Suggestions for Impact</CardTitle>
              </div>
               <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.suggestions)}><ClipboardCopy className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm">{result.suggestions}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
