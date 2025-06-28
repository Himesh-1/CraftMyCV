// src/ai/flows/skill-gap-flow.ts
'use server';
/**
 * @fileOverview An AI agent for performing a skill gap analysis between a resume and a job description.
 *
 * - skillGapAnalysis - A function that handles the skill gap analysis.
 * - SkillGapAnalysisInput - The input type for the skillGapAnalysis function.
 * - SkillGapAnalysisOutput - The return type for the skillGapAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillGapAnalysisInputSchema = z.object({
  resumeContent: z.string().describe('The content of the resume.'),
  jobDescription: z.string().describe('The job description to compare against.'),
});
export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

const SkillGapAnalysisOutputSchema = z.object({
  matchingSkills: z.array(z.string()).describe('A list of skills the user has that are relevant to the job.'),
  missingSkills: z.array(z.string()).describe('A list of important skills mentioned in the job description that are not found in the resume.'),
  suggestedSkills: z.array(z.string()).describe('A list of additional skills not explicitly mentioned in the job description but are highly valuable for the role and industry.'),
});
export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisOutputSchema>;

export async function skillGapAnalysis(
  input: SkillGapAnalysisInput
): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: {schema: SkillGapAnalysisInputSchema},
  output: {schema: SkillGapAnalysisOutputSchema},
  prompt: `You are an expert career analyst. Your task is to perform a skill gap analysis by comparing the provided resume against the given job description.

Analyze the resume and the job description to identify three categories of skills:
1.  **matchingSkills**: Identify skills present in the resume that are also mentioned or clearly relevant to the job description.
2.  **missingSkills**: Identify important skills that are explicitly mentioned in the job description but are absent from the resume.
3.  **suggestedSkills**: Suggest other relevant skills that are not in the job description but would be valuable for this role and industry. These should be skills the candidate might want to learn or add if they have them.

**Job Description:**
{{{jobDescription}}}

---

**Resume Content:**
{{{resumeContent}}}
`,
});

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
