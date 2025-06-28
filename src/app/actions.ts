'use server';

import {
  optimizeResumeContent as optimizeResumeContentFlow,
  type OptimizeResumeContentInput,
  type OptimizeResumeContentOutput,
} from '@/ai/flows/optimize-resume';

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
