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
  optimizedContent: z
    .string()
    .describe(
      'The full, optimized resume content, formatted as a single block of plain text. Maintain the original structure of the resume (sections like Summary, Experience, etc.). Do not wrap this in JSON or any other format.'
    ),
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

Your response must be a JSON object with three keys: "optimizedContent", "missingInformation", and "suggestions".

For the "optimizedContent" key, provide the complete, optimized resume as a single formatted string. Ensure it is plain text, not another JSON object. Re-write the original resume content to make it more impactful and tailored to the specified job role and industry.

For the "missingInformation" key, identify any information that is potentially missing from the resume, such as specific skills, experiences, or qualifications that are highly valued in the specified job role and industry.

For the "suggestions" key, offer concrete suggestions for improving the impact of the resume, such as using stronger action verbs, quantifying accomplishments, and highlighting relevant skills and experiences.
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
