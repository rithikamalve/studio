'use server';
/**
 * @fileOverview Provides a Genkit flow for identifying and summarizing document clauses in plain English.
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

const ClauseSummarySchema = z.object({
  clause: z.string().describe('The original text of the legal clause.'),
  summary: z.string().describe('The plain English summary of the clause.'),
});

const SummarizeClausesOutputSchema = z.object({
  clauseSummaries: z.array(ClauseSummarySchema).describe('An array of objects, each containing an original clause and its plain English summary.'),
});
export type SummarizeClausesOutput = z.infer<typeof SummarizeClausesOutputSchema>;

export async function summarizeClauses(input: SummarizeClausesInput): Promise<SummarizeClausesOutput> {
  return summarizeClausesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeClausesPrompt',
  input: {schema: SummarizeClausesInputSchema},
  output: {schema: SummarizeClausesOutputSchema},
  prompt: `You are an expert legal summarizer. Your task is to first identify the distinct legal clauses in the provided document, and then provide a plain English summary for each identified clause. A clause is a complete section or paragraph that deals with a specific point. Do not treat every new line as a new clause.

  Document Text: {{{documentText}}}

  Instructions: 
  1. Parse the document to identify distinct legal clauses.
  2. For each clause, create an object containing the original clause text and its summary in plain English.
  3. Return an array of these objects.
  
  Example Input Document Text:
  1. The Company shall grant the Employee a stock option of 1,000 shares, vested over four years. The Employee must remain employed for a continuous period of one year to be eligible for the first vesting of 250 shares.
  2. Confidentiality. The Employee agrees to not disclose any proprietary information of the Company during and after the term of employment. Unauthorized disclosure will result in immediate termination and legal action.

  Example Output:
  {
    "clauseSummaries": [
      {
        "clause": "1. The Company shall grant the Employee a stock option of 1,000 shares, vested over four years. The Employee must remain employed for a continuous period of one year to be eligible for the first vesting of 250 shares.",
        "summary": "You will receive 1,000 stock options that become available to you over four years. You get the first 250 options after completing one full year of work."
      },
      {
        "clause": "2. Confidentiality. The Employee agrees to not disclose any proprietary information of the Company during and after the term of employment. Unauthorized disclosure will result in immediate termination and legal action.",
        "summary": "You must keep the company's private information secret, both while you work here and after. If you share it without permission, you will be fired and could be sued."
      }
    ]
  }
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
