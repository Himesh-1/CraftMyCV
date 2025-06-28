'use server';

import {
  optimizeResumeContent as optimizeResumeContentFlow,
  type OptimizeResumeContentInput,
  type OptimizeResumeContentOutput,
} from '@/ai/flows/optimize-resume';
import {
  checkAtsFriendliness as checkAtsFriendlinessFlow,
  type AtsCheckerInput,
  type AtsCheckerOutput,
} from '@/ai/flows/ats-checker-flow';
import {
  generateCoverLetter as generateCoverLetterFlow,
  type GenerateCoverLetterInput,
  type GenerateCoverLetterOutput,
} from '@/ai/flows/cover-letter-flow';
import htmlToDocx from 'html-to-docx';

export async function optimizeResumeContent(
  input: OptimizeResumeContentInput
): Promise<OptimizeResumeContentOutput> {
  try {
    const result = await optimizeResumeContentFlow(input);
    return result;
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw new Error('Failed to optimize resume. Please try again.');
  }
}

export async function checkAtsFriendliness(input: AtsCheckerInput): Promise<AtsCheckerOutput> {
  try {
    const result = await checkAtsFriendlinessFlow(input);
    return result;
  } catch (error) {
    console.error('Error checking ATS friendliness:', error);
    throw new Error('Failed to check ATS score. Please try again.');
  }
}

export async function generateCoverLetter(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  try {
    const result = await generateCoverLetterFlow(input);
    return result;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error('Failed to generate cover letter. Please try again.');
  }
}

export async function generateDocx(htmlString: string): Promise<string> {
  try {
    const fileBuffer = await htmlToDocx(htmlString, undefined, {
      orientation: 'portrait',
      margins: {
        top: 720,
        bottom: 720,
        left: 720,
        right: 720,
      },
    });

    return (fileBuffer as Buffer).toString('base64');
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate DOCX file.');
  }
}
