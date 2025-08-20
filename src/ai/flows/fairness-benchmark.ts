'use server';

/**
 * @fileOverview Provides a Genkit flow for benchmarking a document against common legal practices in India.
 *
 * - benchmarkFairness - A function that takes document text and returns a list of flagged clauses.
 * - FairnessBenchmarkInput - The input type for the benchmarkFairness function.
 * - FairnessBenchmarkOutput - The return type for the benchmarkFairness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FairnessBenchmarkInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to be benchmarked.'),
});
export type FairnessBenchmarkInput = z.infer<typeof FairnessBenchmarkInputSchema>;

const FlaggedClauseSchema = z.object({
    clause: z.string().describe('The original clause that was flagged.'),
    reason: z
      .string()
      .describe(
        'The reason why this clause is considered stricter or unusual compared to common Indian legal practices.'
      ),
    severity: z
      .enum(['High', 'Medium', 'Low'])
      .describe('The severity of the flagged issue.'),
  });

const FairnessBenchmarkOutputSchema = z.object({
    benchmarks: z.array(FlaggedClauseSchema).describe('An array of flagged clauses with reasons and severity.'),
});
export type FairnessBenchmarkOutput = z.infer<typeof FairnessBenchmarkOutputSchema>;


export async function benchmarkFairness(input: FairnessBenchmarkInput): Promise<FairnessBenchmarkOutput> {
  return benchmarkFairnessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'benchmarkFairnessPrompt',
  input: {schema: FairnessBenchmarkInputSchema},
  output: {schema: FairnessBenchmarkOutputSchema},
  prompt: `You are an expert in Indian contract law and standard business practices. Analyze the following document and identify any clauses that are stricter, more unusual, or less favorable to one party than what is considered standard practice in India. 

For example, a typical rental agreement in India requires a 2-3 month security deposit. A clause asking for a 6-month deposit would be unusual and should be flagged as "High" severity.

For each flagged clause, provide the original clause text, a clear reason why it's being flagged, and a severity level (High, Medium, or Low).

Document Text:
{{{documentText}}}
`,
});

const benchmarkFairnessFlow = ai.defineFlow(
  {
    name: 'benchmarkFairnessFlow',
    inputSchema: FairnessBenchmarkInputSchema,
    outputSchema: FairnessBenchmarkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
