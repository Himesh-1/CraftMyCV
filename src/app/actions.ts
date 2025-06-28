'use server';

import {
  optimizeResumeContent as optimizeResumeContentFlow,
  type OptimizeResumeContentInput,
  type OptimizeResumeContentOutput,
} from '@/ai/flows/optimize-resume';
import { asBlob } from 'html-to-docx';

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

export async function generateDocx(htmlString: string): Promise<string> {
  try {
    const fileBuffer = (await asBlob(htmlString, {
      orientation: 'portrait',
      margins: {
        top: 720,
        bottom: 720,
        left: 720,
        right: 720,
      },
    })) as Buffer;
    return fileBuffer.toString('base64');
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate DOCX file.');
  }
}
