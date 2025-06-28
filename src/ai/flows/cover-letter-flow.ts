'use server';
/**
 * @fileOverview An AI agent for generating a cover letter.
 *
 * - generateCoverLetter - A function that handles the cover letter generation.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  resumeContent: z.string().describe('The full content of the resume.'),
  jobDescription: z.string().describe('The job description for the role.'),
  userName: z.string().describe('The name of the applicant.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter content as a single block of plain text.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are a professional career coach tasked with writing a compelling cover letter.
Use the provided resume content and job description to create a personalized cover letter for the applicant, whose name is {{{userName}}}.

The cover letter should be professional, concise, and tailored to the specific job. It must highlight the most relevant skills and experiences from the resume that directly match the requirements listed in the job description.

Do not invent new experiences. Structure the letter with a clear introduction, body, and conclusion. Return only the plain text of the cover letter.

**Job Description:**
{{{jobDescription}}}

---

**Applicant's Resume:**
{{{resumeContent}}}
`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
