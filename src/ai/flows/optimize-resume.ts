// src/ai/flows/optimize-resume.ts
'use server';
/**
 * @fileOverview A resume content optimization AI agent.
 *
 * - optimizeResumeContent - A function that handles the resume optimization process.
 * - OptimizeResumeContentInput - The input type for the optimizeResumeContent function.
 * - OptimizeResumeContentOutput - The return type for the optimizeResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeContentInputSchema = z.object({
  resumeContent: z.string().describe('The content of the resume to be optimized.'),
  jobRole: z.string().describe('The job role the user is applying for.'),
  industry: z.string().describe('The industry the job role belongs to.'),
});
export type OptimizeResumeContentInput = z.infer<typeof OptimizeResumeContentInputSchema>;

const OptimizeResumeContentOutputSchema = z.object({
  optimizedContent: z.string().describe('The optimized content of the resume.'),
  missingInformation: z
    .string()
    .describe('Information that is potentially missing from the resume.'),
  suggestions: z.string().describe('Suggestions for improving the impact of the resume.'),
});
export type OptimizeResumeContentOutput = z.infer<typeof OptimizeResumeContentOutputSchema>;

export async function optimizeResumeContent(
  input: OptimizeResumeContentInput
): Promise<OptimizeResumeContentOutput> {
  return optimizeResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumeContentPrompt',
  input: {schema: OptimizeResumeContentInputSchema},
  output: {schema: OptimizeResumeContentOutputSchema},
  prompt: `You are an expert resume optimization consultant.

You will analyze the resume content provided by the user, identify areas for improvement based on the job role and industry specified, identify any potentially missing information, and offer suggestions for improving the impact of existing content.

Job Role: {{{jobRole}}}
Industry: {{{industry}}}

Resume Content:
{{{resumeContent}}}

Optimize the resume content to increase the chances of getting shortlisted. Focus on making the content more impactful and tailored to the specified job role and industry.

Missing Information:
Identify any information that is potentially missing from the resume, such as specific skills, experiences, or qualifications that are highly valued in the specified job role and industry.

Suggestions:
Offer concrete suggestions for improving the impact of the resume, such as using stronger action verbs, quantifying accomplishments, and highlighting relevant skills and experiences.
`,
});

const optimizeResumeContentFlow = ai.defineFlow(
  {
    name: 'optimizeResumeContentFlow',
    inputSchema: OptimizeResumeContentInputSchema,
    outputSchema: OptimizeResumeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
