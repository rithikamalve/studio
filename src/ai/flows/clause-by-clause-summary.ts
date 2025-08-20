'use server';
/**
 * @fileOverview Provides a Genkit flow for summarizing document clauses in plain English.
 *
 * - summarizeClauses - A function that takes document text and returns a plain English summary of each clause.
 * - SummarizeClausesInput - The input type for the summarizeClauses function.
 * - SummarizeClausesOutput - The return type for the summarizeClauses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeClausesInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to be summarized clause by clause.'),
});
export type SummarizeClausesInput = z.infer<typeof SummarizeClausesInputSchema>;

const SummarizeClausesOutputSchema = z.object({
  clauseSummaries: z.array(z.string()).describe('An array of plain English summaries for each clause in the document.'),
});
export type SummarizeClausesOutput = z.infer<typeof SummarizeClausesOutputSchema>;

export async function summarizeClauses(input: SummarizeClausesInput): Promise<SummarizeClausesOutput> {
  return summarizeClausesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeClausesPrompt',
  input: {schema: SummarizeClausesInputSchema},
  output: {schema: SummarizeClausesOutputSchema},
  prompt: `You are an expert legal summarizer. Your task is to provide a plain English summary of each clause in a legal document.

  Document Text: {{{documentText}}}

  Instructions: Summarize each clause in the document in plain English. Return an array of summaries, where each element corresponds to the summary of each clause in the document.
  Example Input Document Text:
  Clause 1: The company shall not be liable for any indirect, incidental, or consequential damages arising out of the use of the product.
  Clause 2: The user agrees to indemnify and hold harmless the company from any claims, damages, or expenses arising out of the user's use of the product.

  Example Output:
  [
  "The company is not responsible for indirect damages resulting from product use.",
  "The user will protect the company from any claims or expenses related to their use of the product."
  ]
  `,
});

const summarizeClausesFlow = ai.defineFlow(
  {
    name: 'summarizeClausesFlow',
    inputSchema: SummarizeClausesInputSchema,
    outputSchema: SummarizeClausesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
