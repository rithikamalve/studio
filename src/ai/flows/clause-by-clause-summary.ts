
'use server';
/**
 * @fileOverview Provides a Genkit flow for identifying and summarizing document clauses in plain English.
 *
 * - summarizeClauses - A function that takes document text and returns a plain English summary of each clause.
 * - SummarizeClausesInput - The input type for the summarizeClauses function.
 * - SummarizeClausesOutput - The return type for the summarizeClauses function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
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
  config: {
    model: googleAI.model('gemini-2.0-flash'),
  },
  prompt: `You are an expert legal summarizer. Your task is to first identify the distinct legal clauses in the provided document, and then provide a plain English summary for each identified clause. 

  A clause is a complete section or paragraph that deals with a specific point, often preceded by a number or letter (e.g., "1.", "a.", "Clause IV."). Do not treat every new line or simple sentence as a new clause. Ignore headings or titles that are not part of a substantive clause.

  Document Text: {{{documentText}}}

  Instructions: 
  1. Carefully parse the document to identify distinct, substantive legal clauses.
  2. For each clause, create an object containing the full, original clause text and its summary in plain English.
  3. Return an array of these objects in the specified output format.
  
  Example Input Document Text:
  **Section 1: Stock Options**
  1.1 Grant of Options. The Company shall grant the Employee a stock option of 1,000 shares, vested over four years. 
  1.2 Vesting Schedule. The Employee must remain employed for a continuous period of one year to be eligible for the first vesting of 250 shares.

  **Section 2: Confidentiality**
  2.1 Non-Disclosure. The Employee agrees to not disclose any proprietary information of the Company during and after the term of employment. Unauthorized disclosure will result in immediate termination and legal action.

  Example Output:
  {
    "clauseSummaries": [
      {
        "clause": "1.1 Grant of Options. The Company shall grant the Employee a stock option of 1,000 shares, vested over four years.",
        "summary": "You will be given 1,000 stock options that become available to you over a four-year period."
      },
      {
        "clause": "1.2 Vesting Schedule. The Employee must remain employed for a continuous period of one year to be eligible for the first vesting of 250 shares.",
        "summary": "To get the first 250 options, you need to work for the company for at least one continuous year."
      },
      {
        "clause": "2.1 Non-Disclosure. The Employee agrees to not disclose any proprietary information of the Company during and after the term of employment. Unauthorized disclosure will result in immediate termination and legal action.",
        "summary": "You must keep the company's private information secret, both while you work here and after you leave. If you share it without permission, you could be fired and face legal consequences."
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
