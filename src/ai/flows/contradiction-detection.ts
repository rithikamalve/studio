'use server';
/**
 * @fileOverview Provides a Genkit flow for detecting contradictory clauses in a document.
 *
 * - detectContradictions - A function that takes document text and returns a list of contradictory clauses.
 * - ContradictionDetectionInput - The input type for the detectContradictions function.
 * - ContradictionDetectionOutput - The return type for the detectContradictions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContradictionDetectionInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to be checked for contradictions.'),
});
export type ContradictionDetectionInput = z.infer<typeof ContradictionDetectionInputSchema>;

const ContradictionSchema = z.object({
    contradictoryClauses: z.array(z.string()).length(2).describe('The two clauses that contradict each other.'),
    explanation: z
      .string()
      .describe(
        'An explanation of why these two clauses are contradictory.'
      ),
  });

const ContradictionDetectionOutputSchema = z.object({
    contradictions: z.array(ContradictionSchema).describe('An array of detected contradictions.'),
});
export type ContradictionDetectionOutput = z.infer<typeof ContradictionDetectionOutputSchema>;


export async function detectContradictions(input: ContradictionDetectionInput): Promise<ContradictionDetectionOutput> {
  return detectContradictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contradictionDetectionPrompt',
  input: {schema: ContradictionDetectionInputSchema},
  output: {schema: ContradictionDetectionOutputSchema},
  prompt: `You are an expert legal analyst. Your task is to carefully read the following document and identify any clauses that contradict each other.

For each pair of contradictory clauses you find, provide the full text of both clauses and a clear explanation of why they are contradictory.

If no contradictions are found, return an empty array.

Document Text:
{{{documentText}}}
`,
});

const detectContradictionsFlow = ai.defineFlow(
  {
    name: 'detectContradictionsFlow',
    inputSchema: ContradictionDetectionInputSchema,
    outputSchema: ContradictionDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
