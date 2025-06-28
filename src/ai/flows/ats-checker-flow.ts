// src/ai/flows/ats-checker-flow.ts
'use server';
/**
 * @fileOverview An AI agent for checking resume against a job description from an ATS perspective.
 *
 * - checkAtsFriendliness - A function that handles the ATS check.
 * - AtsCheckerInput - The input type for the checkAtsFriendliness function.
 * - AtsCheckerOutput - The return type for the checkAtsFriendliness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AtsCheckerInputSchema = z.object({
  resumeContent: z.string().describe('The content of the resume.'),
  jobDescription: z.string().describe('The job description to compare against.'),
});
export type AtsCheckerInput = z.infer<typeof AtsCheckerInputSchema>;

const AtsCheckSchema = z.object({
  text: z.string().describe('A description of the check performed.'),
  status: z.enum(['pass', 'fail', 'warn']).describe('The result of the check.'),
});

const AtsCheckerOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('An overall match score from 0 to 100.'),
  checks: z
    .array(AtsCheckSchema)
    .describe('An array of specific checks and their results.'),
});
export type AtsCheckerOutput = z.infer<typeof AtsCheckerOutputSchema>;

export async function checkAtsFriendliness(input: AtsCheckerInput): Promise<AtsCheckerOutput> {
  return atsCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsCheckerPrompt',
  input: {schema: AtsCheckerInputSchema},
  output: {schema: AtsCheckerOutputSchema},
  prompt: `You are an advanced Applicant Tracking System (ATS). Your task is to analyze the provided resume against the given job description.

Analyze the following:
1.  **Keyword Matching**: Does the resume contain relevant keywords from the job description? (e.g., skills, technologies, responsibilities).
2.  **Formatting**: Is the resume easy to parse? Avoid complex layouts, tables, or columns.
3.  **Contact Information**: Is contact information present and correctly formatted?
4.  **Quantifiable Achievements**: Does the resume use numbers and metrics to quantify accomplishments?
5.  **Relevance**: Is the experience and summary tailored to the job description?

Based on your analysis, provide an overall match score from 0 to 100 and a list of checks with their status ('pass', 'fail', or 'warn').

**Job Description:**
{{{jobDescription}}}

---

**Resume Content:**
{{{resumeContent}}}
`,
});

const atsCheckerFlow = ai.defineFlow(
  {
    name: 'atsCheckerFlow',
    inputSchema: AtsCheckerInputSchema,
    outputSchema: AtsCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
