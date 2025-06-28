
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle2, FileWarning, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { skillGapAnalysis } from '@/app/actions';
import type { ResumeData } from '@/lib/types';
import type { SkillGapAnalysisOutput } from '@/ai/flows/skill-gap-flow';


interface SkillGapAnalyzerProps {
  resumeData: ResumeData;
}

export function SkillGapAnalyzer({ resumeData }: SkillGapAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<SkillGapAnalysisOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const stringifyResume = (data: ResumeData): string => {
    let content = `Full Name: ${data.personalDetails.fullName}\n`;
    content += `Title: ${data.personalDetails.title}\n\n`;
    content += `Summary/Objective:\n${data.summary}\n\n`;
    content += `Experience:\n`;
    data.experience.forEach(exp => {
      content += `- ${exp.jobTitle} at ${exp.company}\n${exp.description}\n`;
    });
    content += `\nEducation:\n`;
    data.education.forEach(edu => {
      content += `- ${edu.degree} from ${edu.institution}\n${edu.details}\n`;
    });
    content += `\nSkills: ${data.skills.map(s => s.name).join(', ')}\n`;
    if (data.leadership) {
      content += `\nLeadership: ${data.leadership}\n`;
    }
    return content.trim();
  };


  const handleAnalyze = () => {
    if (!jobDescription) {
      toast({
        title: 'Missing Job Description',
        description: 'Please paste the job description to analyze your skills.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const resumeContent = stringifyResume(resumeData);
        const res = await skillGapAnalysis({
          resumeContent,
          jobDescription,
        });
        setResult(res);
      } catch (error) {
        toast({
          title: 'Analysis Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
        setResult(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Target className="text-accent" /> AI Skill Gap Analyzer
          </CardTitle>
          <CardDescription>
            See how your skills stack up against a job description and get suggestions for improvement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobDescriptionSkill">Job Description</Label>
            <Textarea
              id="jobDescriptionSkill"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={10}
            />
          </div>
          <Button onClick={handleAnalyze} disabled={isPending}>
            {isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>) : 'Analyze Skills'}
          </Button>
        </CardContent>
      </Card>

       {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-green-500" /> Matching Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.matchingSkills.length > 0 ? (
                result.matchingSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)
              ) : <p className="text-sm text-muted-foreground">No direct skill matches found.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileWarning className="h-5 w-5 text-yellow-500" /> Missing Key Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
               {result.missingSkills.length > 0 ? (
                result.missingSkills.map(skill => <Badge key={skill} variant="destructive">{skill}</Badge>)
              ) : <p className="text-sm text-muted-foreground">Great job! No key skills seem to be missing.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-5 w-5 text-blue-500" /> Suggested Skills to Add
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.suggestedSkills.length > 0 ? (
                result.suggestedSkills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)
              ) : <p className="text-sm text-muted-foreground">No specific suggestions at this time.</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
